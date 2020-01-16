var CKEditorPlugin =
    {
        selectFile: function (data) {
            if (data.success) {
                var tmp = data.data[0].ImageUrl;
                ckeditor.insertHtml("<img  src='" + tmp + "' style='max-width: 100%;'/>");
            }
        }
    }

function isZipFile(fileName) {
    var ext = fileName.substring(fileName.lastIndexOf('.') + 1).toLocaleLowerCase();
    if (ext == "zip" || ext == "rar" || ext == "7z") {
        return true;
    } else {
        alert("Vui lòng chọn file zip, rar, 7z");
        return false;
    }
    return true;
}

function upload(fileData, callBack, error) {
    var oMyForm = new FormData();
    oMyForm.append("file", fileData);
    $.ajax({
        dataType: 'json',
        enctype: 'multipart/form-data',
        type: 'POST',
        url: "/file/uploadFile",
        data: oMyForm,
        processData: false,  // tell jQuery not to process the data
        contentType: false,  // tell jQuery not to set contentType
        success: function (data) {
            callBack(data);
        },
        error: function (data) {
            error(data);
        }
    });
}

CKEDITOR.plugins.add('zip', {
    icons: 'zip',
    init: function (editor) {
        CKEDITOR.dialog.add('zipDialog', function (editor) {
            return {
                title: 'Thêm file zip, rar, 7z',
                minWidth: 400,
                minHeight: 100,
                contents: [
                    {
                        id: 'tab-basic',
                        elements: [
                            {
                                type: 'file',
                                id: 'file',
                                validate: CKEDITOR.dialog.validate.notEmpty("Vui lòng chọn file zip, rar, 7z"),
                                onChange: function (event) {
                                    var filename = this.getValue();
                                    var isValid = false;
                                    if (filename == '') {
                                        isValid = false;
                                    } else if (isZipFile(filename)) {
                                        isValid = true;
                                    } else {
                                        isValid = false;
                                        this.setValue('');
                                    }
                                    return isValid;
                                }
                            }
                        ]
                    }
                ],
                onOk: function () {
                    var dialog = this;

                    var file = dialog.getContentElement("tab-basic", "file").getInputElement().$.files[0];
                    upload(file, function (s) {
                        if (s && s.success && s.data.file) {
                            var linkFile = ""
                            if (s.data.file.startsWith("/")){
                                linkFile = s.data.file.slice(1)
                            } else {
                                linkFile = s.data.file
                            }
                            var element = CKEDITOR.dom.element.createFromHtml( "<div><a href='" + server_url + linkFile + "'>" + linkFile + "</a></div>" );
                            editor.insertElement(element);
                        }

                    }, function (e) {

                    })

                }
            };
        });

        editor.addCommand('insertZip', new CKEDITOR.dialogCommand('zipDialog'));
        editor.ui.addButton('zip', {
            label: 'Upload file zip, rar, 7z',
            command: 'insertZip',
            toolbar: 'insert'
        });
    }
});