<template>
</template>

<script>
	const language = 'zh_CN';
	const corpId = 'dingb832549ed9dd356e';
	const appKey = 'dingoxxhf0i9es6aqm1c';
	const appSecret = 'csCvcPk8P4wFzpWAXBY5fkim0gAae3ouqf_ZTlgVTWn8fKn3oA9SETKgMaYuKn97';
	const commonUrl = 'requestRelay.php';
	const njpUrl = 'http://61.153.192.94:8065/njp-app-web/rest/BPMSessionID/getBPMsidByWebService'
	const bpmUrl = "http://61.153.192.93/workflow/mobile.wf"	
	// const bpmUrl =  "http://60.12.171.212:8086/workflow/mobile.wf"
	const upFileUrl = "http://61.153.192.93/workflow/upfile.wf"
	// const bpmUrl = "/bpm/workflow/login.wf"
	// const upFileUrl = "/bpm/workflow/upfile.wf"
	const CMDList = {
		getDefaultValue: 'JACK_APP_MOBILE_WSBX_DEFAULTVALUE_GET', // 获取员工信息默认值
		getCompanyList: 'JACK_APP_MOBILE_WSBX_GET_GSDM', // 获取公司列表
		getTypeList: 'JACK_APP_MOBILE_WSBX_GET_JSFS', // 获取结算方式列表
		getTaxiList: 'JACK_APP_MOBILE_WORKFLOW_CLBXD_CZCBZLST', // 获取出租车标准列表
		getStayList: 'JACK_APP_MOBILE_WORKFLOW_CLBXD_ZSBZLST', // 获取住宿标准列表
		getCaterList: 'JACK_APP_MOBILE_WORKFLOW_CLBXD_CYBZLST', // 获取餐饮标准列表
		getDepartList: 'JACK_APP_MOBILE_WSBX_YWBM_GET', // 获取业务部门列表
		getSubjectList: 'JACK_APP_MOBILE_WSBX_GET_YSKMLST', // 获取预算科目列表 
		getPayInfo: 'JACK_APP_MOBILE_WSBX_GET_PAYEEINFO', // 获取收款信息
		getPayeeList: 'JACK_APP_MOBILE_WSBX_GET_SKXXLST', // 获取收款信息可选项列表
		getPublicList: 'JACK_APP_MOBILE_GCLC', // 获取公出单列表
		postLoanBill: 'JACK_APP_MOBILE_WORKFLOW_FI_JKD', // 发送借款单信息
		postExpenseBill: 'JACK_APP_MOBILE_WORKFLOW_FI_YWSQBXD', // 发送费用报销单信息
		postServeBill: 'JACK_APP_MOBILE_WORKFLOW_FI_ZDF', // 发送招待费报销单信息
		postTravelBill: 'JACK_APP_MOBILE_WORKFLOW_FI_CLBXD', // 发送差旅报销单消息
		checkBudget: 'JACK_FIM_WSBX_YSPD_LX', // 检查预算金额是否超标
		getBill: 'JACK_APP_MOBILE_BILL_GET' , // 从票夹导入发票
		recongnizeOCR: 'JACK_APP_MOBILE_OCR_RECONGNIZE' // 图像识别
	}
	const BOList = {
		postExpenseBill: 'BO_JACK_WSBX_YWSQBXD_M', // 费用报销单报表
		postServeBill: 'BO_JACK_WSBX_ZDFBXD_M' // 招待费报销单报表
	}
	export default {
		corpId,
		appKey,
		appSecret,
		commonUrl,
		njpUrl,
		bpmUrl,
		upFileUrl,
		CMDList,
		BOList
	}
</script>

<style>
</style>
