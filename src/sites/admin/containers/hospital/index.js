import React, { useState } from 'react';
import Modal from '../../../../components/modal';
function HisHospital({ data, useCallback, dataHospital }) {
    const [open] = useState(true);
    const [name] = useState(dataHospital && dataHospital.hospital && dataHospital.hospital.name ? dataHospital.hospital.name : null);
    const setTplModal = () => {
        return (
            <table className="table-his-hospital" cellSpacing="0">
                <thead>
                    <tr>
                        <td style={{ width: "5%" }}>STT</td>
                        <td style={{ width: "17%" }}>Username</td>
                        <td style={{ width: "22%" }}>Họ và tên</td>
                        <td style={{ width: "20%" }}>Hạn mức nạp tiền</td>
                        <td style={{ width: "25%" }}>Khoa/ Phòng</td>
                        <td style={{ width: "11%" }}>Nhà</td>
                    </tr>
                </thead>
                <tbody>
                    {
                        data && data.length ? data.map((item, index) => {
                            return (
                                <tr
                                    hover
                                    key={index}
                                    tabIndex={-1}>
                                    <td style={{ textAlign: "center" }}>{index + 1}</td>
                                    <td>{item.username}</td>
                                    <td>{item.name}</td>
                                    <td style={{ textAlign: "center" }}>{item.depositLimit}</td>
                                    <td style={{ textAlign: "center" }}>{item.department}</td>
                                    <td style={{ textAlign: "center" }}>{item.location}</td>
                                </tr>
                            );
                        })
                            :
                            <tr>
                                <td colSpan="6">Không có dữ liệu</td>
                            </tr>
                    }
                </tbody>
            </table>
        )
    }
    return (
        <Modal
            isOpen={open}
            toggle={useCallback}
            styleName={{ color: "#2198bc", fontWeight: 600, textTransform: "capitalize", fontSize: 23, marginTop: -18 }}
            titleName={name ? "(" + name + ")" : null}
            title={"Danh sách các tài khoản HIS"}
            Children={setTplModal()}
            width={950}
            padding={50}
        />
    );
}

export default HisHospital;