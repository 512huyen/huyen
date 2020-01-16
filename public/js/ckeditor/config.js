/**
 * @license Copyright (c) 2003-2016, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

CKEDITOR.editorConfig = function (config) {
    config.extraPlugins = 'videodetector,wordcount,notification,imageresize,base64image,embed,embedbase,autoembed,widget,notificationaggregator,widgetselection,lineutils,toolbar,button,dialog,dialogui,clipboard,pdf,word,excel,audio,powerpoint,video,spss,zip';
    // Define changes to default configuration here. For example:
    config.language = 'vi';
    config.uiColor = '#FAFAFA';
    config.height = 500;
    config.toolbarCanCollapse = true;
    config.imageResize = {maxWidth: 800, maxHeight: 800};
    config.allowedContent = true;
    // config.extraAllowedContent = 'iframe[*]'
    config.htmlEncodeOutput = false;
    config.entities = false;
    // config.extraAllowedContent = '*{*}';
    config.wordcount = {

        // Whether or not you want to show the Paragraphs Count
        showParagraphs: true,

        // Whether or not you want to show the Word Count
        showWordCount: true,

        // Whether or not you want to show the Char Count
        showCharCount: true,

        // Whether or not you want to count Spaces as Chars
        countSpacesAsChars: true,

        // Whether or not to include Html chars in the Char Count
        countHTML: false,

        // Maximum allowed Word Count, -1 is default for unlimited
        maxWordCount: -1,

        // Maximum allowed Char Count, -1 is default for unlimited
        maxCharCount: -1,

        // Add filter to add or remove element before counting (see CKEDITOR.htmlParser.filter), Default value : null (no filter)
        filter: new CKEDITOR.htmlParser.filter({
            elements: {
                div: function (element) {
                    if (element.attributes.class == 'mediaembed') {
                        return false;
                    }
                }
            }
        })
    };
};
