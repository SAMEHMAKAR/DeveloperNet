import {
	GET_PROFILE,
	PROFILE_ERROR,
	CLEAR_PROFILE,
	UPDATE_PROFILE,
	GET_PROFILES,
	GET_REPOS
} from '../actions/types';

const initialState = {
	profile: null,
	profilepicture: [],
	profiles: [],
	repos: [],
	loading: true,
	error: {},
	shippingAddress: "",
	address: ""
};

export default function (state = initialState, action) {
	const { type, payload } = action;

	switch (type) {
		case GET_PROFILE:
		case UPDATE_PROFILE:
			return {
				...state,
				profile: payload,
				loading: false
			};
		case "UPDATE_PROFILE_PICTURE":
			return {
				...state,
				profilepicture: payload,
				loading: false
			};
		case GET_PROFILES:
			return {
				...state,
				profiles: payload,
				loading: false
			};
		case "CART_SAVE_SHIPPING_ADDRESS":
			return {
				...state,
				shippingAddress: action.payload,
				loading: false
			};
		case "USER_ADDRESS_MAP_CONFIRM":
			return {
				...state,
				address: action.payload,
				loading: false
			};


		case PROFILE_ERROR:
			return {
				...state,
				error: payload,
				loading: false,
				profile: null
			};
		case CLEAR_PROFILE:
			return {
				...state,
				profile: null,
				repos: [],
				loading: false
			};
		case GET_REPOS:
			return {
				...state,
				repos: payload,
				loading: false
			};
		default:
			return state;
	}
}
