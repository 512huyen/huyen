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
import keyEventProvider from './data-access/keyevent-provider'

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
    this.events = [
      "load",
      "mousemove",
      "mousedown",
      "click",
      "scroll",
      "keypress"
    ];
    this.resetTimeout = this.resetTimeout.bind(this);

    for (var i in this.events) {
      window.addEventListener(this.events[i], this.resetTimeout);
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
  clearTimeout() {
    if (this.warnTimeout) clearTimeout(this.warnTimeout);
  
    if (this.logoutTimeout) clearTimeout(this.logoutTimeout);
  }
  
  setTimeout() {
    this.warnTimeout = setTimeout(this.warn, 3600000);
  }
  
  resetTimeout() {
    this.clearTimeout();
    this.setTimeout();
  }
  componentDidMount() {
    document.addEventListener("keydown", this._handleKeyDown);
    document.addEventListener("keyup", this._handleKeyUp);
  }
  destroy() {
    this.clearTimeout();
  
    for (var i in this.events) {
      window.removeEventListener(this.events[i], this.resetTimeout);
    }
  }
  _handleKeyDown = (event) => {
    let keycode = event.keyCode;
    switch (keycode) {
      case 18:
        keyEventProvider.altDown = true;
        break;
      case 115:
        keyEventProvider.f4Down = true;
        break;
      case 17:
        keyEventProvider.ctrlDown = true;
        break;
      case 16:
        keyEventProvider.shiftDown = true;
      case 91:
        keyEventProvider.windowsDown = true;
        break;
    }
    let func = keyEventProvider.getFunction(keycode, 'keydown');
    if (func) {
      if (!func()) {
        event.preventDefault();
        event.stopPropagation();
      }
      return false;
    }
  }
  _handleKeyUp = (event) => {
    let keycode = event.keyCode;
    switch (keycode) {
      case 18:
        keyEventProvider.altDown = false;
        break;
      case 115:
        keyEventProvider.f4Down = false;
        break;
      case 17:
        keyEventProvider.ctrlDown = false;
        break;
      case 16:
        keyEventProvider.shiftDown = false;
      case 91:
        keyEventProvider.windowsDown = false;
        break;
    }
    let func = keyEventProvider.getFunction(keycode, 'keyup');
    if (func) {
      if (!func()) {
        event.preventDefault();
        event.stopPropagation();
      }
      return false;
    }
  }
  componentWillUnmount() {
    document.removeEventListener("keydown", this._handleKeyDown);
    document.removeEventListener("keyup", this._handleKeyUp);
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