<template>
	<view>
		<scroll-view scroll-y="true" style="height: 1100rpx;">
			<u-form :model="form" ref="basicForm" label-width="200" label-align="center" :border-bottom="false">
				<u-form-item label="申请人" class="form-item">
					<u-input v-model="form.SKR" placeholder="请输入申请人姓名" type="text" height="40" :disabled="true"/>
				</u-form-item>
				<u-form-item label="归属公司" class="form-item">
					<u-select v-model="companyShow" mode="single-column" :list="companyList"
						@confirm="confirm('GSGS', $event)" value-name="gs" label-name="mc">
					</u-select>
					<u-input v-model="GSGS" type="select" @click="companyShow = true" />
				</u-form-item>
				<u-form-item label="业务部门" class="form-item">
					<lv-select @handleSearch="handleSearch('depart')" @input="change('depart', $event)" :infoList="departList"
						:showValue="showValue" v-model="searchValue" :loading="loading" type="primary" :uniShadow="true" >
					</lv-select>
				</u-form-item>
				<u-form-item label="预算科目" class="form-item" v-if="!loan">
					<lv-select @handleSearch="handleSearch('subject')" @input="change('subject', $event)" :infoList="subjectList"
						:showValue="showValue2"  v-model="form.YSKM" :loading="loading" type="primary" :uniShadow="true">
					</lv-select>
				</u-form-item>	
				<u-form-item label="业务说明" class="form-item">
					<u-input v-model="form.YWSM" placeholder="请输入业务说明" type="text" border="border" height="60" />
				</u-form-item>
				<u-form-item label="结算方式" class="form-item">
					<u-select v-model="typeShow"  mode="single-column" :list="typeList"
						@confirm="confirm('JSFS', $event)" value-name="gs" label-name="mc">
					</u-select>
					<u-input v-model="form.JSFS" type="select" @click="typeShow = true" />
				</u-form-item>
				<u-form-item label="业务类型" class="form-item" v-if="loan">
					<u-select v-model="businessShow"  mode="single-column" :list="businessList"
					 @confirm="confirm('YWLX', $event)">
					</u-select>
					<u-input v-model="form.YWLX" type="select" @click="businessShow = true"/>
				</u-form-item>
				<u-form-item v-if="travel">
					<uni-table border emptyText="请添加住宿记录">
						<uni-tr>
							<uni-th width="140" align="center">住宿标准</uni-th>
							<uni-th width="60" align="center">住宿天数</uni-th>
						</uni-tr>
						<uni-tr v-for="(item, index) in stayData">
							<uni-td>
								<picker mode="selector" :value="item.stayIndex" :range="stayList" 
										range-key="ZSF" @change="stayPickerChange($event, index)">
									<view>{{stayList[item.stayIndex].ZSF}}</view>
								</picker>
							</uni-td>
							<uni-td>
								<u-input placeholder="天数" type="number" @blur="stayInputChange($event, index)"></u-input>
							</uni-td>
						</uni-tr>
						<button class="uni-button" size="mini" type="primary" @click="stayPush">添加</button>
						<button style="margin-left: 10%;" class="uni-button" size="mini" type="warn" @click="delStayData">删除</button>
					</uni-table>
				</u-form-item>
				<u-form-item v-if="travel">
					<uni-table border emptyText="请添加餐饮记录">
						<uni-tr>
							<uni-th width="140" align="center">餐饮标准</uni-th>
							<uni-th width="60" align="center">餐饮天数</uni-th>
						</uni-tr>
						<uni-tr v-for="(item, index) in caterData">
							<uni-td>
								<picker mode="selector" :value="item.caterIndex" :range="caterList"
										range-key="CYF" @change="caterPickerChange($event, index)">
									<view>{{caterList[item.caterIndex].CYF}}</view>
								</picker>
							</uni-td>
							<uni-td>
								<u-input placeholder="天数" type="number" @blur="caterInputChange($event, index)"></u-input>
							</uni-td>
						</uni-tr>
						<button class="uni-button" size="mini" type="primary" @click="caterPush">添加</button>
						<button style="margin-left: 10%;" class="uni-button" size="mini" type="warn" @click="delCaterData">删除</button>
					</uni-table>
				</u-form-item>
				<u-form-item label="出租车标准" class="form-item" v-if="travel">
					<u-select v-model="taxiShow"  mode="single-column" :list="taxiList" 
					@confirm="confirm('CZCBZ', $event)" label-name="CZCF">
					</u-select>
					<u-input v-model="form.CZCBZ" placeholder="请选择出租车标准" type="select" @click="taxiShow = true" />
				</u-form-item>
				<u-form-item label="出租车天数" class="form-item" v-if="travel">
					<u-input v-model="form.CZCTS" placeholder="出租车天数" type="number" border="border" height="40" />
				</u-form-item>
				<u-form-item label="借款金额" prop="price" class="form-item" v-if="loan">
					<u-input v-model="form.JKJE" placeholder="请输入金额" type="text" border="border" height="60" />
				</u-form-item>
				<u-form-item label="是否关联公出单" prop="price" class="form-item" v-if="travel">
					<radio-group @change="radioChange">
						<label>
							<radio value="true" /><text>是</text>
						</label>
						<label style="margin-left: 20rpx;">
							<radio value="false" /><text>否</text>
						</label>
						<label style="margin-left: 20rpx;">
							<radio value="" /><text>不报销汽油费</text>
						</label>
					</radio-group>
				</u-form-item>
				<u-form-item label="公出单" class="form-item" v-show="'true' == public">
					<lv-select @handleSearch="handleSearch('public')" @input="change('public', $event)" @change="getPublic" :infoList="publicList"
						:showValue="showValue3"  v-model="form.GCD" :loading="loading" type="primary" :uniShadow="true">
					</lv-select>
				</u-form-item>	
				<u-form-item label="出发里程数" class="form-item" v-show="'false' == public">
					<u-input v-model="form.startMileage" placeholder="请输入出发里程数" type="number" border="border" height="40" />
				</u-form-item>
				<u-form-item label="返回里程数" class="form-item" v-show="'false' == public">
					<u-input v-model="form.endMileage" placeholder="请输入返回里程数" type="number" border="border" height="40" />
				</u-form-item>
				<u-form-item label="汽油费总额" class="form-item" v-if="travel">
					<u-input v-model="form.QYFFY" placeholder=" " type="text" :disabled="true" height="40" />
				</u-form-item>
				<u-form-item label="里程数照片" v-show="'false' == public">
					<u-upload ref="upload" height="160" :auto-upload="false" max-count="2" @on-list-change="onChoose"></u-upload>
				</u-form-item>
			</u-form>
		</scroll-view>
	</view>																	
</template>

<script>
	import lvSelect from '../../components/lv-select/lv-select'
	export default {
		props: ['travel', 'loan', 'expense', 'serve'],
		components: {
			lvSelect
		}, 
		data() {
			return {
				form: {
					SKR: '',  //收款人
					GSGS: '',  //归属公司
					SQRBMID: '', //申请人部门ID
					BMMC: '',  //部门名称
					YSKM: '',  //预算科目
					JSFS: '', //结算方式
					YWBM: '', //业务部门
					YWBMID: '',  //业务部门ID
					JKJE: '',	 // 借款金额
					YWSM: '',  //业务说明
					YWLX: '',  //业务类型
					CZCTS: '',  //出差天数
					ZSBZ: [],  //住宿标准
					ZSTS: [],  //住宿天数
					CYBZ: [],  //餐饮标准
					CCTSCS: [], // 餐数
					CZCBZ: '', // 出租车标准
					QYFBZ: '', // 汽油费标准
					QYFFY: 0, // 汽油费费用
					PL: '', // 汽车排量
					startMileage: '',
					endMileage:'',
					GCD: '',
					PCLX: ''
				},
				businessList :[
					{
						label: "出差人民币借款"
					},
					{
						label: "出差外币借款"
					},
					{
						label: "私人借款"
					},
					{
						label: "出差国外人民币借款"
					},
					{
						label: "购房借款"
					}
				],
				typeList: [], // 结算方式列表
				stayList: [], // 住宿标准列表
				taxiList: [], // 出租车标准列表
				caterList: [], // 餐饮标准列表
				departList: [],  // 业务部门列表	
				subjectList: [], // 预算科目列表
				companyList: [], // 归属公司列表
				publicList: [], //公出单列表
				stayData: [],
				caterData: [],
				sid: '',
				GSGS: "", // 归属公司
				JSFS: "",  // 结算方式
				typeShow: false, 
				stayShow: false,
				taxiShow: false,
				caterShow: false,
				companyShow: false,
				businessShow: false,
				startMileage: '',
				endMileage: '',
				showValue: '', 
				showValue2: '', 
				showValue3: '', 
				searchValue: '',
				searchValue2: '',
				loading: false,
				public: '',
			}
		},
		
	
		watch: {
			// 每次修改基础信息后传递数据到其他组件
			// 这里监听还可以优化
			form: {
				handler(newValue, oldValue) {
					this.$emit('basicInfo', newValue)
					this.$emit('totalCount')
					if (newValue.CCTSCS && newValue.CYBZ) {
						let caterCost = 0
						for (let i in newValue.CYBZ) {
							if (newValue.CCTSCS[i]) {
								caterCost += newValue.CYBZ[i].split('-')[2] * newValue.CCTSCS[i]
							}
						}
						this.$emit('caterCost', caterCost)
					}
					if (newValue.QYFFY) {
						this.$emit('gasCost', newValue.QYFFY)
					}
					if (newValue.endMileage - newValue.startMileage > 0) {
						this.form.QYFFY = parseFloat((newValue.endMileage - newValue.startMileage) * this.form.QYFBZ).toFixed(2)
					}
				},
				deep: true
			},
			
		
		},
		
		mounted() {
			// 获取缓存的sid
			this.sid = uni.getStorageSync('sid')
			uni.showLoading({
				title:'加载中'
			})
			this.getCompanyList()
		}, 
		
		methods: {
			// 获取公司列表
			getCompanyList() {
				uni.request({
					url: this.$Common.commonUrl,
					method: 'POST',
					header: {
						'Content-Type': "application/x-www-form-urlencoded"
					},
					data:{
						url: this.$Common.bpmUrl,
						sid: this.sid,
						cmd: this.$Common.CMDList.getCompanyList
					},
					success:(res) =>{
						this.companyList = res.data.jsonData
						this.getBasicInfo()
					}
				})
			},
			
			// 获取基础信息默认值
			getBasicInfo() {
				uni.request({
					url: this.$Common.commonUrl,
					method: 'POST',
					header: {
						'Content-Type': "application/x-www-form-urlencoded"
					},
					data:{
						url: this.$Common.bpmUrl,
						sid: this.sid,
						cmd: this.$Common.CMDList.getDefaultValue
					},
					success:(res) =>{
						let data = res.data.jsonData[0]
						for (let i in data) {
							this.form[i] = data[i]
						}
						this.searchValue = this.form.YWBM
						if(this.serve) {
							this.form.YSKM = data.ZDF
						}
						if(this.travel) {
							this.form.YSKM = data.CLF
						}
						uni.setStorageSync('GSGS', this.form.GSGS)
						this.form.YWLX = "出差人民币借款"
						for (let i in this.companyList) {
							if (this.form.GSGS == this.companyList[i].gs) {
								this.GSGS = this.companyList[i].mc
								break;
							}
						}
						this.getPaymentList()
						this.getStayList()
						this.getCaterList()
						this.getTaxiList()
					}
				})
			},
			
			
			// 获取结算方式列表
			getPaymentList() {
				uni.request({
					url: this.$Common.commonUrl,
					method: 'POST',
					header: {
						'Content-Type': "application/x-www-form-urlencoded"
					},
					data:{
						url: this.$Common.bpmUrl,
						sid: this.sid,
						cmd: this.$Common.CMDList.getTypeList,
						GSDM: this.form.GSGS
					},
					success:(res) =>{
						this.typeList= res.data.jsonData
					}
				})
			},
			
			getStayList() {
				uni.request({
					url: this.$Common.commonUrl,
					method: 'POST',
					header: {
						'Content-Type': "application/x-www-form-urlencoded"
					},
					data:{
						url: this.$Common.bpmUrl,
						sid: this.sid,
						cmd: this.$Common.CMDList.getStayList,
						GSGS: this.form.GSGS
					},
					success:(res) =>{
						this.stayList= res.data
					}
				})
			},
			
			getCaterList() {
				uni.request({
					url: this.$Common.commonUrl,
					method: 'POST',
					header: {
						'Content-Type': "application/x-www-form-urlencoded"
					},
					data:{
						url: this.$Common.bpmUrl,
						sid: this.sid,
						cmd: this.$Common.CMDList.getCaterList,
						GSGS: this.form.GSGS
					},
					success:(res) =>{
						this.caterList = res.data
					}
				})
			},
			
			getTaxiList() {
				uni.request({
					url: this.$Common.commonUrl,
					method: 'POST',
					header: {
						'Content-Type': "application/x-www-form-urlencoded"
					},
					data:{
						url: this.$Common.bpmUrl,
						sid: this.sid,
						cmd: this.$Common.CMDList.getTaxiList,
						GSGS: this.form.GSGS
					},
					success:(res) =>{
						this.taxiList = res.data
						uni.hideLoading()
					}
				})
			},
			
			  confirm(select, e) {
				if ('GSGS' == select) {
					this.GSGS = e[0].label
					this.form.GSGS = e[0].value
				} else {
					this.form[select] = e[0].label
				}
			},
			
			// 根据输入值搜索对应部门/科目
			handleSearch(type) {
				this.loading = true;
				if ('depart' == type) {
					uni.request({
						url: this.$Common.commonUrl,
						method: 'POST',
						header: {
							'Content-Type': "application/x-www-form-urlencoded"
						},
						data:{
							url: this.$Common.bpmUrl,
							sid: this.sid,
							cmd: this.$Common.CMDList.getDepartList,
							YWBMMC : this.searchValue
						},
						success:(res) =>{
							this.loading = false;
							this.departList = res.data.jsonData;
						}
					})
				} else if ('subject' == type) {
					uni.request({
						url: this.$Common.commonUrl,
						method: 'POST',
						header: {
							'Content-Type': "application/x-www-form-urlencoded"
						},
						data:{
							url: this.$Common.bpmUrl,
							sid: this.sid,
							cmd: this.$Common.CMDList.getSubjectList,
							YSKM : this.form.YSKM,
							YWBMID: this.form.SQRBMID
						},
						success:(res) =>{
							this.loading = false;
							this.subjectList = res.data.jsonData;
						}
					})
				 } else if ('public' == type) {
					 uni.request({
					 	url: this.$Common.commonUrl,
					 	method: 'POST',
					 	header: {
					 		'Content-Type': "application/x-www-form-urlencoded"
					 	},
					 	data:{
					 		url: this.$Common.bpmUrl,
							sid: this.sid,
							cmd: this.$Common.CMDList.getPublicList,
						},
						success: (res) => {
							this.loading = false;
							this.publicList = res.data
						}
					 })
				 }
			},
			
			stayPush() {
				let stay = {
					stayIndex: 1
				}
				this.stayData.push(stay)
				this.form.ZSBZ.push(this.stayList[1].ZSF)
			},
			
			delStayData() {
				this.stayData.pop()
				this.form.ZSBZ.pop()
				this.form.ZSTS.pop()
			},
			
			delCaterData() {
				this.caterData.pop()
				this.form.CYBZ.pop()
				this.form.CCTSCS.pop()
			},
			
			caterPush() {
				let cater = {
					caterIndex: 0
				}
				this.caterData.push(cater)
				this.form.CYBZ.push(this.caterList[0].CYF)
			},
			
			onChoose(lists, name) {
				let photoList = []
				for(let i in lists) {
					photoList.push(lists[i].url)
				}
				this.$emit('photoList', photoList)
			},
			
			change(type, e) {
				if ('depart' == type) {
					this.form.YWBM = e
					for (let i in this.departList) {
						if (e == this.departList[i].dname1) {
							this.form.YWBMID = this.departList[i].ID
							break;
						}
					}
				} else if ('subject' == type) {
					this.form.YSKM = e
				} 
			},
			
			radioChange(e) {
				this.public = e.detail.value
				this.form.QYFFY = 0
				this.form.startMileage = ''
				this.form.endMileage = ''
				this.form.GCD = ''
			},
			
			stayPickerChange(e, index) {
				this.stayData[index].stayIndex = e.target.value
				this.$set(this.form.ZSBZ, index, this.stayList[e.target.value].ZSF)
			},
			
			stayInputChange(e, index) {
				this.$set(this.form.ZSTS, index, e)
			},
			
			caterPickerChange(e, index) {
				this.caterData[index].caterIndex = e.target.value
				this.$set(this.form.CYBZ, index, this.caterList[e.target.value].CYF)
			},
			
			caterInputChange(e, index) {
				this.$set(this.form.CCTSCS, index, e)
			},
			
			getPublic(data) {
				this.form.PCLX = data.PCLX
				this.form.GCD = data.GCD
				if (data.GLS != '') {
					this.form.QYFFY = parseFloat(data.GLS * this.form.QYFBZ).toFixed(2)
				} else {
					this.form.QYFFY = 0
					uni.showToast({
						icon: 'error',
						duration: 3000,
						title: "该公出单没有绑定公里数，请选否手动填写公里数"
					})
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.form-item {
		height: 120rpx;
	}

	.u-input__input {
		height: 60rpx;
	}
</style>
