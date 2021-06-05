import request from './request.js'
export default {
	getAccessToken(data) {
		return request.httpTokenRequest({
			url:"gettoken",
			method: "get",
		}, data)
	},
	getUserInfo(data) {
		return request.httpTokenRequest({
			url:"topapi/v2/user/getuserinfo",
			method: "post",
			data,	
		}, data)
	},
	getUser(data) {
		return request.httpTokenRequest({
			url:"topapi/v2/user/get",
			method: "post",
			data,	
		}, data)
	},
}