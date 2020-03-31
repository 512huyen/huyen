const TB_TABLE = "tb_user";
const dateUtils = require('mainam-react-native-date-utils');
const db = require("../database");

module.exports = {
    getById(id) {
        return new Promise((resolve, reject) => {
            try {
                let sql = `select * from ${TB_TABLE} where id = '${id}'`;;
                db.query(sql, function (err, result) {
                    if (err) {
                        reject(err)
                    }
                    else {
                        if (result.length)
                            resolve(result[0]);
                        else
                            resolve(null);
                    }
                });
            } catch (error) {
                console.log(error)


                reject(error);
            }
        })
    },

    createOrEdit(id, name, birthday, phone, email, lastlogin, active) {
        return new Promise(async (resolve, reject) => {
            try {
                const user = await this.getById(id);
                if (user) {
                    let sql = `update  ${TB_TABLE} set 
                        name=N'${name}', 
                        birthday=N'${birthday}', 
                        phone=N'${phone}', 
                        active=${active}, 
                        lastLogin=N'${lastlogin}' where id=${id}`;
                    db.query(sql, function (err, result) {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(result);
                        }
                    });
                } else {
                    var sql = `insert into ${TB_TABLE} (
                        id, 
                        name, 
                        active, 
                        birthday, 
                        lastLogin, 
                        phone, 
                        email) 
                    values (
                        ${id},
                        N'${name}',
                        ${active},
                        N'${birthday}',
                        N'${lastlogin}',
                        N'${phone}',
                        N'${email}'
                        )`;
                    db.query(sql, function (err, result) {
                        if (err)
                            reject(err);
                        else
                            resolve(result);
                    });
                }
            } catch (error) {
                console.log(error)

                reject(error);
            }
        })
    }
}