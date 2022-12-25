/**
 * File: extension.ts
 * Description: Extension that adds the ability to indent and unindent code lines using the context menu.
 * Author: Héctor Álvarez Fernández
 * License: MIT
 */

import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {

	console.log('Extension "indent-from-context-menu" is active!');


	vscode.commands.registerCommand('extension.indentRight', () => {
		const editor = vscode.window.activeTextEditor;
		if (!editor) {
		  return;
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
				// Indent each selected line by inserting a tab character at the start
				for (let i = selection.start.line; i <= selection.end.line; i++) {
				  const position = new vscode.Position(i, 0);
				  builder.insert(position, '\t');
				}
			  }
			});
		} else {
		  // Indent the current line
		  const position = editor.selection.active;
		  const line = editor.document.lineAt(position);
		  const range = new vscode.Range(line.range.start, line.range.end);
		  editor.edit(builder => {
			// Insert a tab character at the start of the current line
			builder.insert(line.range.start, '\t');
		  });
		}
	  });


	  vscode.commands.registerCommand('extension.indentLeft', () => {
		const editor = vscode.window.activeTextEditor;
		if (!editor) {
		  return;
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
			  // Unindent each selected line by checking for and removing a tab character at the start
			  for (let i = selection.start.line; i <= selection.end.line; i++) {
				const position = new vscode.Position(i, 0);
				const line = editor.document.lineAt(position).text;
				if (line.startsWith('\t')) {
				  builder.delete(new vscode.Range(position, new vscode.Position(i, 1)));
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
			// Check for and remove a tab character at the start of the current line
			const text = editor.document.lineAt(position).text;
			if (text.startsWith('\t')) {
			  builder.delete(new vscode.Range(position, new vscode.Position(position.line, 1)));
			}
		  });
		}
	  });


}

export function deactivate() {}