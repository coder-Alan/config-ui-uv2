<template>
	<CoPopup v-model="showModelValue" @closed="$emit('closed')">
		<view class="co-picker">
			<CoPickerHeader
				title="选择省市区"
				@clear="onClear"
				@confirm="onConfirm"
			></CoPickerHeader>
			<picker-view
				:value="pickerValue"
				class="co-picker__content"
				@change="onChange"
			>
				<picker-view-column>
					<template v-if="provinceList.length">
						<view class="co-picker__content__item" v-for="item in provinceList" :key="item[valueName]">{{ item[labelName] }}</view>
					</template>
					<view v-else-if="provinceLoading" class="column-item">
						<view class="co-loading-circle"></view>
					</view>
					<view v-else class="column-item empty-text">暂无数据</view>
				</picker-view-column>
				<picker-view-column>
					<view v-if="cityLoading" class="column-item">
						<view class="co-loading-circle"></view>
					</view>
					<template v-else>
						<template v-if="cityList.length">
							<view class="co-picker__content__item" v-for="item in cityList" :key="item[valueName]">{{ item[labelName] }}</view>
						</template>
						<view v-if="!cityList.length && cityIsLoaded" class="column-item empty-text">暂无数据</view>
					</template>
				</picker-view-column>
				<picker-view-column>
					<view v-if="areaLoading" class="column-item">
						<view class="co-loading-circle"></view>
					</view>
					<template v-else>
						<template v-if="areaList.length">
							<view class="co-picker__content__item" v-for="item in areaList" :key="item[valueName]">{{ item[labelName] }}</view>
						</template>
						<view v-if="!areaList.length && areaIsLoaded" class="column-item empty-text">暂无数据</view>
					</template>
				</picker-view-column>
			</picker-view>
		</view>
	</CoPopup>
</template>

<script>
import CoPopup from '../co-popup/co-popup'
import CoPickerHeader from '../co-picker-header/co-picker-header'

import ConfigStore from '../../utils/config-store'

/**
 * AreaPicker 省市区选择器
 * @property {Boolean} show 是否显示弹框
 * @property {Boolean} emit-path 是否返回由该节点所在的省市区的值所组成的数组，若设置 false，则只返回最后一级区域的数据
 * @event {Function} update:show 设置 showModelValue 的值时触发
 * @event {Function} confirm 点击CoPickerHeader组件的确定按钮触发
 * @event {Function} clear 点击CoPickerHeader组件的清除按钮触发
 * @event {Function} closed 弹框关闭后触发
 */

export default {
	name: 'CoAreaPicker',
	components: {
		CoPopup,
		CoPickerHeader,
	},
	props: {
		show: {
			type: Boolean,
			default: false
		},
		emitPath: {
			type: Boolean,
			default: true
		},
	},
	data() {
		return {
			provinceList: [],
			cityList: [],
			areaList: [],
			provinceIndex: 0,
			cityIndex: undefined,
			zoneIndex: 0,
			pickerValue: [0, 0, 0],
			provinceLoading: false, // 省是否正在加载
			cityLoading: false, // 市是否正在加载
			areaLoading: false, // 区是否正在加载
			provinceIsLoaded: false, // 省是否加载完成
			cityIsLoaded: false, // 市是否加载完成
			areaIsLoaded: false, // 区是否加载完成
		}
	},
	computed: {
		showModelValue: {
			get() {
				return this.show
			},
			set(val) {
				this.$emit('update:show', val)
			}
		},
		cityStorageData() {
			return ConfigStore.city
		},
		areas() {
			return ConfigStore.area
		},
		valueName() {
			return ConfigStore.geoConfig.key
		},
		labelName() {
			return ConfigStore.geoConfig.value
		}
	},
	watch: {
		provinceIndex(val) {
			this.provinceIndexChange(val)
		},
		cityIndex(val) {
			this.cityIndexChange(val)
		}
	},
	created() {
		this.getProvinceData()
	},
	methods: {
		getProvinceData() {
			if (Object.keys(ConfigStore.province).length) {
				this.provinceList = Object.values(ConfigStore.province)
				this.provinceIndexChange(0)
			}
			else {
				this.provinceLoading = true
				ConfigStore.getGeoData()
				.then(list => {
					this.provinceList = list
					this.provinceLoading = false
					this.provinceIndexChange(0)
					ConfigStore.setGeoData({
						type: 'province',
						list,
					})
				})
				.catch((e) => {
					this.provinceLoading = false
					console.warn(`省获取失败：${e.message}`)
				})
			}
		},
		onClear() {
			this.$emit('clear')
			this.showModelValue = false
		},
		onConfirm() {
			const pathList = []
			this.provinceList[this.provinceIndex] && pathList.push(this.provinceList[this.provinceIndex])
			this.cityList[this.cityIndex] && pathList.push(this.cityList[this.cityIndex])
			this.areaList[this.zoneIndex] && pathList.push(this.areaList[this.zoneIndex])

			if (this.emitPath) {
				this.$emit('confirm', {
					label: pathList.map(item => item[this.labelName]).join('-'),
					value: pathList.map(item => item[this.valueName])
				})
			}
			else {
				this.$emit('confirm', {
					label: pathList[pathList.length - 1][this.labelName],
					value: pathList[pathList.length - 1][this.valueName]
				})
			}

			this.showModelValue = false
		},
		onChange({ detail: { value } }) {
			this.provinceIndex = value[0]
			this.cityIndex = value[1]
			this.zoneIndex = value[2]
		},
		/**
		 * 省份的选择器下标改变时,同时改变市区和地区的数据
		 * @param {Number} index 数组下标
		 */
		provinceIndexChange(index) {
			this.cityLoading = false
			this.areaLoading = false
			this.areaIsLoaded = false
			this.cityIndex = 0
			this.cityList = []
			this.areaList = []

			if (!this.provinceList.length) return

			const code = this.provinceList[index][this.valueName] // 省级编码
			const cityData = this.cityStorageData[code]

			if (cityData && Object.keys(cityData).length) {
				this.cityList = Object.values(cityData)
				this.cityIndexChange(this.cityIndex)
			}
			else {
				this.cityLoading = true
				ConfigStore.getGeoData(code)
					.then(list => {
						if (code === this.provinceList[this.provinceIndex][this.valueName]) {
							this.cityList = list
							this.cityLoading = false
							this.cityIsLoaded = true
							this.cityIndexChange(this.cityIndex)
						}
						ConfigStore.setGeoData({
							type: 'city',
							code,
							list,
						})
					})
					.catch((e) => {
						if (code === this.provinceList[this.provinceIndex][this.valueName]) {
							this.cityLoading = false
							this.cityIsLoaded = true
						}
						console.warn(`[${code}]市获取失败：${e.message}`)
					})
			}
		},
		/**
		 * 市区的选择器下标改变时,同时改变地区的数据
		 * @param {Number} index 数组下标
		 */
		cityIndexChange(index) {
			this.areaLoading = false
			this.areaIsLoaded = false
			this.zoneIndex = 0
			this.areaList = []
			this.pickerValue = [this.provinceIndex, index, 0]

			if (!this.cityList.length) return

			const code = this.cityList[index][this.valueName] // 市级编码
			const areaData = this.areas[code]

			if (areaData && Object.keys(areaData).length) {
				this.areaList = Object.values(areaData)
			}
			else {
				this.areaLoading = true
				ConfigStore.getGeoData(code)
					.then(list => {
						if (this.cityList && this.cityList[this.cityIndex] && code === this.cityList[this.cityIndex][this.valueName]) {
							this.areaList = list
							this.areaLoading = false
							this.areaIsLoaded = true
						}
						ConfigStore.setGeoData({
							type: 'area',
							code,
							list,
						})
					})
					.catch((e) => {
						if (this.cityList && this.cityList[this.cityIndex] && code === this.cityList[this.cityIndex][this.valueName]) {
							this.areaLoading = false
							this.areaIsLoaded = true
						}
						console.warn(`[${code}]区县获取失败：${e.message}`)
					})
			}
		}
	}
}
</script>

<style lang="scss" scoped>
@import '../../styles/loading.scss';

.column-item {
	display: flex;
	align-items: center;
	justify-content: center;
	line-height: 68rpx;
}

.empty-text {
	font-size: 13px;
	color: #999;
}
</style>
