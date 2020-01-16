var CKEditorPlugin =
    {
        selectFile: function (data) {
            if (data.success) {
                var tmp = data.data[0].ImageUrl;
                ckeditor.insertHtml("<img  src='" + tmp + "' style='max-width: 100%;'/>");
            }
        }
    }

function isExcelFile(fileName) {
    var ext = fileName.substring(fileName.lastIndexOf('.') + 1).toLocaleLowerCase();
    if (ext == "xls" || ext == "xlsx") {
        return true;
    } else {
        alert("Vui lòng chọn file excel");
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

CKEDITOR.plugins.add('excel', {
    icons: 'excel',
    init: function (editor) {
        CKEDITOR.dialog.add('excelDialog', function (editor) {
            return {
                title: 'Thêm file excel',
                minWidth: 400,
                minHeight: 100,
                contents: [
                    {
                        id: 'tab-basic',
                        elements: [
                            {
                                type: 'file',
                                id: 'file',
                                validate: CKEDITOR.dialog.validate.notEmpty("Vui lòng chọn file excel"),
                                onChange: function (event) {
                                    var filename = this.getValue();
                                    var isValid = false;
                                    if (filename == '') {
                                        isValid = false;
                                    } else if (isExcelFile(filename)) {
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
                            var linkAlias = "";
                            if (server_url.startsWith("http://123.24.206.9")) {
                                linkAlias = "https://docs.google.com/viewer?url=";
                            } else {
                                linkAlias = "https://view.officeapps.live.com/op/view.aspx?src=";
                            }
                            var linkFile = "";
                            if (s.data.file.startsWith("/")){
                                linkFile = s.data.file.slice(1)
                            } else {
                                linkFile = s.data.file
                            }
                            var abbr = editor.document.createElement('iframe');
                            abbr.setAttribute('src', linkAlias + server_url + linkFile + "&embedded=true");
                            abbr.setAttribute('width', "100%");
                            abbr.setAttribute('height', "500px");
                            var element = CKEDITOR.dom.element.createFromHtml( "<div style=\"text-align: right;\"><a href='" + server_url + linkFile + "'><img alt=\"\" style=\"width: 40px;\" src=\"data:image/png;base64,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\n" +
                                "\"></a></div>" );
                            editor.insertElement(element);
                            editor.insertElement(abbr);
                        }

                    }, function (e) {

                    })

                }
            };
        });

        editor.addCommand('insertExcel', new CKEDITOR.dialogCommand('excelDialog'));
        editor.ui.addButton('excel', {
            label: 'Upload file excel',
            command: 'insertExcel',
            toolbar: 'insert'
        });
    }
});