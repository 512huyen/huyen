module.exports = {
  key: {
    SUMARY_BY_MONTH: "SUMARY_BY_MONTH",
    SUMARY_BY_YEAR: "SUMARY_BY_YEAR"
  },
  text: {
    internal_server_error: "Xảy ra lỗi, vui lòng thử lại sau",
    user: {
      success_login: "Đăng nhập thành công",
      login_error: "Đăng nhập không thành công"
    }
  },
  api: {
    user: {
      login: "/api/user/login",
      detail: "/api/user/detail"
    },
    product: {
      search: "/api/product/search",
      delete: "/api/product/delete",
      update: "/api/product/update",
      create: "/api/product/create",
      get_by_id: "/api/product",
      set_my_product: "/api/product/set-my-product"
    },
    project: {
      search: "/api/project/search",
      delete: "/api/project/delete",
      update: "/api/project/update",
      create: "/api/project/create",
      get_by_id: "/api/project",
      set_my_project: "/api/project/set-my-project"
    },
    job: {
      search: "/api/job/search",
      delete: "/api/job/delete",
      update: "/api/job/update",
      create: "/api/job/create",
      get_by_id: "/api/job",
      set_my_job: "/api/job/set-my-job"
    },
    timesheet: {
      create: "/api/timesheet/create",
      update: "/api/timesheet/update",
      search: "/api/timesheet/search",
      delete: "/api/timesheet/delete",
      detail: "/api/timesheet/detail",
      sumary_year: "/api/timesheet/sumary/year",
      sumary_month: "/api/timesheet/sumary/month"
    },
    file: {
      upload: "/api/file/upload-file"
    },
    formTypes: "/api/signer/v1/form-types",
    forms: "/api/signer/v1/forms",
    login: "/api/signer/v1/auth/login",
    users: "/api/signer/v1/users",
    signPrivileges: "/api/signer/v1/sign-privileges",
    signedFiles: "/api/signer/v1/sign/signed-files",
    patientHistories: "/api/emr/v1/patient-histories",
    subclinicalResult: "/api/subclinical-result/v1/result-file",
  }
};
