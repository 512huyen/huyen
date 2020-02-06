import React, { Component } from 'react';
import { connect } from 'react-redux';
import Header from '../components/Header';
import Loadable from 'react-loadable';
import { Redirect, Route, Switch } from 'react-router-dom';
import Login from '../../user/containners/account/Login';
import userProvider from '../../user/containners/account/Login';
import $ from 'jquery';
// import { DeviceUUID } from 'device-uuid';
// import "../../../App.css";
import "../css/user-home.css"
function Loading() {
    return <div></div>;
}

const routes = [
    {
        path: '/user-info',
        component: Loadable({
            loader: () => import('./../../admin/containers/user-info'),
            loading: Loading,
        })
    },
    {
        path: '/home',
        component: Loadable({
            loader: () => import('./../containners/user-home/index'),
            loading: Loading,
        })
    },
    {
        path: '/',
        component: Loadable({
            loader: () => import('./../containners/user-home/index'),
            loading: Loading,
        })
    },
]

class LayoutTemplate extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    componentDidMount() {
        function scroll() {
            $(window).scroll(function () {
                $('.amination').each(function () {
                    var scrollTop_item = $(window).scrollTop(),
                        vh = $(window).height(),
                        $scroll = $(this),
                        $scrollInner = $scroll.find('*'),
                        scrollEasing = $scroll.data('easing'),
                        scrollOffsetTop = $scroll.offset().top,
                        scrollDuration = $scroll.data('duration'),
                        translate_count = $scroll.data('translate'),
                        translate_data = 'translate' + '(' + translate_count + 'em' + ',' + 0 + ')',
                        data_opacity = $scroll.data('opacity');
                    if ((scrollTop_item + vh) >= scrollOffsetTop && $scroll.find($scroll.data('css'))) {
                        $scroll.addClass('animated' + ' ' + $scroll.data('css'));
                        // $('.element-item').addClass('animated fadeInDown');
                    }

                });

            });
        }
        scroll()
    }
    // getUserAccess = () => {
    //     let du = new DeviceUUID().parse();
    //     let dua = [
    //         du.language,
    //         du.platform,
    //         du.os,
    //         du.cpuCores,
    //         du.isAuthoritative,
    //         du.silkAccelerated,
    //         du.isKindleFire,
    //         du.isDesktop,
    //         du.isMobile,
    //         du.isTablet,
    //         du.isWindows,
    //         du.isLinux,
    //         du.isLinux64,
    //         du.isMac,
    //         du.isiPad,
    //         du.isiPhone,
    //         du.isiPod,
    //         du.isSmartTV,
    //         du.pixelDepth,
    //         du.isTouchScreen
    //     ];
    //     // let lastSend = storageMgr.read("LAST_SEND_COUNTER");
    //     let deviceId = du.hashMD5(dua.join(':'));
    //     let data = {
    //         deviceId: deviceId
    //     }
    //     // if (!lastSend || new Date().getTime() - lastSend > 300000) {
    //     userProvider.userAccess(data).then(s => {
    //         if (s && s.data && s.code === 0) {
    //             // storageMgr.write("LAST_SEND_COUNTER", new Date().getTime());
    //         }
    //     }).catch(e => {

    //     })
    //     // }

    // }
    render() {
        return (
            <div className="ykhn-page" >
                <Header />
                <Switch>
                    {
                        routes.map((route, key) => {
                            if (route.component)
                                return <Route key={key}
                                    path={route.path}
                                    render={props => (
                                        <route.component {...props} />
                                    )} />
                            return null;
                        })
                    }
                </Switch>
            </div>
        );
    }
}
function mapStateToProps(state) {
    return {
        userApp: state.userApp
    };
}
export default connect(mapStateToProps)(LayoutTemplate);