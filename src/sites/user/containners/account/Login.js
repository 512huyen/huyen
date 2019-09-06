import React, { Component } from 'react';
import { connect } from 'react-redux';
// import { DeviceUUID } from 'device-uuid';
import { ToastContainer, toast } from 'react-toastify';
import clientUtils from '../../../../utils/client-utils';
import userProvider from '../../../../data-access/user-provider';
import dataCacheProvider from '../../../../data-access/datacache-provider';
import constants from '../../../../resources/strings';
import 'react-toastify/dist/ReactToastify.css';
import '../../css/login.css'
var md5 = require('md5');
class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
    }
  }

  login() {
    const { username, password } = this.state;
    // let du = new DeviceUUID().parse();
    // let dua = [
    //     du.language,
    //     du.platform,
    //     du.os,
    //     du.cpuCores,
    //     du.isAuthoritative,
    //     du.silkAccelerated,
    //     du.isKindleFire,
    //     du.isDesktop,
    //     du.isMobile,
    //     du.isTablet,
    //     du.isWindows,
    //     du.isLinux,
    //     du.isLinux64,
    //     du.isMac,
    //     du.isiPad,
    //     du.isiPhone,
    //     du.isiPod,
    //     du.isSmartTV,
    //     du.pixelDepth,
    //     du.isTouchScreen
    // ];
    // let deviceId = du.hashMD5(dua.join(':'));
    if (!username || !password) {
      toast.error("Vui lòng nhập username/password! ", {
        position: toast.POSITION.TOP_RIGHT
      });
    } else {
      userProvider.login(username.trim(), password.trim()).then(s => {
        switch (s.code) {
          case 0:
            let user = s.data.user;
            // user.permission = (s.data.permission || []);
            this.props.dispatch({ type: constants.action.action_user_login, value: user })
            dataCacheProvider.save("", constants.key.storage.current_account, user).then(s => {

            });
            if (this.props.userApp.currentUser && this.props.userApp.currentUser.type == 8) {
              setTimeout(() => {
                this.props.history.push("/user-home");
              }, 500);
            } else {
              setTimeout(() => {
                this.props.history.push("/admin");
              }, 500);
            }
            break;
          case 1:
            toast.error("Thông tin đăng nhập không chính xác, vui lòng kiểm tra lại!", {
              position: toast.POSITION.TOP_RIGHT
            });
            break;
          case 2:
            toast.error("Tài khoản đã bị inactive. Vui lòng liên hệ với Admin! ", {
              position: toast.POSITION.TOP_RIGHT
            });
            break;
          case 3:
            toast.error("Username hoặc password không hợp lệ!", {
              position: toast.POSITION.TOP_RIGHT
            });
            break;
        }
      }).catch(e => {
      })
    }

  }

  render() {
    const { username, password } = this.state;

    return (
      <div className="login-banner" style={{ background: "url('../images/banner/banner.png')" }}>
        <div className="login-info" style={{ background: "url('../images/banner/banner-index.png')" }}>
          <div className="login-title">
            <div className="header-logo">
              <img src="/images/banner/logo.png" alt="" className="image-banner" />
              <div className="header-inner">
                <span className="header-inner-item">Xin chào</span>, Xin mời đăng nhập bằng tài khoản của bạn!
              </div>
            </div>
            <div className="login-inner-input">
              <div className="login-body">
                <div className="login-inner">
                  <input placeholder="Tên đăng nhập" className="input-item" type="text"
                    value={username} autoFocus
                    onChange={(event) => this.setState({ username: event.target.value })}></input>
                </div>
                <div className="login-inner">
                  <input type="password" placeholder="Mật khẩu" className="input-item"
                    value={password}
                    onChange={(event) => this.setState({ password: event.target.value })}
                    onKeyPress={e => {
                      if (e.key === 'Enter') {
                        this.login()
                      }
                    }}>
                  </input>
                </div>
              </div>
              <div className="login-info-item">
                Quên mật khẩu?
            </div>
              <div className="login-info-foorder" onClick={() => { this.login() }}>
                Đăng nhập
            </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
// render() {
//   const { username, password } = this.state;

//   return (
//     <div>
//       <div className="ykhn-home-banner ykhn-priceList-banner">
//         <div className="home-banner priceList-banner" style={{ background: "url('../images/banner/layer1.png')" }}>
//         </div>
//       </div>
//       <div className="ykhn-login">
//         <div className="container">
//           <form className="ykhn-login-info">
//             <h1 className="login-title">ĐĂNG NHẬP</h1>
//             <div className="login-inner">
//               <label className="login-inner-title">Email hoặc đăng nhập</label>
//               <input className="login-input" type="text"
//                 value={username}
//                 onChange={(event) => this.setState({ username: event.target.value })}></input>
//             </div>
//             <div className="login-inner">
//               <label className="login-inner-title">Mật khẩu</label>
//               <input className="login-input" type="password"
//                 value={password}
//                 onChange={(event) => this.setState({ password: event.target.value })}
//                 onKeyPress={e => {
//                   if (e.key === 'Enter') {
//                     this.login()
//                   }
//                 }}>
//               </input>
//             </div>
//             <div className="login-info-item">
//               {/* <a href="#" className="forgot-pass">Quên mật khẩu?</a> */}
//               <button type="button" className="login-button" onClick={() => { this.login() }}>ĐĂNG NHẬP</button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }
// }
function mapStateToProps(state) {
  return {
    userApp: state.userApp
  };
}
export default connect(mapStateToProps)(Login);