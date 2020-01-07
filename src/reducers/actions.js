import constants from '../resources/strings'

export const listUserAdmin = (listUserAdmin) => ({
    type: constants.action.list_user_admin,
    listUserAdmin
})
export const listUserUser = (listUserUser) => ({
    type: constants.action.list_user,
    listUserUser
})
export const listUserHospital = (listUserHospital) => ({
    type: constants.action.list_user_hospital,
    listUserHospital
})
export const listHospital = (listHospital) => ({
    type: constants.action.list_hospital,
    listHospital
})
export const listPaymentAgent = (listPaymentAgent) => ({
    type: constants.action.list_payment_agent,
    listPaymentAgent
})
export const listPaymentAgentMethod = (listPaymentAgentMethod) => ({
    type: constants.action.list_payment_agent_method,
    listPaymentAgentMethod
})
export const listCard = (listCard) => ({
    type: constants.action.list_card,
    listCard
})