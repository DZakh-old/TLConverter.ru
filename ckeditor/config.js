/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see https://ckeditor.com/legal/ckeditor-oss-license
 */

CKEDITOR.editorConfig = function( config ) {
	//config.extraPlugins = 'autogrow';
	config.extraPlugins = 'pasteFromGoogleDoc';
	config.removePlugins = "toolbar,elementspath";
	config.resize_enabled = false;
	config.language = 'ru';
	config.uiColor = '#ffffff';
	config.height = '90vh';
	config.toolbarLocation = 'bottom';
	config.startupMode = 'wysiwyg';
};
