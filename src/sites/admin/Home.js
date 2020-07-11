import React, { Component } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { Container } from 'reactstrap';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import userProvider from '../../data-access/user-provider';
import { BrowserRouter, Router, NavLink } from "react-router-dom";
import '../../App.css';
import './Home.scss';
// import { DeviceUUID } from 'device-uuid';

import {
    AppAside,
    AppBreadcrumb,
    AppHeader,
    AppSidebar,
    AppSidebarFooter,
    AppSidebarForm,
    AppSidebarHeader,
    AppSidebarMinimizer,
    AppSidebarNav,
} from '@coreui/react';
// routes config
import routes from './configs/routes';
import DefaultAside from './components/layout/DefaultAside';
import DefaultHeader from './components/layout/DefaultHeader';
import WithRoot from './WithRoot';
import './App.scss';
import ArrowDropDown from '@material-ui/icons/ArrowDropDown';
import IconButton from '@material-ui/core/IconButton';
import Login from '../user/containners/account/Login';
class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            menus: []
        }
    }
    getMenu() {
        let allMenus = [
            {
                userType: [1, 2],
                name: "Quản lý tài khoản",
                url: '',
                imgUrl: '/icon/ql-tk.png',
                classActiveStyle: 'user',
                subMenu: [
                    {
                        role: [],
                        name: "Tài khoản hệ thống",
                        url: '/admin/user-admin',
                        imgUrl: '/icon/the.png',
                        classActiveStyle: 'user-admin',
                    },
                    {
                        role: [],
                        name: "Tài khoản cơ sở y tế",
                        url: '/admin/user-hospital',
                        imgUrl: '/icon/danh-muc-tk.png',
                        classActiveStyle: 'user-hospital',
                    },
                    // {
                    //     role: [],
                    //     name: "Tài khoản người bệnh",
                    //     url: '/admin/user',
                    //     imgUrl: '/icon/the.png',
                    //     classActiveStyle: 'user-admin',
                    // }
                ]
            },
            {
                userType: [1, 4],
                name: "Quản lý thẻ",
                url: '/admin/card',
                imgUrl: '/icon/the.png',
                classActiveStyle: "the"
            },
            {
                userType: [1],
                name: "Danh sách thẻ NB",
                url: '/admin/card-user',
                imgUrl: '/icon/danh-muc-tk.png',
                classActiveStyle: "danh-muc-tk"
            },
            {
                userType: [1, 4],
                name: "Lịch sử giao dịch",
                url: '/admin/transaction-history',
                imgUrl: '/icon/ls-giao-dich.png',
                classActiveStyle: "ls-giao-dich"
            },
            {
                userType: [1],
                name: "Quản lý csyt",
                url: '/admin/hospital',
                imgUrl: '/icon/csyt.png',
                classActiveStyle: "csyt"
            },
            {
                userType: [1],
                name: "Danh mục nhà cung cấp",
                url: '/admin/payment-agent',
                imgUrl: '/icon/nha-cc.png',
                classActiveStyle: "nha-cc"
            },
            {
                userType: [1, 2, 4],
                name: "Đối soát",
                url: '/admin/control',
                imgUrl: '/icon/nha-cc.png',
                classActiveStyle: "control"
            },
            {
                userType: [1, 2, 4],
                name: "Báo cáo tài chính",
                url: '',
                imgUrl: '/icon/the.png',
                classActiveStyle: 'the',
                subMenu: [
                    {
                        role: [],
                        name: "BC Nạp tiền",
                        url: '/admin/recharge',
                        imgUrl: '/icon/the.png',
                        classActiveStyle: 'recharge',
                    },
                    {
                        role: [],
                        name: "BC Thanh toán",
                        url: '/admin/pay',
                        imgUrl: '/icon/the.png',
                        classActiveStyle: 'pay',
                    },
                    {
                        role: [],
                        name: "BC Tạm ứng",
                        url: '/admin/advance-payment',
                        imgUrl: '/icon/the.png',
                        classActiveStyle: 'advance-payment',
                    },
                    {
                        role: [],
                        name: "BC Hoàn dịch vụ",
                        url: '/admin/refund-service',
                        imgUrl: '/icon/the.png',
                        classActiveStyle: 'refund-service',
                    },
                ]
            },
        ];
        return allMenus.filter(item => {
            if (!(item.userType || []).length)
                return true;
            for (let i = 0; i < item.userType.length; i++) {
                if (item.userType[i] == (this.props.userApp.currentUser || {}).type) {
                    return true;
                }
            }
        })
    }
    openMenu(item) {
        item.open = !item.open;
        this.setState({ menus: [...this.state.menus] })
    }
    componentDidMount() {
        this.setState({ menus: this.getMenu() })
    }
    render() {
        const { classes } = this.props;
        return (
            <div className="app">
                <AppHeader fixed>
                    <DefaultHeader />
                </AppHeader>
                <div className="app-body">
                    {
                        this.props.userApp && this.props.userApp.currentUser && this.props.userApp.currentUser.type && this.props.userApp.currentUser.type == 8 ? null :
                            <AppSidebar fixed display="lg">
                                <AppSidebarHeader />
                                <AppSidebarForm />
                                <div className="scrollbar-container Home-sidebar-1 sidebar-nav ps ps--active-y ps-container">
                                    <ul className="nav">
                                        {
                                            this.state.menus && this.state.menus.length > 0 && this.state.menus.map((item, index) => {
                                                if (!(item.subMenu && item.subMenu.length)) {
                                                    return <li key={index} className="nav-item"><NavLink style={{ backgroundImage: `url( ${item.imgUrl})` }} className={'nav-link ' + `${item.classActiveStyle}`} activeclassnameoutlinedinput="active" to={item.url}>{item.name}</NavLink></li>
                                                }
                                                return <li key={index} className="nav-item">
                                                    <a style={{ backgroundImage: `url( ${item.imgUrl})` }} className={'nav-link ' + `${item.classActiveStyle}`} activeclassname="active" onClick={this.openMenu.bind(this, item)} >{item.name}
                                                        <IconButton color="primary" className={classes.button + " button-primary"} aria-label="ArrowDropDown">
                                                            <ArrowDropDown />
                                                        </IconButton>
                                                    </a>
                                                    {
                                                        item.open &&
                                                        <ul className="menu-ul">
                                                            {
                                                                item.subMenu.map((item2, index) => <li key={index} className="menu-left">
                                                                    <NavLink key={index} style={{ backgroundImage: `url( ${item2.imgUrl})` }} className={'nav-link2 ' + `${item2.classActiveStyle}`} activeclassname="active" to={item2.url}>{item2.name}</NavLink>
                                                                </li>)
                                                            }
                                                        </ul>
                                                    }
                                                </li>
                                            })
                                        }
                                    </ul>
                                </div>
                                <AppSidebarFooter />
                                {/* <AppSidebarMinimizer /> */}
                            </AppSidebar>
                    }
                    <main className="main">
                        {/* <AppBreadcrumb appRoutes={routes} /> */}
                        <Container fluid>
                            <Switch>
                                {routes.map((route, idx) => {
                                    return route.component ? (
                                        <Route key={idx}
                                            path={route.path}
                                            exact={route.exact}
                                            name={route.name}

                                            render={props => (
                                                <route.component {...props} />

                                            )} />)
                                        : (null);
                                },
                                )}
                            </Switch>
                            {
                                (!this.props.userApp.isLogin) &&
                                <Redirect to="/dang-nhap" component={Login} />
                            }
                        </Container>
                    </main>
                </div>
            </div>
        );
    }
}

Home.propTypes = {
    classes: PropTypes.object.isRequired,
};

const styles = theme => ({
    sidebar: {
        textAlign: 'left',
    }
})

function mapStateToProps(state) {
    return {
        userApp: state.userApp
    };
}
export default connect(mapStateToProps)(WithRoot(withStyles(styles)(Home)));