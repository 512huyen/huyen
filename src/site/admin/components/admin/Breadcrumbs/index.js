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
      case "/":
      case "/form-types":
        obj = [
          {
            icon: "fal fa-home mr-1",
            url: "/",
            name: "Home"
          },
          {
            name: "Danh mục loại form"
          }
        ];
        break;
      case "/form-types/create":
        obj = [
          {
            icon: "fal fa-home mr-1",
            url: "/",
            name: "Home"
          },
          {
            url: "/form-types",
            name: "Danh mục loại form"
          },
          {
            name: "Tạo mới"
          }
        ];
        break;
      case "/forms":
        obj = [
          {
            icon: "fal fa-home mr-1",
            url: "/",
            name: "Home"
          },
          {
            name: "Phân quyền biểu mẫu"
          }
        ];
        break;
      case "/forms/create":
        obj = [
          {
            icon: "fal fa-home mr-1",
            url: "/",
            name: "Home"
          },
          {
            url: "/forms",
            name: "Phân quyền biểu mẫu"
          },
          {
            name: "Tạo mới"
          }
        ];
        break;
      case "/users":
        obj = [
          {
            icon: "fal fa-home mr-1",
            url: "/",
            name: "Home"
          },
          {
            name: "Phân quyền ký"
          }
        ];
        break;
      case "/sign-privileges":
        obj = [
          {
            icon: "fal fa-home mr-1",
            url: "/",
            name: "Home"
          },
          {
            name: "Danh mục quyền ký"
          }
        ];
        break;
      case "/sign-privileges/create":
        obj = [
          {
            icon: "fal fa-home mr-1",
            url: "/",
            name: "Home"
          },
          {
            url: "/sign-privileges",
            name: "Danh mục quyền ký"
          },
          {
            name: "Tạo mới"
          }
        ];
        break;
      case "/patient-histories":
        obj = [
          {
            icon: "fal fa-home mr-1",
            url: "/",
            name: "Home"
          },
          {
            name: "Lịch sử ký "
          }
        ];
        break;
      case "/result":
        obj = [
          {
            icon: "fal fa-home mr-1",
            url: "/",
            name: "Home"
          },
          {
            name: "Danh mục kết quả"
          }
        ];
        break;
      default:
        if (url.indexOf("/form-types/edit") == 0) {
          obj = [
            {
              icon: "fal fa-home mr-1",
              url: "/",
              name: "Home"
            },
            {
              url: "/form-types",
              name: "Danh mục loại form"
            },
            {
              name: "Chỉnh sửa loại form"
            }
          ];
        } else if (url.indexOf("/forms/edit") == 0) {
          obj = [
            {
              icon: "fal fa-home mr-1",
              url: "/",
              name: "Home"
            },
            {
              url: "/forms",
              name: "Phân quyền ký"
            },
            {
              name: "Chỉnh sửa phần quyền ký"
            }
          ];
        } else if (url.indexOf("/sign-privileges/edit") == 0) {
          obj = [
            {
              icon: "fal fa-home mr-1",
              url: "/",
              name: "Home"
            },
            {
              url: "/sign-privileges",
              name: "Danh mục quyền ký"
            },
            {
              name: "Chỉnh sửa danh mục quyền ký"
            }
          ];
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
