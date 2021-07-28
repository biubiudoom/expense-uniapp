import request from './request.js'
export default {
	getSid(data) {
		return request.httpNJPRequest({
			url: "njp-app-web/rest/BPMSessionID/getBPMsidByWebService",
			method: "post",
		}, data)
	},
}