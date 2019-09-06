import React from 'react';
import 'react-toastify/dist/ReactToastify.css';
// import './App.css';
// import './owl.carousel.css';

import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { ToastContainer } from 'react-toastify';
import Main from './Main';

import AppReducer from './reducers';

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