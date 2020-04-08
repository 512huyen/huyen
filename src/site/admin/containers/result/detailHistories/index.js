import React, { useState, useEffect, useRef } from "react";
import { Form, Button, Select, Tooltip, Modal, Input, Checkbox } from "antd";
import { connect } from "react-redux";
import actionSubclinicalResult from "@actions/subclinicalResult";
import actionPatientHistories from "@actions/patientHistories";
import signPrivileges from "@actions/signPrivileges";
import dateUtils from "mainam-react-native-date-utils";
const { Option } = Select;
import Table from "@components/common/Table";
import SelectSize from "@components/common/SelectSize";
import Pagination from "@components/common/Pagination";
import { AdminPage, Panel } from "@admin/components/admin";
import DataContants from '@config/data-contants';
import ShowPdfModal from './ShowPdfModal';
import '../../patientHistories/style.scss';
import { print } from '@components/pdf/utils';
function index(props) {
    const [isOpen, setIsOpen] = useState(false);
    const [currentPdf, setCurrentPdf] = useState('');

    useEffect(() => {
        let link = window.location.pathname.split("/result/");
        let patientDocument = ''
        if (link.length === 2) {
            patientDocument = link[1]
        }
        props.onSearch(patientDocument);
        props.subclinicalResult(patientDocument);
    }, []);
    let data = (props.data || []).map((item, index) => {
        return {
            key: index,
            col1: index + 1,
            col2: item.soPhieu,
            col3: item.formId,
            col4: new Date(item.ngayTaoKetQua).format("dd-MM-yyyy HH:mm:ss"),
            col5: item.lanKQ,
            col6: item.moTa,
            col7: item.filePath
        };
    });
    const toggleModal = (pdf = '') => () => {
        setCurrentPdf(pdf);
        setIsOpen(!isOpen);
    };
    const toggleDownload = (data) => {
        print({
            pdf: data,
            isDownload: true,
            typeUrl: 2,
        })
    }
    return (
        <>
            <AdminPage
                className="mgr-patient-histories"
                icon="subheader-icon fal fa-window"
                header="Quản lý kết quả"
                subheader="Chi tiết kết quả"
            >
                <div className="detail-header">
                    <div className="name">{props.dataPatientDocument[0] && props.dataPatientDocument[0].patientName}</div>
                    <div className="document">{props.dataPatientDocument[0] && props.dataPatientDocument[0].birthdayStr}</div>
                    <div className="value">
                        <span>Mã NB: {props.dataPatientDocument[0] && props.dataPatientDocument[0].patientValue}, </span>
                        <span>Mã HS: {props.dataPatientDocument[0] && props.dataPatientDocument[0].patientDocument}</span>
                    </div>
                </div>
                <Panel
                    id={"mgr-patient-histories"}
                    allowClose={false}
                    allowCollapse={false}
                >
                    <Table
                        scroll={{ x: 800, y: 500 }}
                        style={{ marginLeft: -10, marginRight: -10 }}
                        className="custom"
                        columns={[
                            {
                                title: (
                                    <div className="custome-header">
                                        <div className="title-box">STT</div>
                                        <div className="addition-box" > </div>
                                    </div>
                                ),
                                width: 100,
                                dataIndex: "col1",
                                key: "col1"
                            },
                            {
                                title: (
                                    <div className="custome-header">
                                        <div className="title-box">Số phiếu</div>
                                        <div className="addition-box"></div>
                                    </div>
                                ),
                                width: 250,
                                dataIndex: "col2",
                                key: "col2"
                            },
                            {
                                title: (
                                    <div className="custome-header">
                                        <div className="title-box">Loại dịch vụ</div>
                                        <div className="addition-box"></div>
                                    </div>
                                ),
                                width: 200,
                                dataIndex: "col3",
                                key: "col3",
                            },
                            {
                                title: (
                                    <div className="custome-header">
                                        <div className="title-box">Thời gian trả KQ</div>
                                        <div className="addition-box"></div>
                                    </div>
                                ),
                                width: 200,
                                dataIndex: "col4",
                                key: "col4"
                            },
                            {
                                title: (
                                    <div className="custome-header">
                                        <div className="title-box">Lần trả KQ</div>
                                        <div className="addition-box"></div>
                                    </div>
                                ),
                                width: 200,
                                dataIndex: "col5",
                                key: "col5",
                            },
                            {
                                title: (
                                    <div className="custome-header">
                                        <div className="title-box">Ghi chú</div>
                                        <div className="addition-box"></div>
                                    </div>
                                ),
                                width: 350,
                                dataIndex: "col6",
                                key: "col6",
                            },
                            {
                                title: (
                                    <div className="custome-header">
                                        <div className="title-box"></div>
                                        <div className="addition-box"></div>
                                    </div>
                                ),
                                key: "operation",
                                fixed: "right",
                                width: 100,
                                render: item => {
                                    return (
                                        <div className="col-action">
                                            {/* <Tooltip placement="topLeft" title={"Xóa"}>
                                            <Button className="detail">Chi tiết</Button>
                                        </Tooltip>
                                        <Tooltip placement="topLeft" title={"Sửa"}>
                                            <Button className="download">Tải về</Button>
                                        </Tooltip> */}
                                            <Tooltip placement="topLeft" title={"Chi tiết"}>
                                                <div>
                                                    <a
                                                        onClick={toggleModal(item)}
                                                        className="btn btn-info btn-icon waves-effect waves-themed"
                                                    >
                                                        <i className="fal fa-eye"></i>
                                                    </a>
                                                </div>
                                            </Tooltip>
                                            <Tooltip placement="topLeft" title={"Tải về"}>
                                                <div>
                                                    <a
                                                        onClick={() => toggleDownload(item)}
                                                        className="btn btn-info btn-icon waves-effect waves-themed"
                                                    >
                                                        <i className="fal fa-download"></i>
                                                    </a>
                                                </div>
                                            </Tooltip>
                                        </div>
                                    );
                                },
                                dataIndex: "col7",
                                key: "col7"
                            }
                        ]}
                        dataSource={data}
                    ></Table>
                </Panel>
            </AdminPage>
            {isOpen && (
                <ShowPdfModal
                    isOpenModal={isOpen}
                    toggle={toggleModal()}
                    pdf={currentPdf}
                />
            )}
        </>
    );
}

export default connect(
    state => {
        return {
            auth: state.auth.auth,
            data: state.subclinicalResult.data,
            dataPatientDocument: state.patientHistories.data,
            patientDocument: state.subclinicalResult.patientDocument,
        };
    },
    {
        updateData: actionSubclinicalResult.updateData,
        subclinicalResult: actionSubclinicalResult.subclinicalResult,
        onSearch: actionPatientHistories.onSearch
    }
)(index);
