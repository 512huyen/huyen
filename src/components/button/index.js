import React from 'react';
import Button from '@material-ui/core/Button';
import './index.scss';
import Radio from '@material-ui/core/Radio';
import Checkbox from '@material-ui/core/Checkbox';
import Tooltip from '@material-ui/core/Tooltip';
function ButtonCreateUpdate({ onClick, title }) {
    return (
        <Button
            className="button-new"
            variant="contained"
            color="primary"
            onClick={onClick}>
            {title}
        </Button>
    )
}
function ButtonFooter({ onClick, title, disabled }) {
    return (
        <Button
            className="button-footer"
            variant="contained"
            color="primary"
            disabled={disabled}
            onClick={onClick}>
            {title}
        </Button>
    )
}
function ButtonPopup({ onClick, title, disabled, className }) {
    return (
        <Button
            className={className}
            variant="contained"
            color="primary"
            disabled={disabled}
            onClick={onClick}>
            {title}
        </Button>
    )
}
function RadioButton({ checked, title, value, onChange, onClick }) {
    return (
        <span className="radio-input">
            <Radio
                className="radio-button"
                checked={checked}
                onChange={onChange}
                value={value}
                name="radio-button-demo"
                inputProps={{ 'aria-label': value }}
                onClick={onClick}
            />
            <span className="button-radio-title">{title}</span>
        </span>
    )
}
function CheckBox({ checked, title, onChange }) {
    return (
        <span className="checkbox-input">
            <Checkbox
                checked={checked}
                onChange={onChange}
                value="hot"
            />
            <span className="button-checkbox-title">{title}</span>
        </span>
    )
}
function ToolTip({ onClick, image, title, disabled }) {
    return (
        <span className={"tooltip-button" + (disabled ? " tooltip-disabled" : "")}>
            <Tooltip title={title}>
                <img src={image} onClick={onClick} alt="" className="" />
            </Tooltip>
        </span>
    )
}

export { ButtonCreateUpdate, ButtonFooter, RadioButton, CheckBox, ToolTip,ButtonPopup };
