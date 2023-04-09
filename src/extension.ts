import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    "find-in-current-file.searchInCurrentFile",
    async () => {
      await searchInCurrentFile();
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}

async function searchInCurrentFile(): Promise<void> {
  const activeEditor = vscode.window.activeTextEditor;
  if (!activeEditor) {
    return;
  }

  var currentFilePath = vscode.workspace.asRelativePath(
    activeEditor.document.uri
  );
  
  // Workaround for issue #9
  // Take only basename if it is a Windows full path with colon (:), e.g. D:\a\b.txt -> b.txt 
  if (currentFilePath.includes(":")) {
    const path = require('path');
    currentFilePath = path.basename(currentFilePath);
  }

  const stxt=activeEditor.document.getText(activeEditor.selection);
  const ff = stxt ? {query: stxt} : {};
  await vscode.commands.executeCommand("workbench.action.findInFiles", Object.assign({
    // Fill-in selected text to query
    filesToInclude: currentFilePath,
  }, ff));
}
