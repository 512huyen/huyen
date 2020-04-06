const reducer = (state = {}, action) => {
	let newState = { ...state }
	switch (action.type) {
		case 'USERS-UPDATE-DATA':
			newState = { ...state, ...action.data || {} }
			return newState;
		default:
			return state
	}

}
export default reducer
