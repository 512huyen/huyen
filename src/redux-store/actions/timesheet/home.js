import projectProvider from '@data-access/project-provider';
import productProvider from '@data-access/product-provider';
import jobProvider from '@data-access/job-provider';
import timesheetProvider from '@data-access/timesheet-provider';
import { ToastContainer, toast } from 'react-toastify';
import constants from '@strings';
import snackbar from '../../../utils/snackbar-utils';
import stringUtils from 'mainam-react-native-string-utils';
import moment from 'moment';
import actionProduct from '@actions/product';
import actionProject from '@actions/project';
import actionJob from '@actions/job';
function updateData(data) {
	return (dispatch) => {
		dispatch({
			type: "HOME-TIME-SHEET-UPDATE-DATA",
			data: data
		})
	};
}

function search() {
	return ((dispatch, getState) => {
		let size = 1000;
		let month = getState().homeTimeSheet.monthFilter || moment(new Date());
		let userId = getState().auth.auth.employees.id;
		timesheetProvider.search(1, size, userId, null, month._d).then(s => {
			dispatch(
				updateData({
					total: s.data.total || size,
					data: s.data.data || []
				})
			)
		})
	})
}

function changeMonth(date) {
	return ((dispatch, getState) => {
		dispatch(updateData({
			monthFilter: date,
			data: [],
			total: 0,
			page: 1
		}));
		dispatch(search());
	});
}

function loadData() {
	return ((dispatch, getState) => {
		dispatch(actionProduct.loadListProduct());
		dispatch(actionProduct.loadMyProduct());
		dispatch(actionJob.loadListJob());
		dispatch(actionJob.loadMyJob());
		dispatch(actionProject.loadListProject());
		dispatch(actionProject.loadMyProject());
	});
}

export default {
	changeMonth,
	search,
	updateData,
	loadData
}