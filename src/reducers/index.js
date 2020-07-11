import constants from '../resources/strings'
import clientUtils from '../utils/client-utils';
const defaultState = {
    userApp:
    {
        currentUser: {
        },
        image: "",
        isLogin: false,
        loginToken: "",
        listUserAdmin: [],
        listUserUser: [],
        listUserHospital: [],
        listPaymentAgent: [],
        listHospital: [],
        listPaymentAgentMethod: [],
        listCard: []
    },
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
            newState.userApp.unReadNotificationCount = 0;
            newState.userApp.currentUser = {};
            newState.userApp.isLogin = false;
            newState.userApp.loginToken = "";
            clientUtils.auth = "";
            return newState;
        case constants.action.action_change_avatar:
            newState.userApp.image = action.value
            break;
        case constants.action.action_change_user_info:
            newState.userApp.currentUser = action.value
            break;
        case constants.action.list_user_admin:
            newState.userApp.listUserAdmin = action.listUserAdmin
            break;
        case constants.action.list_user:
            newState.userApp.listUserUser = action.listUserUser
            break;
        case constants.action.list_user_hospital:
            newState.userApp.listUserHospital = action.listUserHospital
            break;
        case constants.action.list_hospital:
            newState.userApp.listHospital = action.listHospital
            break;
        case constants.action.list_payment_agent:
            newState.userApp.listPaymentAgent = action.listPaymentAgent
            break;
        case constants.action.list_payment_agent_method:
            newState.userApp.listPaymentAgentMethod = action.listPaymentAgentMethod
            break;
        case constants.action.list_card:
            newState.userApp.listCard = action.listCard
            break;
    }
    return newState;
}

export default reducer;