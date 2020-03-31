const clientUtils = require("./../utils/client-utils");
var bodyParser = require("body-parser");
var encrypt = require("../utils/encryptUtils");
var responseUtils = require("../utils/responseUtils.js");
const userProvider = require("../data-access/user-provider");
const dateUtils = require("mainam-react-native-date-utils");
const TB_TABLE = "tb_user";
const API_SERVICES = "/api/user/";
const md5 = require("md5");
const authUtils = require("../utils/auth-utils");
// parse application/json

module.exports = {
  apis: app => {
    return [
      () => {
        /* 
                    code:
                        0: success
                        1: sai username-password
                        2: inactive
                        3: error
                */
        let jsonParser = bodyParser.json();
        app.post("/api/user/login", jsonParser, function(req, res) {
          const { username, password } = req.body;
          var body = {
            isofhMail: username,
            password: password
          };
          clientUtils
            .requestApi(
              "POST",
              `http://release.hr.isofh.com:9305/employees/login`,
              body
            )
            .then(s => {
              switch (s.code) {
                case 0:
                  let data = s.data;
                  let date = new Date();
                  data.employees = data.employees || {};
                  date.setDate(date.getDate() + 30);
                  const employees = data.employees || {};
                  userProvider.createOrEdit(
                    employees.id,
                    employees.name,
                    employees.birthDay,
                    employees.phoneNumber,
                    employees.isofhMail,
                    new Date().format("yyyy-MM-dd HH:mm:ss"),
                    !employees.blocked
                  );
                  data.loginToken = encrypt.encrypt({
                    user: {
                      id: data.employees.id,
                      isofhMail: data.employees.isofhMail,
                      birthDay: data.employees.birthDay,
                      mail: data.employees.mail,
                      phoneNumber: data.employees.phoneNumber,
                      image: data.employees.image
                    },
                    validTo: date
                  });
                  res.send(
                    responseUtils.build(0, data, "Đăng nhập thành công")
                  );

                  //update account
                  try {
                    // let sql = `select * from  ${TB_TABLE} where id = '${data.employees.id}'`
                    // db.query(sql, function (err, result) {
                    //     if (result.length == 0) //not exist user -> insert
                    //     {
                    //         var sql = `insert into ${TB_TABLE}
                    //         (id, name, active, birthday, lastLogin)
                    //         values
                    //         (N'${name}',N'${alias}',${parseInt(parentId)},${parseInt(courseId)},${parseInt(orders)})`;
                    //     } else { //update
                    //     }
                    // });
                    // let { name, alias, parentId, courseId, orders } = req.body;
                    // var sql = `insert into ${TB_TABLE} (name, alias, parentId, courseId, orders) values (N'${name}',N'${alias}',${parseInt(parentId)},${parseInt(courseId)},${parseInt(orders)})`;
                    // db.query(sql, function (err, result) {
                    //     if (err) {
                    //         res.send(responseUtils.build(3, err, "Xảy ra lỗi"));
                    //     }
                    //     else {
                    //         if (result.affectedRows !== 0) {
                    //             res.send(responseUtils.build(0, req.body));
                    //             return;
                    //         }
                    //         res.send(responseUtils.build(1, null, "username hoặc password không đúng"));
                    //     }
                    //     console.log("Connected!");
                    // });
                    // console.log("Connected!1213");
                  } catch (error) {
                    console.log(error);
                  }
                  break;
                default:
                  res.send(responseUtils.build(s.code, null, s.message));
                  break;
              }
            })
            .catch(e => {
              res.send(responseUtils.build(500, null, e.message));
            });

          // console.log(req.body)
          // var sql = `select * from tb_user where username='${username}' and password = '${password}'`;
          // db.query(sql, function (err, result) {
          //     if (err) {
          //         res.send(responseUtils.build(3, err, "Xảy ra lỗi"));
          //     }
          //     else {
          //         if (result.length) {
          //             let user = result[0];
          //             delete user.password;
          //             if (!user.active) {
          //                 res.send(responseUtils.build(2, null, "Tài khoản bị khóa"));
          //                 return;
          //             }
          //             user.loginToken = encrypt.encrypt(user);
          //             res.send(responseUtils.build(0, user));
          //             return;
          //         }
          //         res.send(responseUtils.build(1, null, "username hoặc password không đúng"));
          //     }
          //     //console.log("Connected!");
          // });
        });
      },
      () => {
        /* 
                        code:
                            0: success
                            1: error
                            2: vui lòng đăng nhập
                    */
        let jsonParser = bodyParser.json();
        app.get("/api/user/detail", jsonParser, function(req, res) {
          const user = authUtils.getUser(req.headers);
          if (user && user.user && user.user.id) {
            userProvider
              .getById(user.user.id)
              .then(s => {
                if (s) {
                  res.send(responseUtils.build(0, s));
                } else {
                  res.send(responseUtils.build(1, null));
                }
              })
              .catch(e => {
                res.send(responseUtils.build(1, null, e.message));
              });
          } else {
            res.send(responseUtils.build(3, {}, "Vui lòng đăng nhập"));
          }
        });
      }
    ];
  }
};
