<template>
	<CoPopup v-model="showModelValue" @closed="$emit('closed')">
		<view class="co-time-picker">
			<CoPickerHeader
				title="选择日期"
				@clear="onClear"
				@confirm="onConfirm"
			></CoPickerHeader>
			<picker-view
				:value="pickerValue"
				class="co-time-picker__content"
				@change="onChange"
			>
				<template v-if="['date', 'datetime'].includes(type)">
					<picker-view-column>
						<view class="co-time-picker__content__item" v-for="(item, index) in years" :key="index">{{ item }}年</view>
					</picker-view-column>
					<picker-view-column>
						<view class="co-time-picker__content__item" v-for="(item, index) in months" :key="index">{{ item }}月</view>
					</picker-view-column>
					<picker-view-column>
						<view class="co-time-picker__content__item" v-for="(item, index) in days" :key="index">{{ item }}日</view>
					</picker-view-column>
				</template>
				<template v-if="['datetime', 'time'].includes(type)">
					<picker-view-column>
						<view class="co-time-picker__content__item" v-for="(item, index) in hours" :key="index">{{ item }}时</view>
					</picker-view-column>
					<picker-view-column>
						<view class="co-time-picker__content__item" v-for="(item, index) in minutes" :key="index">{{ item }}分</view>
					</picker-view-column>
					<picker-view-column>
						<view class="co-time-picker__content__item" v-for="(item, index) in seconds" :key="index">{{ item }}秒</view>
					</picker-view-column>
				</template>
				<template v-if="type === 'month'">
					<picker-view-column>
						<view class="co-time-picker__content__item" v-for="(item, index) in years" :key="index">{{ item }}年</view>
					</picker-view-column>
					<picker-view-column>
						<view class="co-time-picker__content__item" v-for="(item, index) in months" :key="index">{{ item }}月</view>
					</picker-view-column>
				</template>
			</picker-view>
		</view>
	</CoPopup>
</template>

<script>
import CoPopup from '../co-popup/co-popup'
import CoPickerHeader from '../co-picker-header/co-picker-header'

import { years, months, hours, minutes, seconds } from '../../utils'

/**
 * TimePicker
 * @description 时间选择器，form组件的内置组件，用于选择日期和时间
 * @property {Boolean} show 是否显示时间选择器
 * @property {String} type = [date|datetime|time|month] 选择器类型
 * 	@value date 日期选择器
 * 	@value datetime 日期时间选择器
 * 	@value time 时间选择器
 * 	@value month 年月选择器
 * 	@default date
 * @property {Array<number>} disabled-hours 禁止选择的小时
 * @property {Array<number>} disabled-minutes 禁止选择的分钟
 * @property {Array<number>} disabled-seconds 禁止选择的秒
 * @event update:show 设置 showModelValue 的值时触发
 * @event confirm 点击确定按钮触发事件
 * @event clear 点击清除按钮触发事件
 * @event closed 弹窗关闭后触发
 * @example <co-time-picker :show.sync="show" type="date" @closed="onClose"></co-time-picker>
 */

export default {
	name: 'CoTimePicker',
	components: {
		CoPopup,
		CoPickerHeader,
	},
	props: {
		show: {
			type: Boolean,
			default: false
		},
		type: {
			type: String,
			default: 'date'
		},
		disabledHours: {
			type: Array,
			default: () => []
		},
		disabledMinutes: {
			type: Array,
			default: () => []
		},
		disabledSeconds: {
			type: Array,
			default: () => []
		}
	},
	data() {
		const date = new Date()
		const year = date.getFullYear()
		let month = date.getMonth() + 1
		let day = date.getDate()
		let hour = date.getHours()
		let minute = date.getMinutes()
		let second = date.getSeconds()
		let pickerValue = []
		if (this.type === 'date') {
			pickerValue = [9999, month - 1, day - 1]
		}
		else if (this.type === 'datetime') {
			pickerValue = [9999, month - 1, day - 1, hour, minute, second]
		}
		else if (this.type === 'time') {
			pickerValue = [hour, minute, second]
		}
		else if (this.type === 'month') {
			pickerValue = [9999, month - 1]
		}
		month = month < 10 ? `0${month}` : month.toString()
		day = day < 10 ? `0${day}` : day.toString()
		hour = hour < 10 ? `0${hour}` : hour.toString()
		minute = minute < 10 ? `0${minute}` : minute.toString()
		second = second < 10 ? `0${second}` : second.toString()

		return {
			years,
			months,
			days: [],
			hours,
			minutes,
			seconds,
			year,
			month,
			day,
			hour,
			minute,
			second,
			pickerValue
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
		}
	},
	watch: {
		disabledHours(val) {
			this.hours = hours.filter(item => !val.includes(Number(item)))
		},
		disabledMinutes(val) {
			this.minutes = minutes.filter(item => !val.includes(Number(item)))
		},
		disabledSeconds(val) {
			this.seconds = seconds.filter(item => !val.includes(Number(item)))
		},
		month: {
			handler(val) {
				this.days = this.getDaysInMonth(this.year, val)
			},
			immediate: true
		}
	},
	methods: {
		getDaysInMonth(year, month) {
			// 创建一个新的Date对象，设置为下一个月的第0天
			// 这将导致Date对象自动回退到上一个月的最后一天
			const lastDay = new Date(year, month + 1, 0);
			// 返回该日期对象的日期部分，即该月的天数
			const days = lastDay.getDate();
			const list = []
			for (let i = 1; i <= days; i++) {
				list.push(i < 10 ? '0' + i : i.toString());
			}
			return list
		},
		onChange({ detail: { value } }) {
			if (this.type === 'date') {
				this.year = this.years[value[0]]
				this.month = this.months[value[1]]
				this.day = this.days[value[2]]
			}
			else if (this.type === 'datetime') {
				this.year = this.years[value[0]]
				this.month = this.months[value[1]]
				this.day = this.days[value[2]]
				this.hour = this.hours[value[3]]
				this.minute = this.minutes[value[4]]
				this.second = this.seconds[value[5]]
			}
			else if (this.type === 'time') {
				this.hour = this.hours[value[0]]
				this.minute = this.minutes[value[1]]
				this.second = this.seconds[value[2]]
			}
			else if (this.type === 'month') {
				this.year = this.years[value[0]]
				this.month = this.months[value[1]]
			}
		},
		onConfirm() {
			let timeStr
			if (this.type === 'date') {
				timeStr = `${this.year}-${this.month}-${this.day}`
			}
			else if (this.type === 'datetime') {
				timeStr = `${this.year}-${this.month}-${this.day} ${this.hour}:${this.minute}:${this.second}`
			}
			else if (this.type === 'time') {
				timeStr = `${this.hour}:${this.minute}:${this.second}`
			}
			else if (this.type === 'month') {
				timeStr = `${this.year}-${this.month}`
			}
			this.$emit('confirm', {
				label: timeStr,
				value: timeStr
			})
			this.showModelValue = false
		},
		onClear() {
			this.$emit('clear')
			this.showModelValue = false
		}
	}
}
</script>

<style lang="scss" scoped>
.co-time-picker {
	display: flex;
	flex-direction: column;
	height: 560rpx;
	color: #333;
	padding-bottom: 40rpx;

	&__content {
		flex: 1;
		overflow: hidden;

		&__item {
			display: flex;
			align-items: center;
			justify-content: center;
		}
	}
}
</style>
