<template>
	<view>
		<u-form :model="form" ref="basicForm" label-width="200" label-align="center" :border-bottom="false">
			<u-form-item label="申请人" prop="name" class="form-item">
				<u-input v-model="form.name" placeholder="请输入申请人姓名" type="text" border="border" height="40" />
			</u-form-item>
			<u-form-item label="归属公司" prop="company" class="form-item">
				<u-select v-model="companyShow" :default-value="companyDefault" mode="single-column" :list="companyList"
					@confirm="confirm('company', $event)">
				</u-select>
				<u-input v-model="companyLabel" type="select" @click="companyShow = true" />
			</u-form-item>
			<u-form-item label="业务部门" prop="depart" class="form-item">
				<!-- <u-select v-model="departShow" :default-value="departDefault" mode="single-column" :list="departList" @confirm="confirm('depart', $event)">
				</u-select>
				<u-input  v-model="departLabel" type="select" @click="departShow = true" /> -->
				<lv-select @handleSearch="handleSearch" @change="change" :infoList="infoList"
					:showValue="showValue" v-model="searchValue" :loading="loading" type="primary" :uniShadow="true" >
				</lv-select>
			</u-form-item>
			<u-form-item label="预算科目" prop="subject" class="form-item" v-if="!loan">
				<u-input v-model="form.subject" placeholder="请输入预算科目" type="text" border="border" height="40" />
			</u-form-item>
			<u-form-item label="业务说明" prop="descrp" class="form-item">
				<u-input v-model="form.descrp" placeholder="请输入业务说明" type="text" border="border" height="40" />
			</u-form-item>
			<u-form-item label="结算方式" prop="type" class="form-item">
				<u-select v-model="typeShow" :default-value="typeDefault" mode="single-column" :list="typeList"
					@confirm="confirm('type', $event)">
				</u-select>
				<u-input v-model="typeLabel" type="select" @click="typeShow = true" />
			</u-form-item>
			<u-form-item label="出差天数" prop="days" class="form-item" v-if="travel">
				<u-input v-model="form.days" placeholder="请输入出差天数" type="text" border="border" height="40" />
			</u-form-item>
			<u-form-item label="金额" prop="number" class="form-item" v-if="!travel">
				<u-input v-model="form.number" placeholder="请输入金额" type="text" border="border" height="40" />
			</u-form-item>
			<u-form-item label="研发订单" prop="order" class="form-item" v-if="!loan">
				<u-input v-model="form.order" placeholder="请输入订单号" type="text" border="border" height="40" />
			</u-form-item>
		</u-form>
	</view>
</template>

<script>
	import lvSelect from '../../components/lv-select/lv-select'
	export default {
		props: ['form', 'travel', 'loan'],
		components: {
			lvSelect
		},
		data() {
			return {
				companyList: [{
						value: '0',
						label: '公司一号'
					},
					{
						value: '1',
						label: '公司二号'
					},
				],
				companyLabel: "公司一号",
				companyShow: false,
				// departList: [{
				// 		value: '0',
				// 		label: '部门一号'	
				// 	},
				// 	{
				// 		value: '1',
				// 		label: '部门二号'
				// 	},
				// ],
				// departLabel: "部门一号",
				// departShow: false,
				typeList: [{
						value: '0',
						label: '方式一'
					},
					{
						value: '1',
						label: '方式二'
					},
				],
				typeLabel: "方式一",
				typeShow: false,
				companyDefault: [0],
				// departDefault: [0],
				typeDefault: [0],
				loading: false,
				showValue: 'name',
				searchValue: '',
				infoList: [],
				infoLists: [
					{
						name: '部门一'
					},
					{
						name: '部门二'
					},
				]
			}
		},
		methods: {
			confirm(select, e) {
				this[select + 'Label'] = e[0].label;
				this.form[select] = e[0].value;
				this[select + 'Default'][0] = parseInt(e[0].value);
			},
			handleSearch() {
				this.loading = true;
				setTimeout(() => {
					this.loading = false;
					this.infoList = this.infoLists
				}, 2000)
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
