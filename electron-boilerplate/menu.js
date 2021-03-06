'use strict';
const path = require('path');
const {app, Menu, shell, dialog, BrowserWindow} = require('electron');
const {
	is,
	appMenu,
	aboutMenuItem,
	openUrlMenuItem,
	openNewGitHubIssue,
	debugInfo
} = require('electron-util');
const config = require('./config');
const load_tsv = require('./load_tsv');
const showPreferences = () => {
	// Show the app's preferences here
};

const helpSubmenu = [
	openUrlMenuItem({
		label: 'Website',
		url: 'https://github.com/sindresorhus/electron-boilerplate'
	}),
	openUrlMenuItem({
		label: 'Source Code',
		url: 'https://github.com/sindresorhus/electron-boilerplate'
	}),
	{
		label: 'Report an Issue…',
		click() {
			const body = `
<!-- Please succinctly describe your issue and steps to reproduce it. -->


---

${debugInfo()}`;

			openNewGitHubIssue({
				user: 'sindresorhus',
				repo: 'electron-boilerplate',
				body
			});
		}
	}
];

if (!is.macos) {
	helpSubmenu.push(
		{
			type: 'separator'
		},
		aboutMenuItem({
			icon: path.join(__dirname, 'static', 'icon.png'),
			text: 'Created by Your Name'
		})
	);
}

const debugSubmenu = [
	{
		label: 'Show Settings',
		click() {
			config.openInEditor();
		}
	},
	{
		label: 'Show App Data',
		click() {
			shell.openItem(app.getPath('userData'));
		}
	},
	{
		type: 'separator'
	},
	{
		label: 'Delete Settings',
		click() {
			config.clear();
			app.relaunch();
			app.quit();
		}
	},
	{
		label: 'Delete App Data',
		click() {
			shell.moveItemToTrash(app.getPath('userData'));
			app.relaunch();
			app.quit();
		}
	}
];

const macosTemplate = [
	appMenu([
		{
			label: 'Preferences…',
			accelerator: 'Command+,',
			click() {
				showPreferences();
			}
		}
	]),
	{
		role: 'fileMenu',
		submenu: [
			{
				label: 'Open File',
				click() {
					OpenFile();
				}
			},
			{
				type: 'separator'
			},
			{
				label: 'Settings',
				accelerator: 'Control+,',
				click() {
					showPreferences();
				}
			},
			{
				type: 'separator'
			},
			{
				role: 'quit'
			}
		]
	},
	{
		role: 'editMenu'
	},
	{
		role: 'viewMenu'
	},
	{
		role: 'windowMenu'
	},
	{
		role: 'help',
		submenu: helpSubmenu
	}
];

// Linux and Windows
const otherTemplate = [
	{
		role: 'fileMenu',
		submenu: [
			{
				label: 'Open File',
				click() {
					OpenFile();
				}
			},
			{
				type: 'separator'
			},
			{
				label: 'Settings',
				accelerator: 'Control+,',
				click() {
					showPreferences();
				}
			},
			{
				type: 'separator'
			},
			{
				role: 'quit'
			}
		]
	},
	{
		role: 'editMenu'
	},
	{
		role: 'viewMenu'
	},
	{
		role: 'help',
		submenu: helpSubmenu
	}
];

// Open Files Files ============================================================================================================
function OpenFile()
{
	let options = {
		title : "Open CSV File", 

		//defaultPath : path.join(__dirname),

		buttonLabel : "Load Files",

		filters :[
		 {name: 'csv', extensions: ['csv']},
		 {name: 'tsv', extensions: ['tsv']},
		 {name: 'All Files', extensions: ['*']}
		],
		properties: ['openFile','multiSelections']
	   }

	dialog.showOpenDialog((BrowserWindow, options, filePaths) => {
	}).then((filePaths) => {
		// If no files were selected
		if(filePaths === undefined){ console.log("No file selected"); return; }
		// Load Files
		//for (var i = 0; i < filePaths.filePaths.length; i++)
		load_tsv(filePaths.filePaths[0]);
	});
}

// ===============================================================================================================================

const template = process.platform === 'darwin' ? macosTemplate : otherTemplate;

if (is.development) {
	template.push({
		label: 'Debug',
		submenu: debugSubmenu
	});
}

module.exports = Menu.buildFromTemplate(template);
