import react from 'react';
import { Link } from 'react-router-dom';
function index(props) {
    return <li>
        {
            props.item.href && (!props.item.menus || !props.item.menus.length) ?
                <Link to={props.item.href}
                    title={props.item.name}
                    data-filter-tags={props.item.filter}
                    className=" waves-effect waves-themed"
                >
                    <i className={props.item.icon}></i>
                    <span className="nav-link-text" data-i18n={props.item.i18n}>
                        {props.item.name}
                    </span>
                </Link>
                :
                <a href="#"
                    title={props.item.name}
                    data-filter-tags={props.item.filter}
                    className=" waves-effect waves-themed"
                >
                    <i className={props.item.icon}></i>
                    <span className="nav-link-text" data-i18n={props.item.i18n}>
                        {props.item.name}
                    </span>
                </a>

        }
        {
            props.item.menus && props.item.menus.length ?
                <ul>
                    {
                        props.item.menus.map((item, index) => {
                            return <li key={index}>
                                <Link to={item.href}
                                    title={item.name}
                                    data-filter-tags={item.filter}
                                    className=" waves-effect waves-themed"
                                >
                                    <span
                                        className="nav-link-text"
                                        data-i18n={item.i18n}
                                    >{item.name}
                                    </span>

                                </Link>
                            </li>

                        })
                    }
                </ul>
                : null

        }
    </li>
}

export default index;