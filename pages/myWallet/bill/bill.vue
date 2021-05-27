<template>
	<view class="wrap">
		<u-search class="search" placeholder="请输入发票名称" v-model="keyword" :show-action="false" :clearabled="true"
			border-color="#06A7E2" shape="square"></u-search>
		<scroll-view scroll-y style="height: 100%;width: 100%;" @scrolltolower="reachBottom">
			<billDetail :orderList="orderList"></billDetail>
		</scroll-view>
		<u-tabbar activeColor="#06A7E2" inactive-color="#000000" @change="change" v-model="current" :list="list"
			icon-size="40"></u-tabbar>
	</view>
</template>

<script>
	import billDetail from '../../components/billDetail.vue'
	export default {
		components: {	
			billDetail
		},
		data() {
			return {
				list: [{
						iconPath: "home",
						selectedIconPath: "home-fill",
						text: '首页',
						count: 0,
						customIcon: false,
						pagePath: '/pages/myWallet/myWallet',
					},
					{
						iconPath: "file-text",
						selectedIconPath: "file-text-fill",
						text: '发票',
						count: 0,
						customIcon: false,
						pagePath: '/pages/myWallet/bill/bill',
					},
					{
						iconPath: "setting",
						selectedIconPath: "setting-fill",
						text: '应用',
						count: 0,
						customIcon: false,
						pagePath: '/pages/myWallet/function/function',
					}
				],
				orderList: [{
						purchaser: '杰克缝纫机股份有限公司',
						seller: 'XXX酒店',
						contact: '2021-5-12',
						price: '1200',
						isPurchaser: true
					},
					{
						// purchaser: '杰克缝纫机股份有限公司',
						seller: 'XXX酒店',
						contact: '2021-5-12',
						price: '1200',
						isPurchaser: false
					},
					{
						purchaser: '杰克缝纫机股份有限公司',
						seller: 'XXX酒店',
						contact: '2021-5-12',
						price: '1200',
						isPurchaser: false
					},
					{
						purchaser: '杰克缝纫机股份有限公司',
						seller: 'XXX酒店',
						contact: '2021-5-12',
						price: '1200',
						isPurchaser: false
					},
					{
						purchaser: '杰克缝纫机股份有限公司',
						seller: 'XXX酒店',
						contact: '2021-5-12',
						price: '1200',
						isPurchaser: false,
						isTrip:true
					}
				],
				keyword: ''
			}
		},
		methods: {
			change(index) {
				this.current = index;
				uni.navigateTo({
					url: this.list[index].pagePath,
					success: res => {},
					fail: () => {},
					complete: () => {}
				});
			},
			onBackPress(options) {
				if (options.from == 'backbutton') {
					uni.redirectTo({
						url: '../../index/index'
					});
				}
				return true
			}
		}
	}
</script>

<style lang="scss" scoped>
	.wrap {
		height: 100%;
		width: 100%;
	}

</style>
