import React from 'react';
import { FormGroup, Label } from 'reactstrap';
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from 'react-datepicker';
import monent from 'moment';
import { toast } from 'react-toastify';
import './index.scss';
function DateBox({ label, value, placeholder, required, validates, isInput, classCustom, onChangeRaw, onChange, width, title, validation }) {
    return (
        <div className="modal-date-picker">
            <div className="row">
                <div className={"col-md-" + width}>
                    <span className="title-search-input">{title}</span>
                </div>
                <div className={"col-md-" + (12 - width)}>
                    <FormGroup className={"form-group-xx " + classCustom ? classCustom : ""} style={!isInput ? { marginBottom: 0 } : {}}>
                        {isInput &&
                            <Label htmlFor="nf-name" className="nf-name">{label}
                                {required ? (<span className="isofh-error">*</span>) : ''}
                                {validates ? (validates.isInvalid && <label className="isofh-error">{validates.message}</label>) : ''}
                            </Label>
                        }

                        <DatePicker
                            placeholderText={placeholder ? placeholder : ""}
                            className="form-control"
                            selected={(value && monent(value, 'dd/MM/yyyy', false).isValid() && new Date(value) !== "Invalid Date") ? new Date(value) : ""}
                            onChange={onChange}
                            onChangeRaw={onChangeRaw}
                            dateFormat={"dd/MM/yyyy"}
                            strictParsing
                            onChangeRaw={(event) => {
                                if (monent(event.currentTarget.value, 'dd/MM/yyyy', false).isValid() === false && event.currentTarget.value.length === 10) {
                                    toast.error("Chưa đúng định dạng tìm kiếm " + "dd/mm/yyyy", {
                                        position: toast.POSITION.TOP_RIGHT
                                    });
                                }
                            }}
                        />
                    </FormGroup>
                    <div className="error-dob error-dob-date">{validation}</div>
                </div>
            </div>
        </div>
    )
}
function DateTimeBoxSearch({ label, value, placeholder, required, validates, isInput, classCustom, onChange, onChangeRaw, title }) {
    return (
        <div className="search-date">
            <div className="search-date-title">{title}</div>
            <FormGroup className={"form-group-xx " + classCustom ? classCustom : ""} style={!isInput ? { marginBottom: 0 } : {}}>
                {isInput &&
                    <Label htmlFor="nf-name" className="nf-name">{label}
                        {required ? (<span className="isofh-error">*</span>) : ''}
                        {validates ? (validates.isInvalid && <label className="isofh-error">{validates.message}</label>) : ''}
                    </Label>
                }
                <DatePicker
                    placeholderText={placeholder ? placeholder : "Tìm kiếm..."}
                    className="form-control"
                    selected={value}
                    onChange={onChange}
                    onChangeRaw={onChangeRaw}
                    dateFormat={"dd/MM/yyyy"}
                    strictParsing
                    onChangeRaw={(event) => {
                        if (event.currentTarget.value.length === 10) {
                            if (monent(event.currentTarget.value, 'dd/MM/yyyy', false).isValid() === false) {
                                toast.error("Chưa đúng định dạng tìm kiếm " + "dd/mm/yyyy", {
                                    position: toast.POSITION.TOP_RIGHT
                                });
                            }
                        }
                    }}
                />
            </FormGroup>
        </div>
    )
}

export { DateTimeBoxSearch, DateBox };
