import timesheetProvider from '@data-access/timesheet-provider';
import actionProject from '@actions/project';
import actionProduct from '@actions/product';
import datacacheProvider from '@data-access/datacache-provider';

function updateData(data) {
    return (dispatch) => {
        dispatch({
            type: "TIME-SHEET-UPDATE-DATA",
            data: data
        })
    };
}
const colors = [
    '#FF6384',
    '#36A2EB',
    '#FFCE56',
    '#883997',
    '#8bf6ff',
    '#4ebaaa',
    '#6effe8',
    '#63a4ff',
    '#ff5983',
    '#fa5788',
    '#39796b',
    '#ffad42',
    '#7b5e57',
    '#ffff56',
    '#484848',
    '#6ab7ff'];
export default {
    updateData,
    sumaryByYear() {
        return (dispatch, getState) => {
            dispatch(actionProject.loadListProject());
            dispatch(actionProduct.loadListProduct());
            timesheetProvider.sumaryByYear(new Date().getFullYear()).then(s => {
                let totalHourYear = 0;
                s.data.forEach(item => {
                    totalHourYear += item.time;
                })
                let totalHourYear2 = totalHourYear / 1000;
                let hour = totalHourYear2 / 60 / 60;
                let minute = (totalHourYear2 % 3600) / 60;
                dispatch(updateData({
                    totalProjectYear: s.data.length,
                    totalHourYear: (parseInt(hour)) + " giờ, " + minute + " phút",
                    sumaryByYear: {
                        labels: s.data.map(item => {
                            let projectName = item.projectId + "-" + item.productId;
                            let project = (getState().project.projects || []).find(item2 => item2.id == item.projectId);
                            let product = (getState().product.products || []).find(item2 => item2.id == item.productId);
                            if (project)
                                projectName = project.name;
                            if (product) {
                                if (projectName) {
                                    projectName += "-" + product.name;
                                }
                            }
                            return projectName;
                        }),
                        datasets: [{
                            data: s.data.map(item => {
                                return parseInt(item.time * 100 / totalHourYear);
                            }),
                            backgroundColor: s.data.map((item, index) => {
                                return colors[index];
                            }),
                            hoverBackgroundColor: s.data.map((item, index) => {
                                return colors[index];
                            }),
                        }]
                    }
                }))
            })
        }
    },
    sumaryByMonth() {
        return (dispatch, getState) => {
            dispatch(actionProject.loadListProject());
            dispatch(actionProduct.loadListProduct());
            timesheetProvider.sumaryByMonth(new Date()).then(s => {
                let totalHourMonth = 0;
                s.data.forEach(item => {
                    totalHourMonth += item.time;
                })
                let totalHourMonth2 = totalHourMonth / 1000;
                let hour = totalHourMonth2 / 60 / 60;
                let minute = (totalHourMonth2 % 3600) / 60;

                dispatch(updateData({
                    totalProjectMonth: s.data.length,
                    totalHourMonth: (parseInt(hour)) + " giờ, " + minute + " phút",
                    sumaryByMonth: {
                        labels: s.data.map(item => {
                            let projectName = item.projectId + "-" + item.productId;
                            let project = (getState().project.projects || []).find(item2 => item2.id == item.projectId);
                            let product = (getState().product.products || []).find(item2 => item2.id == item.productId);
                            if (project)
                                projectName = project.name;
                            if (product) {
                                if (projectName) {
                                    projectName += "-" + product.name;
                                }
                            }
                            return projectName;
                        }),
                        datasets: [{
                            data: s.data.map(item => {
                                return parseInt(item.time * 100 / totalHourMonth);
                            }),
                            backgroundColor: s.data.map((item, index) => {
                                return colors[index];
                            }),
                            hoverBackgroundColor: s.data.map((item, index) => {
                                return colors[index];
                            }),
                        }]
                    }
                }))
            })
        }
    }
}