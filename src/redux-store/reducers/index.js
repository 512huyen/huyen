import { combineReducers } from 'redux'
import auth from './auth'
import formTypes from './formTypes';
import forms from './forms';
import users from './users';
import patientHistories from './patientHistories';
import signPrivileges from './signPrivileges';
import signedFiles from './signedFiles';
export default combineReducers({
	auth,
	formTypes,
	forms,
	signPrivileges,
	users,
	patientHistories,
	signedFiles
})