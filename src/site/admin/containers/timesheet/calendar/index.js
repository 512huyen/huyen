import React, { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import authAction from "@actions/auth";
import homeTimeSheetAction from "@actions/timesheet/home";
import actionTimeSheet from "@actions/timesheet/create";
import { Calendar, Badge, DatePicker } from "antd";
import dateUtils from "mainam-react-native-date-utils";
import "./style.scss";
import moment from "moment";
import { Popover } from "antd";
import { AdminPage, Panel } from "@admin/components/admin";
const queryString = require("query-string");
function index(props) {
  const [state, _setState] = useState({
    isShowCreate: false,
    data: []
  });
  const setState = _state => {
    _setState(state => ({
      ...state,
      ...(_state || {})
    }));
  };
  useEffect(() => {
    const parsed = queryString.parse(window.location.search);
    let month = new Date();

    if (parsed && parsed.month) {
      month = parsed.month.toDateObject();
    }
    props.changeMonth(moment(month));
    props.loadData();
  }, []);

  const getJob = item => {
    if (item.job) return item.job.name;
    if (props.jobs) {
      let job = props.jobs.find(x => x.id === item.jobId);
      if (job) {
        item.job = job;
        return job.name;
      } else {
        return "";
      }
    }
    return "";
  };
  const getProject = item => {
    if (item.project) return item.project.name;
    if (props.projects) {
      let project = props.projects.find(x => x.id === item.projectId);
      if (project) {
        item.project = project;
        return project.name;
      } else {
        return "";
      }
    }
    return "";
  };

  const getProduct = item => {
    if (item.product) return item.product.name;
    if (props.products) {
      let product = props.products.find(x => x.id === item.productId);
      if (product) {
        item.product = product;
        return product.name;
      } else {
        return "";
      }
    }
    return "";
  };

  const getListData = value => {
    let data = props.data || [];
    let listData;
    if (value) {
      let month = value._d.format("ddMMyyyy");
      let x = data.filter(item => {
        let y = item.fromDate.toDateObject();
        return y.format("ddMMyyyy") == month;
      });
      listData = x.map(item => {
        let tickets = (item.tickets || "").split(",").filter(item2 => item2);
        return {
          type: "success",
          title: `${getProject(item)}-${getProduct(item)}-${getJob(item)}`,
          content: (
            <div style={{ maxWidth: 400 }}>
              <div>
                <span style={{ fontWeight: "bold" }}>Bắt đầu lúc: </span>
                <span style={{ fontWeight: "bold", color: "red" }}>
                  {item.fromDate.toDateObject().format("HH:mm:ss tt")}
                </span>
              </div>
              <div>
                <span style={{ fontWeight: "bold" }}>Kết thúc lúc: </span>
                <span style={{ fontWeight: "bold", color: "red" }}>
                  {item.toDate.toDateObject().format("HH:mm:ss tt")}
                </span>
              </div>
              <div>
                <span style={{ fontWeight: "bold" }}>Nội dung: </span>
                <span style={{}}>{item.description}</span>
              </div>
              {tickets && tickets.length ? (
                <div style={{ display: "flex" }}>
                  <span style={{ fontWeight: "bold" }}>Ticket: </span>
                  <div style={{ marginLeft: 10 }}>
                    <ul>
                      {tickets.map((item2, index) => {
                        return (
                          <li key={index}>
                            <a
                              href={item2.getTicketUrl()}
                              style={{ marginRight: 20 }}
                            >
                              {item2}
                            </a>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              ) : null}
            </div>
          )
        };
      });
    }
    return listData || [];
  };

  const dateCellRender = value => {
    const listData = getListData(value);
    return (
      <ul className="events">
        {listData.map((item, index) => (
          <li key={index}>
            <Popover content={item.content} title={item.title}>
              <Badge status={item.type} text={item.title} />
            </Popover>
          </li>
        ))}
      </ul>
    );
  };
  const getMonthData = value => {
    console.log(value);
    // if (value.month() === 8) {
    //     return 1394;
    // }
  };
  const monthCellRender = value => {
    const num = getMonthData(value);
    return num ? (
      <div className="notes-month">
        <section>{num}</section>
        <span>Backlog number</span>
      </div>
    ) : null;
  };

  return (
    <AdminPage
      className="calendar-page"
      icon="subheader-icon fal fa-window"
      header="TimeSheet"
      subheader="Hiển thị dữ liệu dữ liệu time sheet trong tháng"
    >
      <Panel
        title={"Calendar"}
        id={"calendar-timesheet"}
        allowCollapse={false}
        allowClose={false}
        toolbar={
          <DatePicker.MonthPicker
            format={"MM-YYYY"}
            value={props.monthFilter}
            onChange={date => {
              if (date)
                props.history.replace("?month=" + date._d.format("yyyy/MM/dd"));
              props.changeMonth(date);
            }}
            placeholder={"Chọn tháng"}
          ></DatePicker.MonthPicker>
        }
      >
        <Calendar
          value={props.monthFilter || moment(new Date())}
          onSelect={date => {
            props.history.push(
              "/time-sheet?date=" + date._d.format("yyyy/MM/dd")
            );
          }}
          dateCellRender={dateCellRender}
          monthCellRender={monthCellRender}
          headerRender={() => null}
        />
      </Panel>
    </AdminPage>
  );
}

export default connect(
  state => {
    return {
      monthFilter: (state.homeTimeSheet.monthFilter || "").length
        ? moment(state.homeTimeSheet.monthFilter)
        : state.homeTimeSheet.monthFilter,
      data: state.homeTimeSheet.data,
      auth: state.auth.auth,
      projects: state.project.projects || [],
      products: state.product.products || [],
      jobs: state.job.jobs
    };
  },
  {
    loadData: homeTimeSheetAction.loadData,
    onLogout: authAction.onLogout,
    changeMonth: homeTimeSheetAction.changeMonth
  }
)(index);
