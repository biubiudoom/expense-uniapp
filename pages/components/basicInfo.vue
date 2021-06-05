<template>
	<view>
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
			<u-form-item label="出差天数" class="form-item" v-if="travel">
				<u-input v-model="form.days" placeholder="请输入出差天数" type="text" border="border" height="40" />
			</u-form-item>
			<u-form-item label="借款金额" prop="price" class="form-item" v-if="loan">
				<u-input v-model="form.JKJE" placeholder="请输入金额" type="text" border="border" height="60" />
			</u-form-item>
			<u-form-item label="业务类型" class="form-item">
				<u-select v-model="loanShow"  mode="single-column" :list="loanList" @confirm="confirm('YWLX', $event)">
				</u-select>
				<u-input v-model="form.YWLX" type="select" @click="loanShow = true" />
			</u-form-item>
			<!-- <u-form-item label="研发订单" prop="order" class="form-item" v-if="!loan">
				<u-input v-model="form.YFORDER" placeholder="请输入订单号" type="text" border="border" height="40" />
			</u-form-item> -->
		</u-form>
	</view>
</template>

<script>
	import bpm from '@/api/bpm.js'
	import lvSelect from '../../components/lv-select/lv-select'
	export default {
		props: ['travel', 'loan',],
		components: {
			lvSelect
		}, 
		data() {
			return {
				form: {
					SKR: '',
					GSGS: '', 
					SQRBMID: '',
					BMMC: '',
					GSGS: '',
					YSKM: '',
					JSFS: '',
					YWBM: '',
					YWBMID: '',
					JKJE: '',
					YWSM: '',
					YWLX: ''
				},
				loanList :[
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
				GSGS: "",
				companyList: [],
				companyShow: false,
				typeList: [],
				JSFS: "",
				loanShow: false,
				typeShow: false,
				sid: '',
				loading: false,
				showValue: '',
				showValue2: '',
				searchValue: '',
				searchValue2: '',
				departList: [],
				subjectList: []
			}
		},
		
		watch: {
			form: {
				handler(newValue, oldValue) {
					this.$emit('basicInfo', newValue)
					console.log(newValue)
				},
				deep: true
			}
		},
		
		mounted() {
			this.sid = uni.getStorageSync('sid')
			uni.showLoading({
				title:'加载中'
			})
			this.getCompanyList()
		},
		
		methods: {
			getCompanyList() {
				uni.request({
					url: this.$Common.bpmUrl,
					data:{
						sid: this.sid,
						cmd: "JACK_APP_MOBILE_WSBX_GET_GSDM"
					},
					success:(res) =>{
						this.companyList = res.data.jsonData
						this.getBasicInfo()
					}
				})
			},
			getBasicInfo() {
				uni.request({
					url: this.$Common.bpmUrl,
					data: {
						sid: this.sid,
						cmd: "JACK_APP_MOBILE_WSBX_DEFAULTVALUE_GET"
					},
					success:(res) =>{
						this.form = res.data.jsonData[0]
						this.searchValue = this.form.YWBM
						uni.setStorageSync('GSGS', this.form.GSGS)
						this.form.YWLX = "出差人民币借款"
						for (let i in this.companyList) {
							if (this.form.GSGS == this.companyList[i].gs) {
								this.GSGS = this.companyList[i].mc
								break;
							}
						}
						this.getPaymentList()
					}
				})
			},
			
			
			// 获取结算方式列表
			getPaymentList() {
				uni.request({
					url: this.$Common.bpmUrl,
					data: {
						sid: this.sid,
						cmd: "JACK_APP_MOBILE_WSBX_GET_JSFS",
						GSDM: this.form.GSGS
					},
					success:(res) =>{
						this.typeList= res.data.jsonData
						uni.hideLoading()
					}
				})
			},
			confirm(select, e) {
				if ('GSGS' == select) {
					this.GSGS = e[0].label;
					this.form.GSGS = e[0].value;
				} else if ('JSFS' == select) {
					this.form.JSFS = e[0].label
				} else if ('YWLX' == select) {
					this.form.YWLX = e[0].label
				}
			},
			handleSearch(type) {
				this.loading = true;
				if ('depart' == type) {
					uni.request({
						url: this.$Common.bpmUrl,
						data:{
							sid: this.sid,
							cmd: "JACK_APP_MOBILE_WSBX_YWBM_GET",
							YWBMMC : this.searchValue
						},
						success:(res) =>{
							this.loading = false;
							this.departList = res.data.jsonData;
						}
					})
				} else if ('subject' == type) {
					uni.request({
						url: this.$Common.bpmUrl,
						data:{
							sid: this.sid,
							cmd: "JACK_APP_MOBILE_WSBX_GET_YSKMLST",
							YSKM : this.form.YSKM,
							YWBMID: this.form.SQRBMID
						},
						success:(res) =>{
							this.loading = false;
							this.subjectList = res.data.jsonData;
						}
					})
				}
			},
			change(type, e) {
				if ('depart' == type) {
					console.log(e)
					this.form.YWBM = e
					for (let i in this.departList) {
						if (e == this.departList[i].dname1) {
							this.form.YWBMID = this.departList[i].ID
							break;
						}
					}
				} else if ('subject' == type) {
					console.log(e)
					this.form.YSKM = e
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
