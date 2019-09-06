import React from 'react';
import { FormGroup, Label } from 'reactstrap';
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from 'react-datepicker';
import monent from 'moment';
import { toast } from 'react-toastify';
import Select from 'react-select';
class DateTimeBoxSearch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dateValue: ""
        }
    }
    render() {
        const { label, value, placeholder, required, validates, isInput , classCustom} = this.props;
        return  <FormGroup className={"form-group-xx " + classCustom ? classCustom : ""} style={!isInput ? { marginBottom: 0 } : {}}>
            {isInput &&
                <Label htmlFor="nf-name" className="nf-name">{label}
                    {required ? (<span className="isofh-error">*</span>) : ''}
                    {validates ? (validates.isInvalid && <label className="isofh-error">{validates.message}</label>) : ''}
                </Label>
            }
            <DatePicker
                placeholderText={placeholder ? placeholder :  "Tìm kiếm..."}
                className="form-control"
                selected={value}
                onChange={this.props.onChangeValue}
                onChangeRaw={this.props.onChangeRaw}
                dateFormat={"dd/MM/yyyy"}
                strictParsing
                onChangeRaw={(event) => {
                    if(event.currentTarget.value.length === 10){
                        if(monent(event.currentTarget.value, 'dd/MM/yyyy', false).isValid() === false){
                            toast.error("Chưa đúng định dạng tìm kiếm " + "dd/mm/yyyy", {
                                position: toast.POSITION.TOP_RIGHT
                            });
                        }
                    }
                }} 
            />
        </FormGroup>
    }
}

class DateBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dateValue: ""
        }
    }
    
    render() {
        let { label, value, placeholder, required, validates, isInput , classCustom} = this.props;
        return  <FormGroup className={"form-group-xx " + classCustom ? classCustom : ""} style={!isInput ? { marginBottom: 0 } : {}}>
            {isInput &&
                <Label htmlFor="nf-name" className="nf-name">{label}
                    {required ? (<span className="isofh-error">*</span>) : ''}
                    {validates ? (validates.isInvalid && <label className="isofh-error">{validates.message}</label>) : ''}
                </Label>
            }
            
            <DatePicker
                placeholderText={placeholder ? placeholder :  ""}
                className="form-control"
                selected={ (value && monent(value, 'dd/MM/yyyy', false).isValid() && new Date(value) !== "Invalid Date") ? new Date(value) : "" }
                onChange={this.props.onChangeValue}
                onChangeRaw={this.props.onChangeRaw}
                dateFormat={"dd/MM/yyyy"}
                strictParsing
                onChangeRaw={(event) => {
                    if(monent(event.currentTarget.value, 'dd/MM/yyyy', false).isValid() === false && event.currentTarget.value.length === 10){
                        toast.error("Chưa đúng định dạng tìm kiếm " + "dd/mm/yyyy", {
                            position: toast.POSITION.TOP_RIGHT
                        });
                    }
                }} 
            />
        </FormGroup>
    }
}

class SelectBox extends React.Component {
    constructor(props) {
        super(props);
    }
    handelOnChange(elements) {
        if (!this.props.isMulti) {
            this.props.onChangeSelect(elements, this.props.getIdObject(elements));
        } else {
            if (elements.length) {
                var lists = elements;
                var ids = [];
                elements.forEach(element => {
                    ids.push(this.props.getIdObject(element));
                });
                this.props.onChangeSelect(lists, ids);
            }
            else {
                this.props.onChangeSelect([], []);
            }
        }
    }
    render() {
        const { label, listOption, isMulti, selected, placeholder, required, validates, isDisabled } = this.props;
        var list = [];
        if (!isMulti) {
            if (selected) {
                for (var i = 0; i < listOption.length; i++) {
                    if (selected == this.props.getIdObject(listOption[i]))
                        list.push(listOption[i]);
                }
            }
        } else {
            if (selected) {
                for (var i = 0; i < listOption.length; i++) {
                    if (selected.indexOf(this.props.getIdObject(listOption[i])) != -1)
                        list.push(listOption[i]);
                }
            }
        }
        return (
            <FormGroup className="select-group" >
                {/* <Label htmlFor="nf-name" className="nf-name">{label}
                    {required ? (<span className="isofh-error">*</span>) : ''}
                    {validates ? (validates.isInvalid && <label className="isofh-error">{validates.message}</label>) : ''}
                </Label> */}
                <Select
                    isDisabled={isDisabled ? true : false}
                    className={!isMulti ? "isofh-ui-select basic-single" : "basic-single"}
                    classNamePrefix="select"
                    isSearchable={true}
                    isMulti={isMulti ? true : false}
                    name="color"
                    value={list}
                    options={listOption}
                    getOptionValue={this.props.getIdObject}
                    getOptionLabel={this.props.getLabelObject}
                    onChange={this.handelOnChange.bind(this)}
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
        )
    }
}

export { DateTimeBoxSearch, DateBox, SelectBox }
