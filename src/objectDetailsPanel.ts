import * as vscode from 'vscode';
import { ConfigObject, ConfigObjectParser } from './configParser';

export class ObjectDetailsPanel {
    public static currentPanel: ObjectDetailsPanel | undefined;
    private readonly _panel: vscode.WebviewPanel;
    private _disposables: vscode.Disposable[] = [];

    private constructor(
        panel: vscode.WebviewPanel,
        private readonly _context: vscode.ExtensionContext,
        private readonly _parser: ConfigObjectParser = new ConfigObjectParser()
    ) {
        this._panel = panel;

        // Set an event listener to listen for when the panel is disposed
        this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

        // Handle messages from the webview
        this._panel.webview.onDidReceiveMessage(
            message => {
                switch (message.command) {
                    case 'alert':
                        vscode.window.showErrorMessage(message.text);
                        return;
                }
            },
            null,
            this._disposables
        );
    }

    public static show(context: vscode.ExtensionContext, configObject: ConfigObject) {
        const column = vscode.window.activeTextEditor
            ? vscode.window.activeTextEditor.viewColumn
            : undefined;

        // If we already have a panel, show it.
        if (ObjectDetailsPanel.currentPanel) {
            ObjectDetailsPanel.currentPanel._panel.reveal(column);
            ObjectDetailsPanel.currentPanel._update(configObject);
            return;
        }

        // Otherwise, create a new panel.
        const panel = vscode.window.createWebviewPanel(
            '1cObjectDetails',
            `1C: ${configObject.displayName}`,
            column || vscode.ViewColumn.One,
            {
                // Enable javascript in the webview
                enableScripts: true,
                // And restrict the webview to only loading content from our extension's `media` directory.
                localResourceRoots: [vscode.Uri.joinPath(context.extensionUri, 'media')]
            }
        );

        ObjectDetailsPanel.currentPanel = new ObjectDetailsPanel(panel, context);
        ObjectDetailsPanel.currentPanel._update(configObject);
    }

    public static createOrShow(context: vscode.ExtensionContext) {
        const column = vscode.window.activeTextEditor
            ? vscode.window.activeTextEditor.viewColumn
            : undefined;

        // If we already have a panel, show it.
        if (ObjectDetailsPanel.currentPanel) {
            ObjectDetailsPanel.currentPanel._panel.reveal(column);
            return;
        }

        // Otherwise, create a new panel.
        const panel = vscode.window.createWebviewPanel(
            '1cObjectDetails',
            '1C Object Details',
            column || vscode.ViewColumn.One,
            {
                enableScripts: true,
                localResourceRoots: [vscode.Uri.joinPath(context.extensionUri, 'media')]
            }
        );

        ObjectDetailsPanel.currentPanel = new ObjectDetailsPanel(panel, context);
    }

    public show(configObject: ConfigObject) {
        ObjectDetailsPanel.show(this._context, configObject);
    }

    public dispose() {
        ObjectDetailsPanel.currentPanel = undefined;

        // Clean up our resources
        this._panel.dispose();

        while (this._disposables.length) {
            const x = this._disposables.pop();
            if (x) {
                x.dispose();
            }
        }
    }

    private async _update(configObject: ConfigObject) {
        const webview = this._panel.webview;
        this._panel.title = `1C: ${configObject.displayName}`;
        
        try {
            const objectDetails = await this._parser.getObjectDetails(configObject);
            this._panel.webview.html = this._getHtmlForWebview(webview, configObject, objectDetails);
        } catch (error) {
            console.error('Error loading object details:', error);
            this._panel.webview.html = this._getErrorHtml(webview, configObject, error);
        }
    }

    private _getHtmlForWebview(webview: vscode.Webview, configObject: ConfigObject, objectDetails: any): string {
        // Get the local path to main script run in the webview, then convert it to a uri we can use in the webview.
        const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this._context.extensionUri, 'media', 'main.js'));
        const styleUri = webview.asWebviewUri(vscode.Uri.joinPath(this._context.extensionUri, 'media', 'styles.css'));

        return `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <link href="${styleUri}" rel="stylesheet">
                <title>1C Object Details</title>
            </head>
            <body>
                <div class="container">
                    <header class="object-header">
                        <h1 class="object-title">
                            <span class="object-icon ${this._getObjectIconClass(configObject.type)}"></span>
                            ${this._escapeHtml(configObject.displayName)}
                        </h1>
                        <div class="object-meta">
                            <span class="object-type">${configObject.type}</span>
                            ${configObject.name !== configObject.displayName ? `<span class="object-name">(${configObject.name})</span>` : ''}
                        </div>
                    </header>

                    <main class="object-content">
                        ${this._generateBasicInfo(configObject)}
                        ${this._generatePropertiesSection(configObject, objectDetails)}
                        ${this._generateAttributesSection(objectDetails)}
                        ${this._generateFormsSection(objectDetails)}
                        ${this._generateCommandsSection(objectDetails)}
                        ${this._generateRawDataSection(objectDetails)}
                    </main>
                </div>

                <script src="${scriptUri}"></script>
            </body>
            </html>`;
    }

    private _generateBasicInfo(configObject: ConfigObject): string {
        return `
            <section class="info-section">
                <h2>Basic Information</h2>
                <div class="info-grid">
                    <div class="info-item">
                        <label>Name:</label>
                        <span>${this._escapeHtml(configObject.name)}</span>
                    </div>
                    <div class="info-item">
                        <label>Display Name:</label>
                        <span>${this._escapeHtml(configObject.displayName)}</span>
                    </div>
                    <div class="info-item">
                        <label>Type:</label>
                        <span>${configObject.type}</span>
                    </div>
                    ${configObject.uuid ? `
                    <div class="info-item">
                        <label>UUID:</label>
                        <span class="uuid">${configObject.uuid}</span>
                    </div>
                    ` : ''}
                    ${configObject.comment ? `
                    <div class="info-item">
                        <label>Comment:</label>
                        <span>${this._escapeHtml(configObject.comment)}</span>
                    </div>
                    ` : ''}
                    <div class="info-item">
                        <label>File Path:</label>
                        <span class="file-path">${this._escapeHtml(configObject.filePath)}</span>
                    </div>
                </div>
            </section>
        `;
    }

    private _generatePropertiesSection(configObject: ConfigObject, objectDetails: any): string {
        if (!configObject.properties) {
            return '';
        }

        const properties = configObject.properties;
        let propertiesHtml = '';

        // Common properties for different object types
        const commonProps = [
            'UseStandardCommands', 'Hierarchical', 'CodeLength', 'DescriptionLength',
            'CheckUnique', 'Autonumbering', 'NumberType', 'NumberLength', 'Posting'
        ];

        for (const prop of commonProps) {
            if (properties[prop] !== undefined) {
                propertiesHtml += `
                    <div class="info-item">
                        <label>${prop}:</label>
                        <span>${this._formatPropertyValue(properties[prop])}</span>
                    </div>
                `;
            }
        }

        if (propertiesHtml) {
            return `
                <section class="info-section">
                    <h2>Properties</h2>
                    <div class="info-grid">
                        ${propertiesHtml}
                    </div>
                </section>
            `;
        }

        return '';
    }

    private _generateAttributesSection(objectDetails: any): string {
        const object = objectDetails ? Object.values(objectDetails)[0] as any : null;
        if (!object || !object.Attributes) {
            return '';
        }

        const attributes = Array.isArray(object.Attributes) ? object.Attributes : [object.Attributes];
        
        return `
            <section class="info-section">
                <h2>Attributes</h2>
                <div class="attributes-list">
                    ${attributes.map((attr: any) => `
                        <div class="attribute-item">
                            <h3>${attr.Properties?.Name || 'Unnamed'}</h3>
                            <div class="attribute-details">
                                <span class="attribute-type">${attr.Properties?.Type || 'Unknown'}</span>
                                ${attr.Properties?.Synonym ? `<span class="attribute-synonym">${attr.Properties.Synonym}</span>` : ''}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </section>
        `;
    }

    private _generateFormsSection(objectDetails: any): string {
        const object = objectDetails ? Object.values(objectDetails)[0] as any : null;
        if (!object || !object.ChildObjects) {
            return '';
        }

        const forms = object.ChildObjects?.Form || [];
        if (!Array.isArray(forms) || forms.length === 0) {
            return '';
        }

        return `
            <section class="info-section">
                <h2>Forms</h2>
                <div class="forms-list">
                    ${forms.map((form: any) => `
                        <div class="form-item">
                            <span class="form-name">${form.Properties?.Name || 'Unnamed Form'}</span>
                            ${form.Properties?.Synonym ? `<span class="form-synonym">(${form.Properties.Synonym})</span>` : ''}
                        </div>
                    `).join('')}
                </div>
            </section>
        `;
    }

    private _generateCommandsSection(objectDetails: any): string {
        const object = objectDetails ? Object.values(objectDetails)[0] as any : null;
        if (!object || !object.ChildObjects?.Command) {
            return '';
        }

        const commands = Array.isArray(object.ChildObjects.Command) ? object.ChildObjects.Command : [object.ChildObjects.Command];

        return `
            <section class="info-section">
                <h2>Commands</h2>
                <div class="commands-list">
                    ${commands.map((command: any) => `
                        <div class="command-item">
                            <span class="command-name">${command.Properties?.Name || 'Unnamed Command'}</span>
                            ${command.Properties?.Synonym ? `<span class="command-synonym">(${command.Properties.Synonym})</span>` : ''}
                        </div>
                    `).join('')}
                </div>
            </section>
        `;
    }

    private _generateRawDataSection(objectDetails: any): string {
        return `
            <section class="info-section collapsible">
                <h2 onclick="toggleSection(this)">Raw Data <span class="toggle-icon">▼</span></h2>
                <div class="raw-data">
                    <pre><code>${this._escapeHtml(JSON.stringify(objectDetails, null, 2))}</code></pre>
                </div>
            </section>
        `;
    }

    private _getObjectIconClass(type: string): string {
        const iconMap: { [key: string]: string } = {
            'Catalog': 'icon-catalog',
            'Document': 'icon-document',
            'Report': 'icon-report',
            'DataProcessor': 'icon-dataprocessor',
            'AccumulationRegister': 'icon-accumulation-register',
            'InformationRegister': 'icon-information-register',
            'CommonModule': 'icon-common-module',
            'CommonForm': 'icon-common-form',
            'Constant': 'icon-constant',
            'Enum': 'icon-enum'
        };
        return iconMap[type] || 'icon-default';
    }

    private _formatPropertyValue(value: any): string {
        if (typeof value === 'boolean') {
            return value ? 'Yes' : 'No';
        }
        if (typeof value === 'object' && value !== null) {
            return JSON.stringify(value);
        }
        return String(value);
    }

    private _escapeHtml(text: string): string {
        return text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    private _getErrorHtml(webview: vscode.Webview, configObject: ConfigObject, error: any): string {
        return `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Error Loading Object</title>
                <style>
                    body { font-family: var(--vscode-font-family); padding: 20px; }
                    .error { color: var(--vscode-errorForeground); }
                </style>
            </head>
            <body>
                <h1>Error Loading Object Details</h1>
                <p>Failed to load details for: <strong>${this._escapeHtml(configObject.displayName)}</strong></p>
                <div class="error">
                    <pre>${this._escapeHtml(String(error))}</pre>
                </div>
            </body>
            </html>`;
    }
}