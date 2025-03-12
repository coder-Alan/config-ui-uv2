<template>
  <view class="co-calendar-time">
    <view @click="openTimePicker">
      <text v-if="value">
        {{ value }}
      </text>
      <text v-else :class="statusClass">选择时间</text>
    </view>
    <CoTimePicker
      v-model="showTime"
      type="time"
      :disabled-hours="disabledHours"
      :disabled-minutes="disabledMinutes"
      :disabled-seconds="disabledSeconds"
      @confirm="$event => $emit('input', $event.value)"
    ></CoTimePicker>
  </view>
</template>

<script>
import CoTimePicker from '../co-time-picker/co-time-picker'

export default {
  components: {
    CoTimePicker,
  },
  props: {
    value: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    minTime: {
      type: String,
      default: '' // 00:00:00
    },
    maxTime: {
      type: String,
      default: '' // 23:59:59
    }
  },
  data() {
    return {
      showTime: false,
      disabledHours: [],
      disabledMinutes: [],
      disabledSeconds: []
    }
  },
  computed: {
    statusClass() {
      if (this.disabled) return 'co-calendar-time__disabled'
      else return 'co-calendar-time__undisabled'
    }
  },
  watch: {
    minTime: {
      handler(val) {
        if (!val) return
        this.disabledHours = this.getDisabledHours()
        this.disabledMinutes = this.getDisabledMinutes()
        this.disabledSeconds = this.getDisabledSeconds()
      },
      immediate: true
    },
    maxTime: {
      handler(val) {
        if (!val) return
        this.disabledHours = this.getDisabledHours()
        this.disabledMinutes = this.getDisabledMinutes()
        this.disabledSeconds = this.getDisabledSeconds()
      },
      immediate: true
    }
  },
  methods: {
    openTimePicker() {
      if (this.disabled) return
      this.showTime = true
    },
    makeRange(start, end) {
      const result = []
      for (let i = start; i < end; i++) {
        result.push(i)
      }
      return result
    },
    getDisabledHours() {
      const minHour = this.minTime ? Number(this.minTime.split(':')[0]) : 0
      const maxHour = this.maxTime ? Number(this.maxTime.split(':')[0]) : 0
      if (this.minTime && this.maxTime) {
        return this.makeRange(0, minHour).concat(this.makeRange(maxHour, 24))
      }
      else if (this.minTime && !this.maxTime) {
        return this.makeRange(0, minHour)
      }
      else if (!this.minTime && this.maxTime) {
        return this.makeRange(maxHour + 1, 24)
      }
      else {
        return []
      }
    },
    getDisabledMinutes() {
      const minMinute = this.minTime ? Number(this.minTime.split(':')[1]) : 0
      const maxMinute = this.maxTime ? Number(this.maxTime.split(':')[1]) : 0
      if (this.minTime && this.maxTime) {
        if (this.value.slice(0, 2) === this.minTime.slice(0, 2) || this.value.slice(0, 2) === this.maxTime.slice(0, 2)) {
          return this.makeRange(0, minMinute).concat(this.makeRange(maxMinute, 60))
        }
        else {
          return []
        }
      }
      else if (this.minTime && !this.maxTime) {
        if (this.value.slice(0, 2) === this.minTime.slice(0, 2)) {
          return this.makeRange(0, minMinute)
        }
        else {
          return []
        }
      }
      else if (!this.minTime && this.maxTime) {
        if (this.value.slice(0, 2) === this.maxTime.slice(0, 2)) {
          return this.makeRange(maxMinute + 1, 60)
        }
        else {
          return []
        }
      }
      else {
        return []
      }
    },
    getDisabledSeconds() {
      const minSecond = this.minTime ? Number(this.minTime.split(':')[2]) : 0
      const maxSecond = this.maxTime ? Number(this.maxTime.split(':')[2]) : 0
      if (this.minTime && this.maxTime) {
        if (this.value.slice(0, 5) === this.minTime.slice(0, 5) || this.value.slice(0, 5) === this.maxTime.slice(0, 5)) {
          return this.makeRange(0, minSecond).concat(this.makeRange(maxSecond, 60))
        }
        else {
          return []
        }
      }
      else if (this.minTime && !this.maxTime) {
        if (this.value.slice(0, 5) === this.minTime.slice(0, 5)) {
          return this.makeRange(0, minSecond)
        }
      }
      else if (!this.minTime && this.maxTime) {
        if (this.value.slice(0, 5) === this.maxTime.slice(0, 5)) {
          return this.makeRange(maxSecond, 60)
        }
      }
      else {
        return []
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.co-calendar-time {
  font-size: 28rpx;
  line-height: 100rpx;

  &__disabled {
    color: #ccc;
  }

  &__undisabled {
    color: #808080;
  }
}
</style>
