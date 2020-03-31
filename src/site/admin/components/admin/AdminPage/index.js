import React from "react";
import "./style.scss";
function index(props) {
  return (
    <div className={`admin-page ${props.className}`}>
      {props.subheader && (
        <div className="subheader">
          <h1 className="subheader-title">
            <i className={props.icon}></i> {props.header}
            <small>{props.subheader}</small>
          </h1>
        </div>
      )}
      {props.children}
    </div>
  );
}
export default index;
