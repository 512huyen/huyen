import React from 'react';
import 'react-toastify/dist/ReactToastify.css';

import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { ToastContainer } from 'react-toastify';
import Main from './Main';
import { absoluteUrl, replaceSpaces, replaceAllText, formatPrice, changeNameFile, getNameById, readPrice } from './utils/string-utils';
import stringUtils from 'mainam-react-native-string-utils';
import AppReducer from './reducers';
String.prototype.uintTextBox = function () {
  var re = /^\d*$/;
  return re.test(this);
}

const store = createStore(AppReducer, applyMiddleware(thunk));

const Kernel = () => (
  <div>
    <ToastContainer autoClose={3000} />
    <Provider store={store}>
      <Main />
    </Provider>
  </div>
)
export default Kernel;