module.exports = {
    key: {
        storage: {
            current_account: "CURRENT_USER",
            change_avatar: "CHANGE_AVATAR",
            change_user_info: "CHANGE_USER_INFO",
        }
    },
    action: {
        action_user_login: "ACTION_USER_LOGIN",
        action_user_logout: "ACTION_USER_LOGOUT",
        action_change_avatar: "ACTION_CHANGE_AVATAR",
        action_change_user_info: "ACTION_CHANGE_USER_INFO",
        list_user_admin: 'LIST_ADMIN',
        list_user: 'LIST_USER',
        list_user_hospital: 'LIST_USER_HOSPITAL',
        list_hospital: 'LIST_HOSPITAL',
        list_payment_agent: 'LIST_PAYMENT_AGENT',
        list_payment_agent_method: 'LIST_PAYMENT_AGENT_METHOD',
        list_card: 'LIST_CARD'
    },
    message: {
        user: {
            create_error: "Tạo mới tài khoản không thành công!",
            update_error: "Cập nhật tài khoản không thành công!",
            error_code_2: "SĐT đã được sử dụng trong hệ thống. Vui lòng sử dụng SĐT khác!",
            error_code_3: "Email đã được sử dụng trong hệ thống. Vui lòng sử dụng Email khác!",
            error_code_4: "Số văn bằng chuyên môn đã tồn tại trên hệ thống. Vui lòng sử dụng Số văn bằng chuyên môn khác!",
            error_code_5: "Username đã tồn tại trên hệ thống. Vui lòng sử dụng Username khác!",
        }, post: {
            approved_success: "Duyệt câu hỏi và gán cho bác sĩ thành công!",
            approved_error: "Duyệt câu hỏi không thành công!",
        },
        hospital: {
            create_error: "Tạo mới tài khoản không thành công!",
            update_error: "Cập nhật tài khoản không thành công!",
        }
    },
    api: {
        user: {
            search: "/user/search",
            login: "/user/login",
            logout: "/user/logout",
            block: "/user/block",
            create: "/user/create",
            update: "/user/update",
            reset: "/user/reset-password",
            active: "/user/set-active",
            detail: "/user/get-detail",
            updatePassword: "/user/update-password",
            updateEmail: "/user/update-email",
            getListBySpecialist: "/user/getListBySpecialist",
        },
        hospital: {
            search: "/hospital/search",
            create: "/hospital/create",
            update: "/hospital/update",
            delete: '/hospital/delete',
            getDetail: '/hospital/get-detail',
            getHisAccount: '/hospital/get-his-account',
            getAgent: '/hospital/get-agent',
            getBank: '/hospital/get-bank',
            updateSetting: '/hospital/update-setting',
            hospitalPaymentMethod: "/hospital-payment-method/search"
        },
        image: {
            upload: "/image/upload"
        },
        file: {
            upload: "/file/upload"
        },
        paymentAgent: {
            search: "/payment-agent/search",
            create: "/payment-agent/create",
            update: "/payment-agent/update",
            delete: '/payment-agent/delete',
            getDetail: '/payment-agent/getDetail',
            getByHospital: '/payment-agent/getByHospital',
            groupByMethod: '/payment-agent/groupByMethod',
            groupByMethodAgent: 'payment-agent/group-by-method-agent',
        },
        cardTransferHistory: {
            search: "/card-transfer-history/search",
            create: "/card-transfer-history/create",
            update: "/card-transfer-history/update",
            delete: '/card-transfer-history/delete',
        },
        card: {
            search: "/card/search",
            create: "/card/create",
            update: "/card/update",
            delete: '/card/delete',
            mapCard: '/card/map-card',
            cancel: '/card/cancel',
            payIn: '/card/pay-in',
            getDetail: '/card/get-detail'
        },
        bank: {
            getAll: "/bank/get-all"
        },
        transaction: {
            search: "/transaction/search",
            create: "/transaction/create",
            update: "/transaction/update",
            delete: '/transaction/delete',
            report: '/transaction/report'
        }
    }
}