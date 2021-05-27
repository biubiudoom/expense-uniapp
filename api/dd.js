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
			url:"user/getuserinfo",
			method: "get",
		}, data)
	},
}