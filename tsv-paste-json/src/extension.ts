// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import tsv2json from "./tsv2json";

// 設定のspaceを取得
function getConfigSpace() {
  const config = vscode.workspace.getConfiguration('tsvPasteJson');
  const space = config.get<string>('stringify.space') || '';
  if (/^\d+$/.test(space)) return Number(space);
  return space.replace(/\\t/g, '\t');
}

// 現在のエディタでJSONをペーストする
async function editorPasteJSON() {
  const editor = vscode.window.activeTextEditor;
  const text = await vscode.env.clipboard.readText();
  const json = tsv2json(text, getConfigSpace());

  if (editor && json) {
    const line = editor.selection.active.line;
    const character = editor.selection.active.character;

    await editor.edit((editBuilder) => {
      editBuilder.insert(new vscode.Position(line, character), json);
    });
  }
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  const paste = vscode.commands.registerCommand('tsv-paste-json.paste', editorPasteJSON);
  context.subscriptions.push(paste);
}

// this method is called when your extension is deactivated
export function deactivate() {}
