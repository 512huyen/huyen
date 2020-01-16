var CKEditorPlugin =
    {
        selectFile: function (data) {
            if (data.success) {
                var tmp = data.data[0].ImageUrl;
                ckeditor.insertHtml("<img  src='" + tmp + "' style='max-width: 100%;'/>");
            }
        }
    }
function isVideoFile(fileName) {
    var ext = fileName.substring(fileName.lastIndexOf('.') + 1).toLocaleLowerCase();
    if (ext == "mp4" || ext == "ogg" || ext == "webm" || ext == "avi" || ext == "flv"|| ext == "wmv" || ext == "mov" || ext == "mpeg" || ext == "divx" || ext == "3gp" || ext == "xvid" || ext == "h.264") {
        return true;
    } else {
        alert("Vui lòng chọn video");
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
CKEDITOR.plugins.add('video', {
    icons: 'video',
    init: function (editor) {
        CKEDITOR.dialog.add('videoDialog', function (editor) {
            return {
                title: 'Thêm video',
                minWidth: 400,
                minHeight: 100,
                contents: [
                    {
                        id: 'tab-basic',
                        elements: [
                            {
                                type: 'file',
                                id: 'file',
                                validate: CKEDITOR.dialog.validate.notEmpty("Vui lòng chọn video"),
                                onChange: function (event) {
                                    var filename = this.getValue();
                                    var isValid = false;
                                    if (filename == '') {
                                        isValid = false;
                                    } else if (isVideoFile(filename)) {
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
                            var abbr = editor.document.createElement('video');
                            abbr.setAttribute('controls autoplay');
                            abbr.setAttribute('src', server_url + linkFile);
                            abbr.setAttribute('width', "100%");
                            abbr.setAttribute('height', "500px");
                            editor.insertElement(abbr);
                        }
                    }, function (e) {
                    })
                }
            };
        });
        editor.addCommand('insertVideo', new CKEDITOR.dialogCommand('videoDialog'));
        editor.ui.addButton('video', {
            label: 'Upload video',
            command: 'insertVideo',
            toolbar: 'insert'
        });
    }
});