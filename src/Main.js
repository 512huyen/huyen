import React, { Component } from 'react';
import { connect } from 'react-redux';
import userProvider from "./data-access/user-provider";
import { BrowserRouter as Router, Route, Link, Redirect, Switch } from 'react-router-dom';
// import { DeviceUUID } from 'device-uuid';
import constants from "./resources/strings";
import { BrowserRouter } from 'react-router-dom'
import $ from 'jquery';
import Loadable from 'react-loadable';
import dataCacheProvider from './data-access/datacache-provider'
function Loading() {
  return <div></div>;
}
const routes = [
  {
    path: "/admin",
    component: Loadable({
      loader: () => import('./sites/admin/Home'),
      loading: Loading,
    })
  },
  {
    path: "/admin/:function",
    component: Loadable({
      loader: () => import('./sites/admin/Home'),
      loading: Loading,
    })
  },
  {
    path: "/admin/:function/:id",
    component: Loadable({
      loader: () => import('./sites/admin/Home'),
      loading: Loading,
    })
  },
  {
    path: "/dang-nhap",
    component: Loadable({
      loader: () => import('./sites/user/containners/account/Login'),
      loading: Loading,
    })
  },
  {
    path: "/",
    component: Loadable({
      loader: () => import('./sites/user/template/LayoutTemplate'),
      loading: Loading,
    })
  },
  {
    path: "/user-home",
    component: Loadable({
      loader: () => import('./sites/user/template/LayoutTemplate'),
      loading: Loading,
    })
  },
  {
    path: "/user-info",
    component: Loadable({
      loader: () => import('./sites/user/template/LayoutTemplate'),
      loading: Loading,
    })
  },
  {
    path: "/home",
    component: Loadable({
      loader: () => import('./sites/user/template/LayoutTemplate'),
      loading: Loading,
    })
  }
]
class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      deviceId: '',
      checkLoadPage: false
    }
    this.props.dispatch({ type: constants.action.action_user_login, value: userProvider.getAccountStorage() })
    let dataImage = dataCacheProvider.read("", constants.key.storage.change_avatar);
    let userInfo = dataCacheProvider.read("", constants.key.storage.change_user_info);
    if (dataImage) {
      this.props.dispatch({ type: constants.action.action_change_avatar, value: dataImage })
    }
    if (userInfo) {
      this.props.dispatch({ type: constants.action.action_change_user_info, value: userInfo })
    }
  }
  
  loadScript(path) {
    const script = document.createElement("script");
    script.src = path;
    script.async = true;
    document.body.appendChild(script);
  }
  render() {
    return (<BrowserRouter>
      <div className="ykhn">
        <Router>
          <div>
            <Switch>
              {
                routes.map((route, key) => {
                  if (route.component)
                    return <Route exact key={key}
                      path={route.path}
                      render={props => (
                        <route.component {...props} />
                      )} />
                  return null;
                })
              }
            </Switch>
          </div>
        </Router>
      </div>
    </BrowserRouter>);
  }
}
function mapStateToProps(state) {
  return {
    userApp: state.userApp
  };
}

export default connect(mapStateToProps)(Main);