import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect,
  Switch
} from "react-router-dom";
// import { useRouter } from 'next/router'
function index(props) {
  // const router = useRouter();
  const getBreadcrumbs = () => {
    let url = (window.location.pathname || "").toLowerCase();
    let obj = [];
    switch (url) {
      case "/admin":
      case "/admin/form-types":
        obj = [
          {
            icon: "fal fa-home mr-1",
            url: "/admin",
            name: "Home"
          },
          {
            name: "Danh mục loại form"
          }
        ];
        break;
      case "/admin/form-types/create":
        obj = [
          {
            icon: "fal fa-home mr-1",
            url: "/admin",
            name: "Home"
          },
          {
            url: "/admin/form-types",
            name: "Danh mục loại form"
          },
          {
            name: "Tạo mới"
          }
        ];
        break;
      case "/admin/forms":
        obj = [
          {
            icon: "fal fa-home mr-1",
            url: "/admin",
            name: "Home"
          },
          {
            name: "Phân quyền biểu mẫu"
          }
        ];
        break;
      case "/admin/forms/create":
        obj = [
          {
            icon: "fal fa-home mr-1",
            url: "/admin",
            name: "Home"
          },
          {
            url: "/admin/forms",
            name: "Phân quyền biểu mẫu"
          },
          {
            name: "Tạo mới"
          }
        ];
        break;
      default:
        if (url.indexOf("/admin/form-types/edit") == 0) {
          obj = [
            {
              icon: "fal fa-home mr-1",
              url: "/admin",
              name: "Home"
            },
            {
              url: "/admin/form-types",
              name: "Danh mục loại form"
            },
            {
              name: "Chỉnh sửa loại form"
            }
          ];
        } else {
          if (url.indexOf("/admin/forms/edit") == 0) {
            obj = [
              {
                icon: "fal fa-home mr-1",
                url: "/admin",
                name: "Home"
              },
              {
                url: "/admin/forms",
                name: "Phân quyền biểu mẫu"
              },
              {
                name: "Chỉnh sửa biểu mẫu"
              }
            ];
          }
        }
        break;
    }
    return obj;
  };

  console.log(window.location.pathname);
  const breadCrumb = getBreadcrumbs();
  return (
    <ol className="breadcrumb bg-fusion-300">
      {breadCrumb.map((item, index) => {
        if (index < breadCrumb.length - 1)
          return (
            <li className="breadcrumb-item" key={index}>
              <Link to={item.url || "#"} className="text-white">
                {item.icon && <i className="fal fa-home mr-1"></i>}
                {item.name}
              </Link>
            </li>
          );
        return (
          <li className="breadcrumb-item active text-white" key={index}>
            {item.name}
          </li>
        );
      })}
    </ol>
  );
}
export default index;
