// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import tsv2json from './tsv2json';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let paste = vscode.commands.registerCommand('tsv-paste-json.paste', async () => {
		// The code you place here will be executed every time your command is executed

		const editor = vscode.window.activeTextEditor
		const text = await vscode.env.clipboard.readText()
		const json = tsv2json(text);

        if (editor && json) {
			const line = editor.selection.active.line
			const character = editor.selection.active.character
			
			await editor.edit(editBuilder => {
				editBuilder.insert(new vscode.Position(line, character), json)
			})
		}
	});

	context.subscriptions.push(paste);
}

// this method is called when your extension is deactivated
export function deactivate() {}
