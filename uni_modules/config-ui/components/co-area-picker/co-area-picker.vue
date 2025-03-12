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
					<view class="co-picker__content__item" v-for="item in provinces" :key="item[valueName]">{{ item[labelName] }}</view>
				</picker-view-column>
				<picker-view-column>
					<view class="co-picker__content__item" v-for="item in cityList" :key="item[valueName]">{{ item[labelName] }}</view>
				</picker-view-column>
				<picker-view-column>
					<view class="co-picker__content__item" v-for="item in areaList" :key="item[valueName]">{{ item[labelName] }}</view>
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
 * CoAreaPicker 省市区选择器
 * @property {Boolean} show 是否显示弹框
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
	},
	data() {
		return {
			cityList: [],
			areaList: [],
			provinceIndex: undefined,
			cityIndex: undefined,
			zoneIndex: 0,
			pickerValue: [0, 0, 0]
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
		provinces() {
			return Object.values(ConfigStore.province)
		},
		citys() {
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
		provinces(val) {
			if (val && val.length) {
				this.provinceIndex = 0
			}
		},
		provinceIndex(val) {
			this.provinceIndexChange(val)
		},
		cityIndex(val) {
			this.cityIndexChange(val)
		}
	},
	methods: {
		onClear() {
			this.$emit('clear')
			this.showModelValue = false
		},
		onConfirm() {
			this.$emit('confirm', {
				label: this.areaList[this.zoneIndex][this.labelName],
				value: this.areaList[this.zoneIndex][this.valueName]
			})
			this.showModelValue = false
		},
		onChange({ detail: { value } }) {
			// console.log(value)
			this.provinceIndex = value[0]
			this.cityIndex = value[1]
			this.zoneIndex = value[2]
		},
		/**
		 * 根据上级区域的区域编码获取下级区域数据
		 * @param {String} code 上级区域的区域编码
		 * @return {Array} 下级区域数组
		 */
		getData(code) {
			return new Promise((resolve, reject) => {
				ConfigStore.geoConfig.getFun(code)
					.then(res => {
						resolve(res)
					})
					.catch((err) => {
						reject(err)
					})
			})
		},
		/**
		 * 省份的选择器下标改变时,同时改变市区和地区的数据
		 * @param {Number} index 数组下标
		 */
		async provinceIndexChange(index) {
			try{
				let list = []
				const code = this.provinces[index][this.valueName]
				const citys = this.citys[code]
				if (citys) {
					list = Object.values(citys)
				}
				else {
					list = await this.getData(code)
					ConfigStore.setGeoData('city', code, list)
				}
				this.cityList = list
				this.cityIndex = 0
				this.cityIndexChange(this.cityIndex)
				this.pickerValue = [index, 0, 0]
			}catch(e){
				console.warn(`[${code}]市区获取失败：${e}`)
			}
		},
		/**
		 * 市区的选择器下标改变时,同时改变地区的数据
		 * @param {Number} index 数组下标
		 */
		async cityIndexChange(index) {
			try{
				let list = []
				const code = this.cityList[index][this.valueName]
				const areas = this.areas[code]
				if (areas) {
					list = Object.values(areas)
				}
				else {
					list = await this.getData(code)
					ConfigStore.setGeoData('area', code, list)
				}
				this.areaList = list
				this.zoneIndex = 0
				this.pickerValue = [this.provinceIndex, index, 0]
			}catch(e){
				console.warn(`[${code}]区县获取失败：${e}`)
			}
		}
	}
}
</script>
