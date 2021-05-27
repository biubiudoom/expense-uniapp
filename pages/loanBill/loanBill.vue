<template>
	<view class="wrap">
		<view class="u-tabs-box">
			<u-tabs-swiper activeColor="#06A7E2" inactive-color="#000000" ref="tabs" :list="list" :current="current"
				@change="change" bar-width="100" :is-scroll="false" swiperWidth="750">
			</u-tabs-swiper>
		</view>
		<swiper class="swiper-box" :current="swiperCurrent" @transition="transition" @animationfinish="animationfinish">
			<swiper-item>
				<!-- <scroll-view scroll-y style="height: 100%; width: 100%;">
					<view class="swiper-div">
						</view>
				     </scroll-view> -->
				<view class="swiper-item">
					<basicInfo :form="form" :loan="loan"></basicInfo>
				</view>
			</swiper-item>
			<swiper-item>
				<view class="swiper-item">
					<collectionInfo :form2="form2"></collectionInfo>
				</view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	import basicInfo from '../components/basicInfo.vue'
	import collectionInfo from '../components/collectionInfo.vue'
	export default {
		components: {
			basicInfo,
			collectionInfo
		},
		data() {
			return {
				list: [{
						name: '基础信息'
					},
					{
						name: '收款信息'
					}
				],
				selectionList: [{
						value: '0',
						label: '对公'
					},
					{
						value: '1',
						label: '对私'
					},
				],
				form: {
					name: 'test',
					dapart: '公司一号',
					company: '',
					depart: '',
					subject: '',
					descrp: '',
					type: '',
					number: 0,
					order: ''
				},
				form2: {
					name: '',
					bank: '',
					account: '',
					number: 0,
					code: '',
					isCommon: ''
				},
				loan: true,
				show: false,
				current: 0,
				swiperCurrent: 0,
				selectLabel: '对公'
			}
		},
		methods: {
			// tab栏切换
			change(index) {
				this.swiperCurrent = index;
				// this.getOrderList(index);
			},
			// swiper-item左右移动，通知tabs的滑块跟随移动
			transition(e) {
				let dx = e.detail.dx;
				this.$refs.tabs.setDx(dx);
			},
			// 由于swiper的内部机制问题，快速切换swiper不会触发dx的连续变化，需要在结束时重置状态
			// swiper滑动结束，分别设置tabs和swiper的状态
			animationfinish(e) {
				let current = e.detail.current;
			  this.$refs.tabs.setFinishCurrent(current);
			  this.swiperCurrent = current;
			  this.current = current;
			  },
			confirm(e) {
				this.selectLabel = e[0].label;
				this.form2.isCommon = e[0].value;
				console.log(this.form2.isCommon);
			}
		}
	}
</script>

<style lang="scss" scoped>
	.wrap {
		width: 100%;
		height: 100%;
	}
	
	.swiper-box {
		width: 700rpx;
		background-color: #ffffff;
		margin: 20rpx auto;
		border-radius: 20rpx;
		padding: 10rpx;
		font-size: 28rpx;
		height: 90%;
	}
	
	.swiper-item {
		height: 100%;
	}
</style>
