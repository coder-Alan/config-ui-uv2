<template>
	<view class="co-load">
		<view v-show="modelValue && modelValue.length">
			<slot></slot>
		</view>
		<view v-show="!modelValue || !modelValue.length">
			<view class="co-load__tip-null">
				{{ placeholder }}
			</view>
		</view>
	</view>
</template>

<script>
/**
 * Load
 * @description 列表加载组件
 * @property {Array} v-model 列表数据
 * @property {Object} search-data 接口的查询参数，其他参数也可以通过该参数传递，必传
 * @property {Function} load 加载列表数据的方法
 * @property {Boolean} init-search 是否需要在组件初始化时搜索
 * 	@default true
 * @property {Number} page-size 每页条数
 * @property {String} placeholder 暂无数据时的提示语
 * @property {Boolean} loading 是否显示加载中的提示弹框
 * 	@default true
 * @event loadingChange 加载状态改变时触发
 * @event listChange 列表数据改变时触发
 */

export default {
	name: 'CoLoad',
	props: {
		value: {
			type: Array,
			default: () => ([])
		},
		searchData: {
			type: [Object, null],
			required: true,
			default: () => ({})
		},
		load: {
			type: Function,
			default: () => Promise.resolve({ list: [], totalPage: 0 }) // 返回的格式必须为 { list, totalPage }
		},
		initSearch:{
			type: Boolean,
			default: true
		},
		pageSize: {
			type: Number,
			default: 20
		},
		placeholder: {
			type: String,
			default: '暂无数据'
		},
		loading: {
			type: Boolean,
			default: true
		}
	},
	data() {
		return {
			pageNo: 1,
			totalPage: 0,
			isLoading: false, // 当前是否在加载中
			currTimestemp: '', // 当前请求的时间戳，用于鉴别是否是最新请求
		}
	},
	computed: {
		modelValue: {
			get() {
				return this.value
			},
			set(val) {
				this.$emit('input', val)
			}
		}
	},
	mounted() {
		this.initSearch && setTimeout(() => {
			this.search()
		}, 500)
	},
	methods: {
		/**
		 * 关键字搜索
		 */
		search() {
			Promise.resolve().then(() => {
				this.pageNo = 1
				this.loadEvent()
					.then(res => {
						this.modelValue = res.list
						this.totalPage = res.totalPage
					})
			})
		},
		/**
		 * 触底加载
		 */
		scrolltolower() {
			if (this.isLoading || this.pageNo >= this.totalPage) return
			this.pageNo += 1
			this.loadEvent()
				.then(res => {
					this.modelValue = this.modelValue.concat(res.list)
				})
				.catch(() => {
					this.pageNo -= 1
				})
		},
		loadEvent() {
			return new Promise((resolve, reject) => {
				this.isLoading = true
				this.$emit('loadingChange', true)

				this.loading && uni.showLoading({
					title: '数据加载中',
					mask: true
				})

				const params = {
					...this.searchData,
					pageNo: this.pageNo,
					pageSize: this.pageSize,
				}
				const timestemp = Date.now()
				this.currTimestemp = timestemp
				this.load(params)
					.then(res => {
						this.loading && uni.hideLoading()

						let list
						if (this.currTimestemp === timestemp) {
							list = res?.list || []
							this.totalPage = res?.totalPage || 0
							this.isLoading = false
							this.$emit('listChange', list)
							this.$emit('loadingChange', false)
						}
						else {
							list = this.modelValue
						}

						resolve({
							list,
							totalPage: this.totalPage
						})
					})
					.catch(err => {
						this.isLoading = false
						this.$emit('loadingChange', false)
						reject(err)
					})
			})
		}
	}
}
</script>

<style lang="scss" scoped>
.co-load {
	&__tip-null {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 50vh;
		color: #999;
		font-size: 30rpx;
	}
}
</style>
