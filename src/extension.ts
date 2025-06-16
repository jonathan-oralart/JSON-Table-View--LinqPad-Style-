import * as vscode from 'vscode';
import { getHtmlOfObjectTable } from './getHtml';

export function activate(context: vscode.ExtensionContext) {
    console.log('Activating "json-table-view" extension...');

    try {
        const provider = new JsonTableViewProvider(context);
        context.subscriptions.push(
            vscode.window.registerCustomEditorProvider(
                JsonTableViewProvider.viewType,
                provider,
                {
                    webviewOptions: {
                        retainContextWhenHidden: true,
                    },
                }
            )
        );
        console.log('Custom editor provider registered successfully.');

        const openInViewCommand = vscode.commands.registerCommand('json-table-view.openActiveJsonView', () => {
            console.log('Command "openActiveJsonView" triggered.');
            const editor = vscode.window.activeTextEditor;
            if (!editor) {
                console.log('Command failed: No active editor.');
                vscode.window.showInformationMessage('No active editor to display.');
                return;
            }

            const doc = editor.document;
            const langId = doc.languageId;
            console.log(`Active editor languageId: "${langId}"`);

            if (langId !== 'json' && langId !== 'jsonc' && langId !== 'ejson') {
                vscode.window.showInformationMessage(`The active editor is not a supported JSON file (languageId: ${langId}).`);
                return;
            }

            const panel = vscode.window.createWebviewPanel(
                'jsonTableViewManual',
                'JSON Table View',
                vscode.ViewColumn.Two,
                {
                    enableScripts: true,
                    retainContextWhenHidden: true,
                }
            );

            // Set an initial loading message
            panel.webview.html = `<body><h1><br/>&nbsp;&nbsp;⏳ Parsing and rendering JSON...</h1></body>`;

            // Process asynchronously to avoid blocking
            setTimeout(() => {
                try {
                    const text = doc.getText();
                    // Add a file size limit (e.g., 20 MB) to prevent crashes
                    if (text.length > 20 * 1024 * 1024) {
                        vscode.window.showErrorMessage('File is too large to display as a table.');
                        panel.webview.html = `<body><h1>File is too large (>20MB) to display as a table.</h1></body>`;
                        return;
                    }

                    console.log('Parsing JSON content...');
                    const jsonContent = JSON.parse(text);
                    const defaultOpenLevels = vscode.workspace.getConfiguration('json-table-view').get('defaultOpenLevels', 3);
                    console.log('JSON parsed successfully. Setting webview HTML.');
                    panel.webview.html = getHtmlOfObjectTable(jsonContent, defaultOpenLevels);
                } catch (error) {
                    let message = 'An unknown error occurred while parsing JSON.';
                    if (error instanceof Error) {
                        message = `Error parsing JSON: ${error.message}`;
                    }
                    console.error(message, error);
                    panel.webview.html = `<body><h1>${message}</h1></body>`;
                }
            }, 10);
        });

        context.subscriptions.push(openInViewCommand);
        console.log('Command "json-table-view.openActiveJsonView" registered successfully.');

    } catch (e) {
        console.error('Failed to activate "json-table-view" extension.', e);
    }
}

class JsonTableViewProvider implements vscode.CustomTextEditorProvider {
    public static readonly viewType = 'json-table-view.view';

    constructor(private readonly context: vscode.ExtensionContext) { }

    public async resolveCustomTextEditor(
        document: vscode.TextDocument,
        webviewPanel: vscode.WebviewPanel,
        _token: vscode.CancellationToken
    ): Promise<void> {
        webviewPanel.webview.options = {
            enableScripts: true,
        };

        const updateWebview = () => {
            // Set an initial loading message
            webviewPanel.webview.html = `<body><h1><br/>&nbsp;&nbsp;⏳ Parsing and rendering JSON...</h1></body>`;

            // Process asynchronously to avoid blocking
            setTimeout(() => {
                try {
                    const text = document.getText();
                    // Add a file size limit (e.g., 20 MB) to prevent crashes
                    if (text.length > 20 * 1024 * 1024) {
                        vscode.window.showErrorMessage('File is too large to display as a table.');
                        webviewPanel.webview.html = `<body><h1>File is too large (>20MB) to display as a table.</h1></body>`;
                        return;
                    }

                    const jsonContent = JSON.parse(text);
                    const defaultOpenLevels = vscode.workspace.getConfiguration('json-table-view').get('defaultOpenLevels', 3);
                    webviewPanel.webview.html = getHtmlOfObjectTable(jsonContent, defaultOpenLevels);
                } catch (error) {
                    let message = 'An unknown error occurred while parsing JSON.';
                    if (error instanceof Error) {
                        message = `Error parsing JSON: ${error.message}`;
                    }
                    console.error(message, error);
                    webviewPanel.webview.html = `<body><h1>${message}</h1></body>`;
                }
            }, 10);
        };

        const changeDocumentSubscription = vscode.workspace.onDidChangeTextDocument(e => {
            if (e.document.uri.toString() === document.uri.toString()) {
                updateWebview();
            }
        });

        webviewPanel.onDidDispose(() => {
            changeDocumentSubscription.dispose();
        });

        updateWebview();
    }
}

export function deactivate() {
    console.log('Deactivating "json-table-view" extension.');
} 