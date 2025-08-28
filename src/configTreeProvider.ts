import * as vscode from 'vscode';
import { ConfigObject, ConfigObjectParser } from './configParser';

export class ConfigTreeItem extends vscode.TreeItem {
    constructor(
        public readonly configObject: ConfigObject,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState
    ) {
        super(configObject.displayName, collapsibleState);
        
        this.tooltip = this.getTooltip();
        this.description = this.getDescription();
        this.contextValue = this.getContextValue();
        this.iconPath = this.getIcon();
        
        if (configObject.type !== 'folder' && configObject.type !== 'help' && configObject.filePath) {
            this.command = {
                command: 'vscode.open',
                title: 'Open',
                arguments: [vscode.Uri.file(configObject.filePath)]
            };
        } else if (configObject.type === 'help') {
            this.command = {
                command: '1cConfigViewer.showHelp',
                title: 'Show Help'
            };
        }
    }

    private getTooltip(): string {
        const obj = this.configObject;
        let tooltip = `${obj.displayName} (${obj.type})`;
        
        if (obj.comment) {
            tooltip += `\n${obj.comment}`;
        }
        
        if (obj.uuid) {
            tooltip += `\nUUID: ${obj.uuid}`;
        }
        
        return tooltip;
    }

    private getDescription(): string | undefined {
        if (this.configObject.type === 'folder') {
            const count = this.configObject.children?.length || 0;
            return count > 0 ? `(${count})` : undefined;
        }
        return this.configObject.name !== this.configObject.displayName ? this.configObject.name : undefined;
    }

    private getContextValue(): string {
        if (this.configObject.type === 'folder' || this.configObject.type === 'configuration-root') {
            return 'folder';
        }
        if (this.configObject.type === 'help') {
            return 'help';
        }
        return 'object';
    }

    private getIcon(): vscode.ThemeIcon | undefined {
        const iconMap: { [key: string]: string } = {
            'folder': 'folder',
            'configuration-root': 'folder-library',
            'help': 'info',
            'Catalog': 'symbol-class',
            'Document': 'symbol-file',
            'Report': 'graph',
            'DataProcessor': 'symbol-function',
            'AccumulationRegister': 'symbol-array',
            'InformationRegister': 'table',
            'ChartOfCharacteristicTypes': 'symbol-enum',
            'CommonModule': 'symbol-module',
            'CommonForm': 'symbol-structure',
            'CommonCommand': 'symbol-event',
            'Constant': 'symbol-constant',
            'Enum': 'symbol-enum-member',
            'Role': 'key',
            'Subsystem': 'symbol-namespace',
            'ExchangePlan': 'sync',
            'ScheduledJob': 'clock',
            'FunctionalOption': 'settings-gear',
            'HTTPService': 'globe',
            'WebService': 'cloud'
        };

        const iconName = iconMap[this.configObject.type] || 'symbol-misc';
        return new vscode.ThemeIcon(iconName);
    }
}

export class ConfigTreeDataProvider implements vscode.TreeDataProvider<ConfigTreeItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<ConfigTreeItem | undefined | null | void> = new vscode.EventEmitter<ConfigTreeItem | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<ConfigTreeItem | undefined | null | void> = this._onDidChangeTreeData.event;

    private configObjects: ConfigObject[] = [];
    private filteredObjects: ConfigObject[] = [];
    private searchTerm: string = '';

    constructor(
        private context: vscode.ExtensionContext,
        private parser: ConfigObjectParser
    ) {
        this.refresh();
    }

    refresh(): void {
        console.log('Refreshing configuration tree...');
        this.loadConfiguration();
    }

    search(searchTerm: string): void {
        console.log(`Searching for: ${searchTerm}`);
        this.searchTerm = searchTerm.toLowerCase();
        this.applyFilter();
        this._onDidChangeTreeData.fire();
    }

    clearSearch(): void {
        console.log('Clearing search filter');
        this.searchTerm = '';
        this.filteredObjects = [...this.configObjects];
        this._onDidChangeTreeData.fire();
    }
    
    getVisibleItemsCount(): number {
        let count = 0;
        for (const folder of this.filteredObjects) {
            if (folder.children) {
                count += folder.children.length;
            } else {
                count += 1;
            }
        }
        return count;
    }

    private async loadConfiguration(): Promise<void> {
        try {
            console.log('Loading configuration from workspace...');
            this.configObjects = await this.parser.parseWorkspace();
            console.log(`Loaded ${this.configObjects.length} configuration objects`);
            this.applyFilter();
            this._onDidChangeTreeData.fire();
        } catch (error) {
            console.error('Error loading configuration:', error);
            vscode.window.showErrorMessage('Error loading 1C configuration: ' + error);
        }
    }

    private applyFilter(): void {
        console.log(`Applying filter with search term: '${this.searchTerm}'`);
        
        if (!this.searchTerm) {
            this.filteredObjects = [...this.configObjects];
            console.log(`No search term, showing all ${this.filteredObjects.length} objects`);
            return;
        }

        this.filteredObjects = this.configObjects.map(folder => {
            if (!folder.children) {
                // Check if the folder itself matches the search
                if (this.matchesSearch(folder)) {
                    return folder;
                }
                return null;
            }

            const filteredChildren = this.filterChildren(folder.children);

            if (filteredChildren.length > 0) {
                return {
                    ...folder,
                    children: filteredChildren
                };
            }
            
            // Check if the folder name itself matches
            if (this.matchesSearch(folder)) {
                return folder;
            }

            return null;
        }).filter(folder => folder !== null) as ConfigObject[];
        
        console.log(`Filter applied, showing ${this.filteredObjects.length} folders with matches`);
    }
    
    private filterChildren(children: ConfigObject[]): ConfigObject[] {
        return children.filter(child => this.matchesSearch(child));
    }
    
    private matchesSearch(obj: ConfigObject): boolean {
        const searchTerm = this.searchTerm.toLowerCase();
        
        return (
            obj.displayName.toLowerCase().includes(searchTerm) ||
            obj.name.toLowerCase().includes(searchTerm) ||
            obj.type.toLowerCase().includes(searchTerm) ||
            (obj.synonym ? obj.synonym.toLowerCase().includes(searchTerm) : false) ||
            (obj.comment ? obj.comment.toLowerCase().includes(searchTerm) : false)
        );
    }

    getTreeItem(element: ConfigTreeItem): vscode.TreeItem {
        return element;
    }

    getChildren(element?: ConfigTreeItem): Thenable<ConfigTreeItem[]> {
        if (!element) {
            // Root level - return configuration folders or helpful message
            if (this.filteredObjects.length === 0) {
                // Create a helpful message item
                const helpObject: ConfigObject = {
                    name: 'no-config-found',
                    displayName: 'Click here for help',
                    type: 'help',
                    comment: 'No 1C configuration found. Click to see options.',
                    filePath: '',
                    children: []
                };
                return Promise.resolve([
                    new ConfigTreeItem(helpObject, vscode.TreeItemCollapsibleState.None)
                ]);
            }
            
            return Promise.resolve(
                this.filteredObjects.map(obj => 
                    new ConfigTreeItem(
                        obj, 
                        obj.children && obj.children.length > 0 
                            ? vscode.TreeItemCollapsibleState.Collapsed 
                            : vscode.TreeItemCollapsibleState.None
                    )
                )
            );
        } else {
            // Child level - return objects in folder
            const children = element.configObject.children || [];
            return Promise.resolve(
                children.map(child => 
                    new ConfigTreeItem(child, vscode.TreeItemCollapsibleState.None)
                )
            );
        }
    }

    getParent(element: ConfigTreeItem): vscode.ProviderResult<ConfigTreeItem> {
        // Find parent in the tree structure
        for (const folder of this.filteredObjects) {
            if (folder.children?.some(child => child.name === element.configObject.name)) {
                return new ConfigTreeItem(folder, vscode.TreeItemCollapsibleState.Expanded);
            }
        }
        return null;
    }
}