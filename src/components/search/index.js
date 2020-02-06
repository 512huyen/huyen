import React from 'react';
import './index.scss';
function Search({ tpl }) {
    return (
        <div className="header-search">
            {tpl ? tpl : <div></div>}
        </div>
    );
}

export default Search;
