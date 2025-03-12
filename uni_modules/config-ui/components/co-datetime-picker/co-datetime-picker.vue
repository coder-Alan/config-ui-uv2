<template>
	<CoPopup v-model="showModelValue" @closed="$emit('closed')">
		<view class="co-datetime-picker">
			<Calendar
        ref="calendar"
				:start-date="startDate"
				:end-date="endDate"
				:default-value="defaultValue"
				:has-time="hasTime"
				:ple-status="multipleStatus"
				:def-time="tempRange"
				:range="isRange"
				:hide-second="hideSecond"
				:clear="clear"
				@change="onChange"
				@confirm="onConfirm"
				@clear="onClear"
			></Calendar>
		</view>
	</CoPopup>
</template>

<script>
/**
 * Datetime 日期时间选择弹窗
 * @description 可以查看日期，选择任意范围内的日期，打点操作。
 * @property {Boolean} show 是否显示弹框
 * @property {String} type = [date|daterange|datetime|datetimerange] 选择器类型
 * 	@value date 日期选择器
 *  @value daterange 日期范围选择器
 *  @value datetime 日期时间选择器
 *  @value datetimerange 日期时间范围选择器
 * 	@default date
 * @property {String} start-date 日期选择范围-开始日期
 * @property {String} end-date 日期选择范围-结束日期
 * @property {Boolean} hide-second 是否隐藏秒
 * @property {Boolean} clear 是否显示清除按钮
 * @property {String} default-value 选择器打开时默认显示的时间
 * @event {Function} update:show 设置 showModelValue 的值时触发
 * @event {Function} confirm 点击确认按钮触发
 * @event {Function} clear 点击清除按钮触发
 * @event {Function} closed 弹框关闭后触发
 * @example <co-datetime-picker :show.sync="show" type="date" :start-date="'2019-3-2'" :end-date="'2019-5-20' "@confirm="confirm" />
 */
import CoPopup from '../co-popup/co-popup'
import Calendar from './calendar'

import { getDate, getTime } from './util'

export default {
	name: 'CoDatetimePicker',
	components: {
		CoPopup,
		Calendar,
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
		startDate: {
			type: [String, Number],
			default: ''
		},
		endDate: {
			type: [String, Number],
			default: ''
		},
		hideSecond: {
			type: Boolean,
			default: false
		},
		clear: {
			type: Boolean,
			default: true
		},
		defaultValue: {
			type: [String, Number, Object, Array],
			default: ''
		},
	},
	data() {
		return {
			data: undefined,
			multipleStatus: {
				before: '',
				after: '',
				data: [],
				fulldate: ''
			},
			tempRange: {
				startTime: '',
				endTime: ''
			}
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
		hasTime() {
			if (this.type.indexOf('time') !== -1) {
				return true
			}
			else {
				return false
			}
		},
		isRange() {
			if (this.type.indexOf('range') !== -1) {
				return true
			}
			else {
				return false
			}
		}
	},
	watch: {
		showModelValue(val) {
			val && this.initPicker(true)
    }
	},
	created() {
    let isInit = false
		const defaultValueWatch = this.$watch(
			'defaultValue',
			(val) => {
				if (!val) return

				if (!isInit) {
          isInit = true
          this.initPicker(false)
        }

				defaultValueWatch && defaultValueWatch()
			},
			{
				immediate: true
			}
		)
	},
	methods: {
		initPicker(isOnlyShow = true) {
			if (Array.isArray(this.defaultValue) && this.isRange) {
				const [before, after] = this.defaultValue

				if (!before && !after) return

				const beforeDate = getDate(before)
				const beforeTime = getTime(before, this.hideSecond)
				const afterDate = getDate(after)
				const afterTime = getTime(after, this.hideSecond)
				if (this.hasTime) {
					this.tempRange.startTime = beforeTime
					this.tempRange.endTime = afterTime
				}
				const defaultRange = {
					before: beforeDate,
					after: afterDate
				}
				this.multipleStatus = Object.assign({}, this.multipleStatus, defaultRange, {
					which: 'left'
				})
			}

      this.$nextTick(() => {
        this.$refs.calendar.defaultValueChange(isOnlyShow)
      })
		},
		onChange(e) {
			// console.log(e)
			this.data = e
			if (!this.hasTime) this.onConfirm()
		},
		onConfirm() {
			if (!this.data) {
				return this.showModelValue = false
			}

			let value
			if (this.isRange) {
				if (this.type === 'daterange') {
					if (this.data.range.before) {
						value = [this.data.range.before, this.data.range.after || this.data.range.before]
					}
				}
				else {
					if (this.data.range.before) {
						const time = getTime(new Date())
						value = [
							`${this.data.range.before} ${this.data.timeRange.startTime || time}`,
							`${this.data.range.after || this.data.range.before} ${this.data.timeRange.endTime || time}`
						]
					}
				}
			}
			else {
				if (this.type === 'date') {
					value = this.data.fulldate
				}
				else {
					if (this.data.fulldate) {
						const time = getTime(new Date())
						value = `${this.data.fulldate} ${this.data.time || time}`
					}
				}
			}

			this.$emit('confirm', {
				label: this.isRange && value ? value.join(' 至 ') : value,
				value
			})
			this.showModelValue = false
		},
		onClear() {
			this.$emit('clear')
			this.showModelValue = false
		},
	}
}
</script>
