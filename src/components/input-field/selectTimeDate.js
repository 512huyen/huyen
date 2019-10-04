import React, { PureComponent } from 'react'
import { connect } from 'react-redux';
import dateUtils from 'mainam-react-native-date-utils';
import keyEventProvider from '../../data-access/keyevent-provider';
import '../css/selectSearch.css'
import '../css/selectTimeDate.css'
import DataContants from '../../config/data-contants'
class SelectSearch extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            listSearch: [],
            page: 1,
            size: 60,
            openListService: false,
            data: DataContants.dataMM,
            placeholder: this.props.placeholder,
            readOnlyAll: this.props.readOnlyAll,
        }
        this.onSearch = this.onSearch.bind(this);
        this.onScroll = this.onScroll.bind(this);
    }
    componentWillUnmount() {
        keyEventProvider.unregister(40, this);
        keyEventProvider.unregister(38, this);
        keyEventProvider.unregister(13, this);
    }
    onSearch(e) {
        let list = this.state.data
        let event = e.target.value
        this.setState({
            value: event,
            selected: true
        })
        event = event.toLocaleLowerCase().unsignText()
        list = (this.state.data || []).filter(item => {
            return item.name.toLocaleLowerCase().unsignText().indexOf(event) != -1
        })
        this.setState({
            dataSelect: JSON.parse(JSON.stringify(list)),
            openListService: true,
            page: 1,
            regAtHospitalId: event,
            selectedIndex: 0
        })
    }
    onScroll(e) {
        let element = e.target ? e.target : e
        if (parseInt(element.scrollHeight) - parseInt(element.scrollTop) >= parseInt(element.clientHeight)) {
            if (this.state.page * this.state.size < this.state.dataSelect.length) {
                this.setState({
                    page: this.state.page + 1
                })
            }
        }
    }
    unregisterKey() {
        keyEventProvider.unregister(40, this);
        keyEventProvider.unregister(38, this);
        keyEventProvider.unregister(13, this);
    }
    registerKey() {
        let itemTop = 0
        keyEventProvider.register(40, this, () => {
            let index = (this.state.selectedIndex || 0);
            index++;
            // if (index >= this.state.dataSelect.length){
            //     index = this.state.dataSelect.length - 1;
            // }
            itemTop = this[`itemScroll${this.state.selectedIndex}`].offsetTop + 33
            if ((this.state.selectedIndex + 1) == this.state.dataSelect.length) {
                index = 0
                itemTop = this[`itemScroll${index}`].offsetTop - 33
                this.scrollSelect.scrollTop = itemTop
            }
            this.setState({ selectedIndex: index })
            let numberItem = this.state.page * this.state.size
            let indexItem = this.state.selectedIndex + 1
            let element = this.scrollSelect
            if (itemTop >= parseInt(element.clientHeight)) {
                this.scrollSelect.scrollTop = itemTop
            }
            if (indexItem >= numberItem) {
                this.setState({
                    page: this.state.page + 1,
                    selectedIndex: index
                }, () => {
                    this.scrollSelect.scrollTop = itemTop
                })
            }
        });
        keyEventProvider.register(38, this, () => {
            let index = (this.state.selectedIndex || 0);
            index--;
            if (index < 0) {
                index = 0
            }
            let itemTop = this[`itemScroll${this.state.selectedIndex}`].offsetTop - 33
            this.setState({ selectedIndex: index })
            let numberItem = this.state.page * this.state.size
            let indexItem = this.state.selectedIndex - 1
            if (indexItem < numberItem) {
                this.setState({
                    selectedIndex: index
                }, () => {
                    this.scrollSelect.scrollTop = itemTop
                })
            }
            this.setState({ selectedIndex: index })
        });
        keyEventProvider.register(13, this, () => {
            if (this.state.selectedIndex >= 0 && this.state.selectedIndex < this.state.dataSelect.length) {
                let item = this.state.dataSelect[this.state.selectedIndex]
                this.currentItem = item;
                this.setState({
                    value: item.name,
                    selected: false
                })
                if (this.props.onChange)
                    this.props.onChange(item)
            }
        });
    }
    setValue(value) {
        this.setState({
            value: value
        })
    }
    clear() {
        this.currentItem = null;
        this.setState({
            value: ""
        })
    }
    closeListHospital() {
        setTimeout(function () {
            this.setState({
                selected: false
            })
        }.bind(this), 150);
    }
    // checkInsuranceCardPortal(s, e) {
    //     if (e.key == "Tab" || e.key == "Enter") {
    //         if (this.props.onChange)
    //             this.props.onChange(this, null, e);
    //     }
    // }
    render() {
        return (
            <div className="select-header">
                {this.state.selected ? <span onClick={() => {
                    this.setState({
                        selected: false
                    })
                }} className="overlay-popup"></span> : null}
                <input type="text" className="active-element form-control priority"
                    onBlur={(e) => {
                        this.closeListHospital(e)
                        this.unregisterKey()
                    }}
                    onChange={this.onSearch}
                    value={this.state.value}
                    disabled={this.state.readOnlyAll ? 'true' : ''}
                    onFocus={(e) => {
                        this.onSearch(e)
                        this.registerKey()
                    }}
                    placeholder={this.state.placeholder}
                />
                <ul ref={ref => this.scrollSelect = ref}
                    className={this.state.selected ? "list-hospital-2 popup-list mostly-customized-scrollbar display-lists" : 'list-hospital-2 popup-list mostly-customized-scrollbar'}
                    // onScroll={this.onScroll}
                    >
                    {
                        (DataContants.dataHour || []).filter((item, index) => {
                            return index < ((this.state.page - 1) * this.state.size) + this.state.size;
                        }).map((item, index) => {
                            return (
                                <li key={index} ref={ref => { this[`itemScroll${index}`] = ref }} className={this.state.selectedIndex == index ? "active-item" : ""} onClick={
                                    (e) => {
                                        this.currentItem = item;
                                        this.setState({
                                            value: item.name,
                                            selected: false
                                        })
                                        if (this.props.onChange)
                                            this.props.onChange(item)
                                    }
                                }>
                                    <table cellSpacing="0" className="select-table-time">
                                        <tr className="select-time-date">
                                            <td className="time-date-title">{item.name}</td>
                                        </tr>
                                    </table>
                                </li>
                            )
                        })
                    }
                </ul>
                <ul ref={ref => this.scrollSelect = ref}
                    className={this.state.selected ? "list-hospital-3 popup-list mostly-customized-scrollbar display-lists" : 'list-hospital-3 popup-list mostly-customized-scrollbar'}
                    // onScroll={this.onScroll}
                    >
                    {
                        (this.state.dataSelect || []).filter((item, index) => {
                            return index < ((this.state.page - 1) * this.state.size) + this.state.size;
                        }).map((item, index) => {
                            return (
                                <li key={index} ref={ref => { this[`itemScroll${index}`] = ref }} className={this.state.selectedIndex == index ? "active-item" : ""} onClick={
                                    (e) => {
                                        this.currentItem = item;
                                        this.setState({
                                            value: item.name,
                                            selected: false
                                        })
                                        if (this.props.onChange)
                                            this.props.onChange(item)
                                    }
                                }>
                                    <table cellSpacing="0" className="select-table-time">
                                        <tr className="select-time-date">
                                            <td className="time-date-title">{item.name}</td>
                                        </tr>
                                    </table>
                                </li>
                            )
                        })
                    }
                </ul>
                <ul ref={ref => this.scrollSelect = ref}
                    className={this.state.selected ? "list-hospital-4 popup-list mostly-customized-scrollbar display-lists" : 'list-hospital-4 popup-list mostly-customized-scrollbar'}
                    // onScroll={this.onScroll}
                    >
                    {
                        (this.state.dataSelect || []).filter((item, index) => {
                            return index < ((this.state.page - 1) * this.state.size) + this.state.size;
                        }).map((item, index) => {
                            return (
                                <li key={index} ref={ref => { this[`itemScroll${index}`] = ref }} className={this.state.selectedIndex == index ? "active-item" : ""} onClick={
                                    (e) => {
                                        this.currentItem = item;
                                        this.setState({
                                            value: item.name,
                                            selected: false
                                        })
                                        if (this.props.onChange)
                                            this.props.onChange(item)
                                    }
                                }>
                                    <table cellSpacing="0" className="select-table-time">
                                        <tr className="select-time-date">
                                            <td className="time-date-title">{item.name}</td>
                                        </tr>
                                    </table>
                                </li>
                            )
                        })
                    }
                </ul>
            </div>
        )
    }
}
function mapStateToProps(state) {
    return {
        userApp: state.userApp
    };
}
export default (connect(mapStateToProps, null, null, { withRef: true })(SelectSearch));  
