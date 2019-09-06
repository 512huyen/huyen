import constants from '../resources/strings'
import clientUtils from '../utils/client-utils';
const defaultState = {
    userApp:
    {
        currentUser: {

        },
        image: "",
        isLogin: false,
        loginToken: ""
    }
}
const reducer = (state = defaultState, action) => {
    var newState = JSON.parse(JSON.stringify(state));
    switch (action.type) {
        case constants.action.action_user_login:
            newState.userApp.currentUser = action.value ? action.value : newState.userApp.currentUser;
            newState.userApp.isLogin = newState.userApp.currentUser && newState.userApp.currentUser.id;
            newState.userApp.loginToken = newState.userApp.currentUser ? newState.userApp.currentUser.loginToken : "";
            clientUtils.auth = newState.userApp.loginToken;
            newState.userApp.unReadNotificationCount = 0;
            return newState;
        case constants.action.action_user_logout:
            // userProvider.logout();
            newState.userApp.unReadNotificationCount = 0;
            newState.userApp.currentUser = {};
            newState.userApp.isLogin = false;
            newState.userApp.loginToken = "";
            clientUtils.auth = "";
            return newState;
        case constants.action.action_change_avatar:
            newState.userApp.image = action.value
        case constants.action.action_change_user_info:
            newState.userApp.currentUser = action.value
    }
    return newState;
}

export default reducer;