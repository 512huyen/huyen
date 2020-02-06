import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import './index.scss';
import { FormGroup } from 'reactstrap';
import Select from 'react-select';
function SelectText({ placeholder, title, isMulti, getIdObject, onChangeSelect, listOption, selected, isDisabled, getLabelObject }) {
    const handelOnChange = (elements) => {
        if (!isMulti) {
            onChangeSelect(elements, getIdObject(elements));
        } else {
            if (elements.length) {
                var lists = elements;
                var ids = [];
                elements.forEach(element => {
                    ids.push(getIdObject(element));
                });
                onChangeSelect(lists, ids);
            }
            else {
                onChangeSelect([], []);
            }
        }
    }
    var list = [];
    if (!isMulti) {
        if (selected || selected === 0) {
            for (var i = 0; i < listOption.length; i++) {
                if (selected === getIdObject(listOption[i]))
                    list.push(listOption[i]);
            }
        }
    } else {
        if (selected) {
            for (var i = 0; i < listOption.length; i++) {
                if (selected.indexOf(getIdObject(listOption[i])) !== -1)
                    list.push(listOption[i]);
            }
        }
    }
    return (
        <div className="select-box-search">
            <div className="search-name">{title}</div>
            <FormGroup className="select-group" >
                <Select
                    isDisabled={isDisabled ? true : false}
                    className={!isMulti ? "isofh-ui-select basic-single" : "basic-single"}
                    classNamePrefix="select"
                    isSearchable={true}
                    isMulti={isMulti ? true : false}
                    name="color"
                    value={list}
                    options={listOption}
                    getOptionValue={getIdObject}
                    getOptionLabel={getLabelObject}
                    onChange={handelOnChange.bind(this)}
                    isClearable={false}
                    placeholder={placeholder}
                    theme={theme => ({
                        ...theme,
                        borderRadius: '0.25rem',
                        colors: {
                            ...theme.colors,
                            primary: "#63c2de"
                        },
                    })}
                />
            </FormGroup>
        </div>
    )
}
function SelectModal({ placeholder, title, isMulti, getIdObject, onChangeSelect, listOption, selected, isDisabled, getLabelObject, width, validation }) {
    const handelOnChange = (elements) => {
        if (!isMulti) {
            onChangeSelect(elements, getIdObject(elements));
        } else {
            if (elements.length) {
                var lists = elements;
                var ids = [];
                elements.forEach(element => {
                    ids.push(getIdObject(element));
                });
                onChangeSelect(lists, ids);
            }
            else {
                onChangeSelect([], []);
            }
        }
    }
    var list = [];
    if (!isMulti) {
        if (selected || selected === 0) {
            for (var i = 0; i < listOption.length; i++) {
                if (selected === getIdObject(listOption[i]))
                    list.push(listOption[i]);
            }
        }
    } else {
        if (selected) {
            for (var i = 0; i < listOption.length; i++) {
                if (selected.indexOf(getIdObject(listOption[i])) !== -1)
                    list.push(listOption[i]);
            }
        }
    }
    return (
        <div className="select-box-search select-box-search-modal">
            <div className="row">
                <div className={"col-md-" + width}>
                    <div className="search-name">{title}</div>
                </div>
                <div className={"col-md-" + (12 - width)}>
                    <FormGroup className="select-group" >
                        <Select
                            isDisabled={isDisabled ? true : false}
                            className={!isMulti ? "isofh-ui-select basic-single" : "basic-single"}
                            classNamePrefix="select"
                            isSearchable={true}
                            isMulti={isMulti ? true : false}
                            name="color"
                            value={list}
                            options={listOption}
                            getOptionValue={getIdObject}
                            getOptionLabel={getLabelObject}
                            onChange={handelOnChange.bind(this)}
                            isClearable={false}
                            placeholder={placeholder}
                            theme={theme => ({
                                ...theme,
                                borderRadius: '0.25rem',
                                colors: {
                                    ...theme.colors,
                                    primary: "#63c2de"
                                },
                            })}
                        />
                    </FormGroup>
                    <div className="error-dob error-dob-select">{validation}</div>
                </div>
            </div>
        </div>
    )
}

export { SelectText, SelectModal };
