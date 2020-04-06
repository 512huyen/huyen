const reducer = (state = {}, action) => {
	let newState = { ...state }
	switch (action.type) {
		case 'FORMS-UPDATE-DATA':
			newState = { ...state, ...action.data || {} }
			return newState;
		default:
			return state
	}

}
export default reducer
