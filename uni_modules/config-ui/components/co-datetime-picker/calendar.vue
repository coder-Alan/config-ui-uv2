<template>
  <view class="co-calendar">
    <CoPickerHeader :clear="clear" :confirm="hasTime" @clear="onClear" @confirm="$emit('confirm')">
      <view class="co-calendar__header">
        <view class="co-calendar__header__arrow" @click.stop="changeMonth('pre')">
          <view class="co-calendar__header__arrow__btn co-calendar__header__arrow__left"></view>
        </view>
        <picker mode="date" :value="nowDate.fullDate" fields="month" @change="bindDateChange">
          <view class="co-calendar__header__text">
            {{ `${nowDate.year}年${nowDate.month}月` }}
          </view>
        </picker>
        <view class="co-calendar__header__arrow" @click.stop="changeMonth('next')">
          <view class="co-calendar__header__arrow__btn co-calendar__header__arrow__right"></view>
        </view>
      </view>
    </CoPickerHeader>
    <view class="co-calendar__main">
      <view v-if="showMonth" class="co-calendar__main__bg">
        <text class="co-calendar__main__bg__text">{{ nowDate.month }}</text>
      </view>
      <view class="co-calendar__main__weeks">
        <view v-for="item in dayText" :key="item" class="co-calendar__main__weeks__day">
          <text class="co-calendar__main__weeks__day__text">{{ item }}</text>
        </view>
      </view>
      <view v-for="(item, weekIndex) in weeks" :key="weekIndex" class="co-calendar__main__weeks">
        <view v-for="(weeks, weeksIndex) in item" :key="weeksIndex" class="co-calendar__main__weeks__item">
          <CoCalendarItem
            :weeks="weeks"
            :calendar="calendar"
            :selected="selected"
            :checkHover="range"
            @change="choiceDate"
            @handleMouse="handleMouse"
          ></CoCalendarItem>
        </view>
      </view>
      <view v-if="!range && hasTime" class="co-calendar__main__time">
        <view class="co-calendar__main__time__date">{{ tempSingleDate || '选择日期' }}</view>
        <CoCalendarTime v-model="time" :hide-second="hideSecond" @input="timeConfirm"></CoCalendarTime>
      </view>
      <view v-if="range && hasTime" class="co-calendar__main__timerange">
        <view class="co-calendar__main__timerange__item">
          <view class="co-calendar__main__timerange__date">
            {{ tempRange.before || '开始日期' }}
          </view>
          <CoCalendarTime
            v-model="timeRange.startTime"
            :disabled="!tempRange.before"
            :hide-second="hideSecond"
            :max-time="timeRange.endTime"
            @input="timeConfirm"
          ></CoCalendarTime>
        </view>
        <view class="center_padding">至</view>
        <view class="co-calendar__main__timerange__item">
          <view class="co-calendar__main__timerange__date">
            {{ tempRange.after || '结束日期' }}</view>
          <CoCalendarTime
            v-model="timeRange.endTime"
            :disabled="!tempRange.after"
            :hide-second="hideSecond"
            :min-time="timeRange.startTime"
            @input="timeConfirm"
          ></CoCalendarTime>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
/**
 * Calendar 日历
 * @description 日历组件可以查看日期，选择任意范围内的日期，打点操作。
 * @property {String} startDate 日期选择范围-开始日期
 * @property {String} endDate 日期选择范围-结束日期
 * @property {Boolean} range 范围选择
 * @property {Array} selected 打点，期待格式[{date: '2019-06-27', info: '签到', data: { custom: '自定义信息', name: '自定义消息头',xxx:xxx... }}]
 * @property {Boolean} showMonth 是否选择月份为背景
 * @property {Boolean} hideSecond 是否隐藏秒数
 * @property {String} defaultValue 选择器打开时默认显示的时间
 * @event {Function} change 日期改变
 * @event {Function} confirm 确认选择
 * @event {Function} monthSwitch 切换月份时触发
 * @example <pmg-calendar :start-date="'2019-3-2'" :end-date="'2019-5-20' "@change="change" />
 */
import CoPickerHeader from '../co-picker-header/co-picker-header'
import CoCalendarItem from './calendar-item'
import CoCalendarTime from './calendar-time'

import {
  Calendar,
  getDate,
  getTime,
  fixIosDateFormat,
} from './util'
import {
  formatDate,
} from '../../utils/time'

export default {
  name: 'CoCalendar',
  components: {
    CoPickerHeader,
    CoCalendarItem,
    CoCalendarTime,
  },
  props: {
    selected: {
      type: Array,
      default: () => ([])
    },
    startDate: {
      type: [String, Number],
      default: ''
    },
    endDate: {
      type: [String, Number],
      default: ''
    },
    range: {
      type: Boolean,
      default: false
    },
    hasTime: {
      type: Boolean,
      default: false
    },
    showMonth: {
      type: Boolean,
      default: true
    },
    hideSecond: {
      type: Boolean,
      default: false
    },
    defaultValue: {
      type: [String, Number, Object, Array],
      default: ''
    },
    pleStatus: {
      type: Object,
      default() {
        return {
          before: '',
          after: '',
          data: [],
          fulldate: ''
        }
      }
    },
    defTime: {
      type: [Object],
      default: () => ({
        startTime: '',
        endTime: ''
      })
    },
    clear: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  data() {
    return {
      dayText: ['日', '一', '二', '三', '四', '五', '六'],
      cale: null,
      weeks: [],
      calendar: {},
      nowDate: {},
      time: '',
      timeRange: {
        startTime: '',
        endTime: ''
      },
      tempSingleDate: '',
      tempRange: {
        before: '',
        after: ''
      },
      isOnlyShow: true // 是否只展示日期，不改变数据
    }
  },
  methods: {
    defaultValueChange(isOnlyShow) {
      // 获取日历方法实例
      this.cale = new Calendar({
        selected: this.selected,
        startDate: this.startDate ? new Date(fixIosDateFormat(getDate(this.startDate))) : '',
        endDate: this.endDate,
        range: this.range
      })

      // 选中某一天
      let date
      if (this.range) {
        date = this.defaultValue ? this.defaultValue[0] : ''
      }
      else {
        date = this.defaultValue
      }

      this.isOnlyShow = isOnlyShow
      this.init(date)
    },
    /**
     * 初始化日期显示
     * @param {Object} date
     */
    init(date) {
      this.cale.setDate(date || new Date())
      this.weeks = this.cale.weeks
      this.nowDate = this.cale.getInfo(date)
      this.calendar = { ...this.nowDate }
      if (!date) {
        // 优化date为空默认不选中今天
        this.calendar.fullDate = ''
      }
      else {
        if (!this.range) {
          this.tempSingleDate = getDate(date)
          this.time = getTime(date, this.hideSecond)
          !this.isOnlyShow && this.change()
        }
        else {
          const {
            before,
            after,
            fulldate,
            which
          } = this.pleStatus
          this.tempRange.before = before
          this.tempRange.after = after
          this.timeRange = { ...this.defTime }
          if (fulldate) {
            this.cale.setHoverMultiple(fulldate)
            if (before && after) {
              this.cale.lastHover = true
              if (this.rangeWithinMonth(after, before)) return
              this.setDate(before)
            }
            else {
              this.cale.setMultiple(fulldate)
              this.setDate(this.nowDate.fullDate)
              this.calendar.fullDate = ''
              this.cale.lastHover = false
            }
          }
          else {
            this.cale.setDefaultMultiple(before, after)
            if (which === 'left' && before) {
              this.setDate(before)
              this.weeks = this.cale.weeks
            }
            else if (after) {
              this.setDate(after)
              this.weeks = this.cale.weeks
            }
            this.cale.lastHover = true
          }
          !this.isOnlyShow && this.change()
        }
      }
    },
    /**
     * 选择天触发
     * @param {Object} weeks
     */
    choiceDate(weeks) {
      if (weeks.disable) return

      this.calendar = weeks
      this.calendar.userChecked = true

      // 设置多选
      this.cale.setMultiple(this.calendar.fullDate, true)
      this.weeks = this.cale.weeks
      this.tempSingleDate = this.calendar.fullDate
      const after = this.cale.multipleStatus.after
      const before = this.cale.multipleStatus.before
      const beforeDate = new Date(fixIosDateFormat(this.cale.multipleStatus.before)).getTime()
      const afterDate = new Date(fixIosDateFormat(this.cale.multipleStatus.after)).getTime()
      if (beforeDate > afterDate && afterDate) {
        this.cale.multipleStatus.after = before
        this.cale.multipleStatus.before = after
      }
      this.tempRange.before = this.cale.multipleStatus.before
      this.tempRange.after = this.cale.multipleStatus.after

      if (this.range) {
        if (this.tempRange.before && this.tempRange.after) this.change()
      }
      else {
        this.change()
      }
    },
    /**
     * 变化触发
     */
    change() {
      this.setEmit('change')
    },
    /**
     * 派发事件
     * @param {Object} name
     */
    setEmit(name) {
      if (!this.range) {
        if (!this.calendar.fullDate) {
          this.calendar = this.cale.getInfo(new Date())
          this.tempSingleDate = this.calendar.fullDate
        }
        if (this.hasTime && !this.time) {
          this.time = getTime(new Date(), this.hideSecond)
        }
      }
      if (!this.timeRange.startTime) this.timeRange.startTime = formatDate({ format: 'HH:mm:ss' })
      if (!this.timeRange.endTime) this.timeRange.endTime = formatDate({ format: 'HH:mm:ss' })

      let {
        year,
        month,
        date,
        fullDate,
        extraInfo
      } = this.calendar
      this.$emit(name, {
        range: this.cale.multipleStatus,
        year,
        month,
        date,
        time: this.time,
        timeRange: this.timeRange,
        fulldate: fullDate,
        extraInfo: extraInfo || {}
      })
    },
    bindDateChange(e) {
      const value = e.detail.value + '-1'
      this.setDate(value)
    },
    /**
     * 设置日期
     * @param {Object} date
     */
    setDate(date) {
      this.cale.setDate(date)
      this.weeks = this.cale.weeks
      this.nowDate = this.cale.getInfo(date)
    },
    changeMonth(type) {
      let newDate
      if (type === 'pre') {
        newDate = this.cale.getPreMonthObj(this.nowDate.fullDate).fullDate
      }
      else if (type === 'next') {
        newDate = this.cale.getNextMonthObj(this.nowDate.fullDate).fullDate
      }
      this.setDate(newDate)
      this.monthSwitch()
    },
    /**
     * 选择月份触发
     */
    monthSwitch() {
      let {
        year,
        month
      } = this.nowDate
      this.$emit('monthSwitch', {
        year,
        month: Number(month)
      })
    },
    timeConfirm() {
      this.change()
    },
    onClear() {
      this.clearCalender()
      this.$emit('clear')
    },
    clearCalender() {
      if (this.range) {
        this.timeRange.startTime = ''
        this.timeRange.endTime = ''
        this.tempRange.before = ''
        this.tempRange.after = ''
        this.cale.multipleStatus.before = ''
        this.cale.multipleStatus.after = ''
        this.cale.multipleStatus.data = []
        this.cale.lastHover = false
      }
      else {
        this.time = ''
        this.tempSingleDate = ''
      }

      this.calendar = {
        ...this.cale.getInfo(''),
        fullDate: ''
      }
      this.setDate(new Date())
    },
    rangeWithinMonth(A, B) {
      const [yearA, monthA] = A.split('-')
      const [yearB, monthB] = B.split('-')
      return yearA === yearB && monthA === monthB
    }
  }
}
</script>

<style lang="scss" scoped>
.co-calendar {
  &__header {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;

    &__arrow {
      padding: 20rpx 30rpx;

      &__btn {
        width: 18rpx;
        height: 18rpx;
        border-left-color: grey;
        border-left-style: solid;
        border-left-width: 2rpx;
        border-top-color: #555;
        border-top-style: solid;
        border-top-width: 2rpx;
      }

      &__left {
        transform: rotate(-45deg);
      }

      &__right {
        transform: rotate(135deg);
      }
    }

    &__text {
      font-size: 30rpx;
      color: #666;
    }
  }

  &__main {
    position: relative;

    &__bg {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      display: flex;
      justify-content: center;
      align-items: center;

      &__text {
        font-size: 200px;
        font-weight: bold;
        color: #999;
        opacity: 0.1;
        text-align: center;
        line-height: 1;
      }
    }

    &__weeks {
      display: flex;

      &__day {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 80rpx;
        border-bottom: 1rpx solid #F5F5F5;

        &__text {
          font-size: 24rpx;
          color: #B2B2B2;
        }
      }

      &__item {
        flex: 1;
      }
    }

    &__time,
    &__timerange {
      position: relative;
      display: flex;
      line-height: 100rpx;
      text-align: center;
      font-size: 28rpx;
      color: #333;
      border-top: 1rpx solid #DCDCDC;
      border-bottom: 1rpx solid #DCDCDC;

      &__date {
        margin-right: 10rpx;
        color: #999;
      }
    }

    &__time {
      justify-content: space-between;
      padding: 0 160rpx;
    }

    &__timerange {
      justify-content: center;

      &__item {
        display: flex;
      }

      .center_padding {
        padding: 0 60rpx;
      }
    }
  }
}
</style>
