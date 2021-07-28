import app from '../main.js'
// let baseUrl,version,deviceType
// setTimeout(()=>{
// 	baseUrl = app.$baseUrl
// 	version = app.$version
// 	deviceType = app.$deviceType
// },10)
let ddPath = "https://oapi.dingtalk.com/"
// let njpPath = "http://market.chinajack.com/TravelExpense/requestRelay.php"
// let ddPath = "/dd/"
// let njpPath = "/njp/"

const httpNJPRequest = (opts, data) => {
	let httpDefaultOpts = {
		url: njpPath + opts.url,
		data: data,
		method: opts.method,
		header: opts.method == 'get' ? {
			// 'X-Requested-With': 'XMLHttpRequest',
			// "Accept": "application/json",
			// "Content-Type": opts.contentType?opts.contentType:"application/json; charset=UTF-8",
		} : {
			'X-Requested-With': 'XMLHttpRequest',
			"Content-Type": opts.contentType?opts.contentType:"application/x-www-form-urlencoded; charset=UTF-8",
		},
	}
	let promise = new Promise(function(resolve, reject) {
		uni.request(httpDefaultOpts).then(
			(res) => {
				resolve(res[1].data)
			}
		).catch(
			(response) => {
				uni.showToast({
					icon: 'none',
					position: 'top',
					title: '网络异常，请检查网络设置',
					duration: 2000
				});
				reject(response)
			}
		)
	})
	return promise
};

const httpTokenRequest = (opts, data) => {
	// let loginCode = uni.getStorageSync('code')
	// //此token是登录成功后后台返回保存在storage中的
	// if(!loginCode){
	// 	uni.showToast({
	// 		position:'top',
	// 		title:'认证失效，请重新登陆',
	// 		icon:'none'
	// 	})
	// 	setTimeout(()=>{
	// 	 uni.reLaunch({
	// 		url:'/pages/index/index'
	// 	 })
	//  },1000)
	// }
	
	let httpDefaultOpts = {
		url:  "requestRelay.php",
		data: data,
		method: opts.method,
		header: opts.method == 'get' ? {
			'X-Requested-With': 'XMLHttpRequest',
			"Accept": "application/json",
			"Content-Type": opts.contentType?opts.contentType:"application/json; charset=UTF-8",
		} : {
			'X-Requested-With': 'XMLHttpRequest',
			"Content-Type": opts.contentType?opts.contentType:"application/x-www-form-urlencoded; charset=UTF-8",
		},
		dataType: 'json',
	}
	let promise = new Promise(function(resolve, reject) {
		uni.request(httpDefaultOpts)
		.then(
		(res) => {
			resolve(res[1].data)
		})
		.catch(
			(response) => {
				uni.showToast({
					icon: 'none',
					position: 'top',
					title: '网络异常，请检查网络设置',
					duration: 2000
				});
				reject(response)
			}
		)
	})
	return promise
};

export default {
	// baseUrl,
	// httpRequest,
	httpNJPRequest,
	httpTokenRequest
}
