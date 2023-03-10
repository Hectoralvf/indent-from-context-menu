/**
 * Author: Héctor Álvarez Fernández
 * License: MIT
 */

import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {

  console.log('Extension "indent-from-context-menu" is active!');

  vscode.commands.registerCommand('extension.indentRight', indentRight);

  vscode.commands.registerCommand('extension.indentLeft', indentLeft);
}

export function indentRight() {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    return;
  }

  // Get the current indentation settings
  const tabSize = editor.options.tabSize as number;
  const insertSpaces = editor.options.insertSpaces as boolean;

  // Calculate the indentation string to use
  let indentationString: string;
  if (insertSpaces) {
    indentationString = " ".repeat(tabSize);
  } else {
    indentationString = "\t";
  }

  // Check if there are any selections
  if (editor.selections.length > 0) {
    // Indent the selected lines
    editor.edit(builder => {
      const selections = editor.selections;
      for (const selection of selections) {
        // Define the range of the selected line
        const start = new vscode.Position(selection.start.line, 0);
        const end = new vscode.Position(selection.end.line + 1, 0);
        const range = new vscode.Range(start, end);
        // Indent each selected line by inserting the indentation string at the start
        for (let i = selection.start.line; i <= selection.end.line; i++) {
          const position = new vscode.Position(i, 0);
          builder.insert(position, indentationString);
        }
      }
    });
  } else {
    // Indent the current line
    const position = editor.selection.active;
    const line = editor.document.lineAt(position);
    const range = new vscode.Range(line.range.start, line.range.end);
    editor.edit(builder => {
      // Insert the indentation string at the start of the current line
      builder.insert(line.range.start, indentationString);
    });
  }
}

export function indentLeft() {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    return;
  }

  // Get the current indentation settings
  const tabSize = editor.options.tabSize as number;
  const insertSpaces = editor.options.insertSpaces as boolean;

  // Calculate the indentation string to use
  let indentationString: string;
  if (insertSpaces) {
    indentationString = " ".repeat(tabSize);
  } else {
    indentationString = "\t";
  }

// Check if there are any selections
if (editor.selections.length > 0) {
	// Unindent the selected lines
	editor.edit(builder => {
		const selections = editor.selections;
		for (const selection of selections) {
			// Define the range of the selected line
			const start = new vscode.Position(selection.start.line, 0);
			const end = new vscode.Position(selection.end.line + 1, 0);
			const range = new vscode.Range(start, end);
			// Unindent each selected line by checking for and removing the indentation string at the start
			for (let i = selection.start.line; i <= selection.end.line; i++) {
				const position = new vscode.Position(i, 0);
				const line = editor.document.lineAt(position).text;
				if (line.startsWith(indentationString)) {
					builder.delete(new vscode.Range(position, new vscode.Position(i, indentationString.length)));
				}
			}
		}
	});
} else {
	// Unindent the current line
	const position = editor.selection.active;
	const line = editor.document.lineAt(position);
	const range = new vscode.Range(line.range.start, line.range.end);
	editor.edit(builder => {
		// Check for and remove the indentation string at the start of the current line
		const text = editor.document.lineAt(position).text;
		if (text.startsWith(indentationString)) {
			builder.delete(new vscode.Range(line.range.start, new vscode.Position(line.lineNumber, indentationString.length)));
		}
	});
  }
}