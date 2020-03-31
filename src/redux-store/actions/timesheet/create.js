import projectProvider from '@data-access/project-provider';
import productProvider from '@data-access/product-provider';
import jobProvider from '@data-access/job-provider';
import fileProvider from '@data-access/file-provider';

import timesheetProvider from '@data-access/timesheet-provider';
import { ToastContainer, toast } from 'react-toastify';
import constants from '@strings';
import snackbar from '../../../utils/snackbar-utils';
import stringUtils from 'mainam-react-native-string-utils';
import moment from 'moment';

function updateData(data) {
	return (dispatch) => {
		dispatch({
			type: "CREATE-TIME-SHEET-UPDATE-DATA",
			data: data
		})
	};
}


function createOrEdit(date, startTime, endTime, projectId, productId, jobId, description, tickets, attachments, spec) {
	return (dispatch, getState) => {
		return new Promise((resolve, reject) => {
			let id = getState().createTimeSheet.id;
			timesheetProvider.createOrEdit(id, date._d.format("yyyy/MM/dd"), startTime._d.format("yyyy/MM/dd HH:mm") + ":00", endTime._d.format("yyyy/MM/dd HH:mm") + ":00", projectId, productId, jobId, description, tickets, attachments, spec).then(s => {
				switch (s.code) {
					case 0:
						dispatch(updateData({
							description: "",
							tickets: [],
							date: null,
							startTime: null,
							endTime: null
						}))
						if (!id) {
							dispatch(changeDate(moment(date)));
							snackbar.show("Thêm thành công", "success");
						} else {
							dispatch(search());
							snackbar.show("Cập nhật thành công", "success");
						}
						resolve(s.data);
						break;
					default:
						if (!id) {
							snackbar.show(s.message || "Thêm không thành công", "danger");
						} else {
							snackbar.show(s.message || "Sửa không thành công", "danger");
						}
						reject();
				}
			}).catch(e => {
				if (!id) {
					snackbar.show("Thêm không thành công", "danger");
				} else {
					snackbar.show("Sửa không thành công", "danger");
				}
				reject();
			})
		});
	}
}

function search() {
	return ((dispatch, getState) => {
		let size = 100;
		let page = getState().createTimeSheet.page || 1;
		let date = getState().createTimeSheet.dateFilter || moment(new Date());
		let userId = getState().auth.auth.employees.id;
		timesheetProvider.search(page, size, userId, date._d).then(s => {
			dispatch(
				updateData({
					total: s.data.total || size,
					data: s.data.data || []
				})
			)
		})
	})
}

function deleteItem(item) {
	return ((dispatch, getState) => {
		return new Promise((resolve, reject) => {
			timesheetProvider.delete(item.id).then(s => {
				if (s.code == 0) {
					snackbar.show("Xóa thành công", "success");
					let data = getState().createTimeSheet.data || [];
					let index = data.findIndex(x => x.id == item.id);
					if (index != -1);
					data.splice(index, 1);
					dispatch(updateData({
						data: [...data]
					}));
					resolve();
				} else {
					snackbar.show("Xóa không thành công", "danger");
					reject();
				}
			}).catch(e => {
				snackbar.show("Xóa không thành công", "danger");
				reject();
			})
		})
	});
}
function changeDate(date) {
	return ((dispatch, getState) => {
		let _predate = new Date();
		_predate.setDate(_predate.getDate() - 10);
		dispatch(updateData({
			dateFilter: date,
			date: date && _predate <= date._d ? moment(date) : null,
			data: [],
			total: 0,
			page: 1
		}));
		dispatch(search());
	});
}


function removeAttachment(file) {
	return ((dispatch, getState) => {
		try {
			let attachments = getState().createTimeSheet.attachments || [];
			dispatch(updateData({
				attachments: attachments.filter(item => item.uid != file.uid)
			}))
		} catch (error) {
		}
	});
}

function uploadFile(file) {
	return (dispatch, getState) => {
		dispatch(updateData({
			attachments: [...(getState().createTimeSheet.attachments || []), {
				uid: file.uid,
				name: file.name,
				uploading: true
			}]
		}))
		return new Promise((resolve, reject) => {
			fileProvider.upload(file).then(s => {
				let state = getState();
				let attachments = state.createTimeSheet.attachments || [];
				let file = attachments.find(item => item.uid == s.file.uid);
				if (file) {
					file.uploading = false;
				}

				if (s && s.code == 0) {
					file.url = s.data[0];
					file.status = "done";
					dispatch(updateData({
						attachments: [...attachments]
					}))
					resolve(s);
				} else {
					file.error = true;
					dispatch(updateData({
						attachments: [...attachments]
					}))
					reject(s)
				}
			}).catch(e => {
				let state = getState();
				let attachments = state.createTimeSheet.attachments || [];
				let file2 = attachments.find(item => item.uid == file.uid);
				if (file2) {
					file2.uploading = false;
					file2.error = true;
				}
				dispatch(updateData({
					attachments: [...attachments]
				}))
				reject(e)
			})
		});
	}
}

function changePage(page) {
	return (dispatch, getState) => {
		dispatch(updateData({
			page: page,
		}));
		dispatch(search());
	}
}

export default {
	createOrEdit,
	updateData,
	search,
	changePage,
	changeDate,
	deleteItem,
	uploadFile,
	removeAttachment
}