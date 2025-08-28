import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { XMLParser } from 'fast-xml-parser';

export interface ConfigObject {
    name: string;
    type: string;
    displayName: string;
    filePath: string;
    uuid?: string;
    synonym?: string;
    comment?: string;
    children?: ConfigObject[];
    properties?: any;
    icon?: string;
}

export class ConfigObjectParser {
    private xmlParser: XMLParser;

    constructor() {
        this.xmlParser = new XMLParser({
            ignoreAttributes: false,
            attributeNamePrefix: '@_',
            parseAttributeValue: true,
            trimValues: true,
            parseTagValue: true
        });
    }

    async parseWorkspace(): Promise<ConfigObject[]> {
        const results: ConfigObject[] = [];
        
        try {
            console.log('Starting workspace parsing...');
            
            // Check if we have any workspace folders
            const workspaceFolders = vscode.workspace.workspaceFolders;
            if (!workspaceFolders || workspaceFolders.length === 0) {
                console.log('No workspace folders found');
                return results;
            }
            
            console.log(`Found ${workspaceFolders.length} workspace folders`);
            
            // First, try to find Configuration.xml files
            const configFiles = await vscode.workspace.findFiles('**/Configuration.xml', '**/node_modules/**', 10);
            console.log(`Found ${configFiles.length} Configuration.xml files`);
            
            if (configFiles.length > 0) {
                // Process each found configuration
                for (const configFile of configFiles) {
                    console.log(`Processing configuration file: ${configFile.fsPath}`);
                    const configResults = await this.parseConfigurationRoot(configFile.fsPath);
                    if (configResults.length > 0) {
                        // If multiple configurations, group them
                        if (configFiles.length > 1) {
                            const configName = this.getConfigurationName(configFile.fsPath);
                            results.push({
                                name: configName,
                                type: 'configuration-root',
                                displayName: `Configuration: ${configName}`,
                                filePath: path.dirname(configFile.fsPath),
                                children: configResults
                            });
                        } else {
                            results.push(...configResults);
                        }
                    }
                }
            } else {
                console.log('No Configuration.xml found, trying to detect 1C structure patterns');
                // If no Configuration.xml found, try to detect 1C structure patterns
                const detectedConfigs = await this.detectConfigurationStructures();
                results.push(...detectedConfigs);
            }
            
            console.log(`Workspace parsing completed. Found ${results.length} configuration objects`);
        } catch (error) {
            console.error('Error parsing workspace:', error);
            vscode.window.showErrorMessage('Error parsing 1C configurations: ' + error);
        }

        return results;
    }

    private async parseConfigurationRoot(configFilePath: string): Promise<ConfigObject[]> {
        const results: ConfigObject[] = [];
        
        try {
            const configDir = path.dirname(configFilePath);
            const rootConfig = await this.parseConfigurationFile(configFilePath);
            
            if (rootConfig) {
                // Parse all object types
                const objectTypes = this.getObjectTypes();

                for (const objectType of objectTypes) {
                    const objectDir = path.join(configDir, objectType.folder);
                    if (fs.existsSync(objectDir)) {
                        const objects = await this.parseObjectDirectory(objectDir, objectType.type, objectType.icon);
                        if (objects.length > 0) {
                            results.push({
                                name: objectType.folder,
                                type: 'folder',
                                displayName: this.getLocalizedName(objectType.folder),
                                filePath: objectDir,
                                children: objects
                            });
                        }
                    }
                }
            }
        } catch (error) {
            console.error('Error parsing configuration root:', configFilePath, error);
        }

        return results;
    }

    private async parseConfigurationDirectory(configDir: string): Promise<ConfigObject[]> {
        const results: ConfigObject[] = [];
        
        try {
            console.log(`Parsing configuration directory: ${configDir}`);
            // Parse all object types without requiring Configuration.xml
            const objectTypes = this.getObjectTypes();

            for (const objectType of objectTypes) {
                const objectDir = path.join(configDir, objectType.folder);
                if (fs.existsSync(objectDir)) {
                    console.log(`Found ${objectType.folder} directory`);
                    const objects = await this.parseObjectDirectory(objectDir, objectType.type, objectType.icon);
                    if (objects.length > 0) {
                        console.log(`Parsed ${objects.length} objects from ${objectType.folder}`);
                        results.push({
                            name: objectType.folder,
                            type: 'folder',
                            displayName: this.getLocalizedName(objectType.folder),
                            filePath: objectDir,
                            children: objects
                        });
                    }
                }
            }
        } catch (error) {
            console.error('Error parsing configuration directory:', configDir, error);
        }

        return results;
    }

    private async detectConfigurationStructures(): Promise<ConfigObject[]> {
        const results: ConfigObject[] = [];
        
        try {
            console.log('Detecting 1C configuration structures...');
            // Look for typical 1C folders
            const objectTypes = this.getObjectTypes();
            const foundStructures: { [key: string]: ConfigObject[] } = {};
            
            // Broader search for any XML files in typical 1C folders
            for (const objectType of objectTypes) {
                const pattern = `**/${objectType.folder}/**/*.xml`;
                console.log(`Searching for pattern: ${pattern}`);
                const files = await vscode.workspace.findFiles(pattern, '**/node_modules/**', 100);
                console.log(`Found ${files.length} files for ${objectType.folder}`);
                
                for (const file of files) {
                    const configRoot = await this.findConfigurationRoot(file.fsPath, objectType.folder);
                    if (configRoot && !foundStructures[configRoot]) {
                        console.log(`Found potential configuration root: ${configRoot}`);
                        foundStructures[configRoot] = [];
                    }
                }
            }
            
            // Parse each found structure
            for (const configRoot of Object.keys(foundStructures)) {
                console.log(`Parsing configuration root: ${configRoot}`);
                // Try to parse without requiring Configuration.xml
                const configResults = await this.parseConfigurationDirectory(configRoot);
                if (configResults.length > 0) {
                    const configName = this.getConfigurationName(configRoot);
                    results.push({
                        name: configName,
                        type: 'configuration-root',
                        displayName: `Configuration: ${configName} (detected)`,
                        filePath: configRoot,
                        children: configResults
                    });
                }
            }
            
            console.log(`Detected ${results.length} configuration structures`);
        } catch (error) {
            console.error('Error detecting configuration structures:', error);
        }
        
        return results;
    }

    private async findConfigurationRoot(filePath: string, objectTypeFolder: string): Promise<string | null> {
        console.log(`Finding configuration root for file: ${filePath}, object type: ${objectTypeFolder}`);
        
        // Find the directory that contains the object type folder
        const parts = filePath.split(path.sep);
        const objectTypeFolderIndex = parts.lastIndexOf(objectTypeFolder);
        
        if (objectTypeFolderIndex > 0) {
            const potentialRoot = parts.slice(0, objectTypeFolderIndex).join(path.sep);
            console.log(`Potential configuration root: ${potentialRoot}`);
            
            // Check if this looks like a configuration root
            const objectTypes = this.getObjectTypes();
            let foundTypes = 0;
            const foundTypeNames: string[] = [];
            
            for (const objectType of objectTypes) {
                const objectDir = path.join(potentialRoot, objectType.folder);
                if (fs.existsSync(objectDir)) {
                    foundTypes++;
                    foundTypeNames.push(objectType.folder);
                }
            }
            
            console.log(`Found ${foundTypes} object types in ${potentialRoot}: ${foundTypeNames.join(', ')}`);
            
            // If we found at least 2 object types, it's likely a configuration root
            if (foundTypes >= 2) {
                console.log(`Configuration root confirmed: ${potentialRoot}`);
                return potentialRoot;
            }
        }
        
        console.log(`No configuration root found for ${filePath}`);
        return null;
    }

    private getConfigurationName(configPath: string): string {
        const parts = configPath.split(path.sep);
        return parts[parts.length - 1] || 'Unknown';
    }

    private getObjectTypes() {
        return [
            { folder: 'Catalogs', type: 'Catalog', icon: 'symbol-class' },
            { folder: 'Documents', type: 'Document', icon: 'symbol-file' },
            { folder: 'Reports', type: 'Report', icon: 'symbol-method' },
            { folder: 'DataProcessors', type: 'DataProcessor', icon: 'symbol-function' },
            { folder: 'AccumulationRegisters', type: 'AccumulationRegister', icon: 'symbol-array' },
            { folder: 'InformationRegisters', type: 'InformationRegister', icon: 'symbol-interface' },
            { folder: 'ChartsOfCharacteristicTypes', type: 'ChartOfCharacteristicTypes', icon: 'symbol-enum' },
            { folder: 'CommonModules', type: 'CommonModule', icon: 'symbol-module' },
            { folder: 'CommonForms', type: 'CommonForm', icon: 'symbol-structure' },
            { folder: 'CommonCommands', type: 'CommonCommand', icon: 'symbol-event' },
            { folder: 'Constants', type: 'Constant', icon: 'symbol-constant' },
            { folder: 'Enums', type: 'Enum', icon: 'symbol-enum-member' },
            { folder: 'Roles', type: 'Role', icon: 'symbol-key' },
            { folder: 'Subsystems', type: 'Subsystem', icon: 'symbol-namespace' },
            { folder: 'ExchangePlans', type: 'ExchangePlan', icon: 'sync' },
            { folder: 'ScheduledJobs', type: 'ScheduledJob', icon: 'clock' },
            { folder: 'FunctionalOptions', type: 'FunctionalOption', icon: 'settings-gear' },
            { folder: 'HTTPServices', type: 'HTTPService', icon: 'globe' },
            { folder: 'WebServices', type: 'WebService', icon: 'cloud' }
        ];
    }

    private async parseConfigurationFile(filePath: string): Promise<any> {
        try {
            const content = fs.readFileSync(filePath, 'utf-8');
            const parsed = this.xmlParser.parse(content);
            return parsed.MetaDataObject?.Configuration;
        } catch (error) {
            console.error('Error parsing configuration file:', error);
            return null;
        }
    }

    private async parseObjectDirectory(dirPath: string, objectType: string, icon: string): Promise<ConfigObject[]> {
        const objects: ConfigObject[] = [];
        
        try {
            console.log(`Parsing object directory: ${dirPath} for type: ${objectType}`);
            
            if (!fs.existsSync(dirPath)) {
                console.log(`Directory does not exist: ${dirPath}`);
                return objects;
            }
            
            const files = fs.readdirSync(dirPath, { withFileTypes: true });
            
            // First, look for direct XML files
            const xmlFiles = files.filter(f => f.isFile() && f.name.endsWith('.xml'));
            console.log(`Found ${xmlFiles.length} XML files in ${dirPath}`);

            for (const xmlFile of xmlFiles) {
                const filePath = path.join(dirPath, xmlFile.name);
                const objectData = await this.parseObjectFile(filePath, objectType);
                
                if (objectData) {
                    objects.push({
                        ...objectData,
                        type: objectType,
                        icon: icon
                    });
                }
            }
            
            // Then, look for subdirectories that might contain XML files
            const subDirs = files.filter(f => f.isDirectory());
            console.log(`Found ${subDirs.length} subdirectories in ${dirPath}`);
            
            for (const subDir of subDirs) {
                const subDirPath = path.join(dirPath, subDir.name);
                const subDirObjects = await this.parseObjectDirectory(subDirPath, objectType, icon);
                objects.push(...subDirObjects);
            }
            
        } catch (error) {
            console.error('Error reading directory:', dirPath, error);
        }

        console.log(`Parsed ${objects.length} objects from ${dirPath}`);
        return objects.sort((a, b) => a.displayName.localeCompare(b.displayName));
    }

    private async parseObjectFile(filePath: string, objectType: string): Promise<ConfigObject | null> {
        try {
            const content = fs.readFileSync(filePath, 'utf-8');
            const parsed = this.xmlParser.parse(content);
            
            const objectData = parsed.MetaDataObject?.[objectType];
            if (!objectData) {
                return null;
            }

            const properties = objectData.Properties;
            const name = properties?.Name || path.basename(filePath, '.xml');
            
            let synonym = name;
            if (properties?.Synonym?.['v8:item']) {
                const synonymItem = Array.isArray(properties.Synonym['v8:item']) 
                    ? properties.Synonym['v8:item'].find((item: any) => item['v8:lang'] === 'ru')
                    : properties.Synonym['v8:item'];
                
                if (synonymItem && synonymItem['v8:content']) {
                    synonym = synonymItem['v8:content'];
                }
            }

            return {
                name: name,
                displayName: synonym || name,
                filePath: filePath,
                uuid: objectData['@_uuid'],
                synonym: synonym,
                comment: properties?.Comment,
                properties: properties,
                type: objectType
            };
        } catch (error) {
            console.error('Error parsing object file:', filePath, error);
            return null;
        }
    }

    private getLocalizedName(folderName: string): string {
        const translations: { [key: string]: string } = {
            'Catalogs': 'Справочники',
            'Documents': 'Документы',
            'Reports': 'Отчеты',
            'DataProcessors': 'Обработки',
            'AccumulationRegisters': 'Регистры накопления',
            'InformationRegisters': 'Регистры сведений',
            'ChartsOfCharacteristicTypes': 'Планы видов характеристик',
            'CommonModules': 'Общие модули',
            'CommonForms': 'Общие формы',
            'CommonCommands': 'Общие команды',
            'Constants': 'Константы',
            'Enums': 'Перечисления',
            'Roles': 'Роли',
            'Subsystems': 'Подсистемы',
            'ExchangePlans': 'Планы обмена',
            'ScheduledJobs': 'Регламентные задания',
            'FunctionalOptions': 'Функциональные опции',
            'HTTPServices': 'HTTP сервисы',
            'WebServices': 'Web сервисы'
        };
        
        return translations[folderName] || folderName;
    }

    async getObjectDetails(configObject: ConfigObject): Promise<any> {
        if (configObject.filePath && fs.existsSync(configObject.filePath)) {
            const content = fs.readFileSync(configObject.filePath, 'utf-8');
            const parsed = this.xmlParser.parse(content);
            return parsed.MetaDataObject;
        }
        return null;
    }
}