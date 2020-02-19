import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import './index.scss';
function InputText({ placeholder, value, onChange, title, validation, disabled }) {
    return (
        <div className="search-type">
            <div className="title-search-input">{title}</div>
            <input
                value={value}
                id={value} name={value}
                placeholder={placeholder}
                className="search-input-custom"
                onChange={onChange}
                disabled={disabled}
            />
            <div className="error-dob">{validation}</div>
        </div>
    )
}
function InputModal({ placeholder, value, onChange, title, width, type, validation }) {
    return (
        <div className="search-type search-type-modal">
            <div className="row">
                <div className={"col-md-" + width}>
                    <span className="title-search-input">{title}</span>
                </div>
                <div className={"col-md-" + (12 - width)}>
                    <input
                        value={value}
                        id={value} name={value}
                        placeholder={placeholder}
                        className="search-input-custom"
                        onChange={onChange}
                        type={type}
                    />
                    <div className="error-dob">{validation}</div>
                </div>
            </div>
        </div>
    )
}
function InputDisabled({ title, value, width }) {
    return (
        <div className="search-type search-type-disabled">
            <div className="row">
                <div className={"col-md-" + width}>
                    <span className="title-search-input">{title}</span>
                </div>
                <div className={"col-md-" + (12 - width)}>
                    <div className="title-input-disabled">{value}</div>
                </div>
            </div>
        </div>
    )
}
function InputButton({ title, tpl, width, validation }) {
    return (
        <div className="search-type-radio">
            <div className="row">
                <div className={"col-md-" + width}>
                    <span className="title-search-input">{title}</span>
                </div>
                <div className={"col-md-" + (12 - width)}>
                    {tpl}
                    <div className="error-dob">{validation}</div>
                </div>
            </div>
        </div>
    )
}
function InputDetail({ title, value, width, style, onClick }) {
    return (
        <div className="search-type search-type-detail">
            <div className="row">
                <div className={"col-md-" + width}>
                    <span className="label-detail">{title}</span>
                </div>
                <div className={"col-md-" + (12 - width)}>
                    <div className="content-detail" onClick={onClick} style={style}>{value}</div>
                </div>
            </div>
        </div>
    )
}

export { InputText, InputModal, InputDisabled, InputButton, InputDetail };
