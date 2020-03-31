import { combineReducers } from 'redux'
import auth from './auth'
import createTimeSheet from './timesheet/create'
import timesheet from './timesheet'
import homeTimeSheet from './timesheet/home'
import product from './product'
import project from './project'
import job from './job'

export default combineReducers({
	auth,
	createTimeSheet,
	timesheet,
	homeTimeSheet,
	product,
	project,
	job
})