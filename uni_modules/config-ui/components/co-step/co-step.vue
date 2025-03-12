<template>
	<view class="co-step" @click="$emit('click')">
		<view class="co-step__padding"></view>
		<view class="co-step__content">
			<slot name="content"></slot>
		</view>
		<view class="co-step__status" :style="{ top }">
			<template v-if="$slots.icon">
				<slot name="icon"></slot>
			</template>
			<template v-else>
				<CoSvgIcon
          :size="size"
					:icon="newIcon"
					:color="newColor"
					custom-class="custom-icon"
				></CoSvgIcon>
			</template>
		</view>
		<view v-if="!isFirstStep" class="previous-step-status-line" :class="previousStepStatusLineClass"></view>
		<view v-if="!isLastStep" class="current-step-status-line" :class="lineClass"></view>
	</view>
</template>

<script>
import CoSvgIcon from '../co-svg-icon/co-svg-icon'

/**
 * Step
 * @description 步骤条，与 Steps 组合使用，用于展示一个步骤
 * @property {String} icon 图标
 * @property {String} color 图标颜色
 * @property {String} top 图标与步骤条顶部之间的距离
 * @property {String} status = [wait|process|warning|error|success] 状态
 * 	@value wait 等待
 * 	@value process 进行中
 * 	@value warning 警告
 * 	@value error 错误
 * 	@value success 完成
 * 	@default wait
 * @event click 当点击步骤条时触发
 */

export default {
	name: 'CoStep',
	options: {
		styleIsolation: 'shared'
	},
	components: {
		CoSvgIcon,
	},
	props: {
		icon: {
			type: String,
			default: ''
		},
		color: {
			type: String,
			default: ''
		},
		top: {
			type: String,
			default: '50%'
		},
    status: {
      type: String,
      default: 'wait'
    }
	},
  data() {
    return {
      newStatus: '',
			isFirstStep: false, // 是否是第一步
			isLastStep: false, // 是否是最后一步
			previousStepLine: '', // 前一个步骤的线
			currentStepLine: '', // 当前步骤的线
    }
  },
	computed: {
		lineClass() {
			return this.currentStepLine ? `line--${this.currentStepLine}` : ''
		},
		previousStepStatusLineClass() {
			return this.previousStepLine ? `line--${this.previousStepLine}` : ''
		},
    newIcon() {
      if (this.icon) return this.icon
      else {
        const icons = {
					wait: 'circleFilled',
					process: 'circle',
					warning: 'warningFilled',
					error: 'failFilled',
          success: 'successFilled',
        }

        return icons[this.newStatus]
      }
    },
		newColor() {
			if (this.color) return this.color
			else {
				const colors = {
					wait: '#ccc',
					process: '#1677FF',
					warning: '#f0ad4e',
					error: '#FF3141',
          success: '#4cd964',
				}

				return colors[this.newStatus]
			}
		},
		size() {
			const sizes = {
				wait: '14',
				process: '20',
				warning: '22',
				error: '22',
				success: '22',
			}

			return sizes[this.newStatus]
		},
	},
  watch: {
    status: {
      handler(val) {
        this.newStatus = val
      },
      immediate: true
    }
  },
  methods: {
    setStatus(val) {
      this.newStatus = val
    },
		setFirstStep() {
			this.isFirstStep = true
		},
		setLastStep() {
			this.isLastStep = true
		},
		setPreviousStepLine(status) {
			this.previousStepLine = status
		},
		setCurrentStepLine() {
			this.currentStepLine = this.newStatus
		}
  },
}
</script>

<style lang="scss" scoped>
.co-step {
	position: relative;
	display: flex;
	min-height: 100rpx;
	background-color: #fff;

	&__padding {
		width: 92rpx;
	}

	&__content {
		flex: 1;
		overflow: hidden;
		border-bottom: 1rpx solid #EEEEEE;
	}

	&__status,
	.previous-step-status-line,
	.current-step-status-line {
		position: absolute;
		left: 50rpx;
	}

	&__status {
		top: 50%;
		z-index: 1;
		transform: translate(-50%, -50%);
	}

	.previous-step-status-line {
		top: 0;
		width: 0.5px;
		height: 50%;
		background: #E5E5E5;
	}

	.current-step-status-line {
		top: 50%;
		width: 0.5px;
		height: 50%;
		background: #E5E5E5;
	}

	.line--process {
		background: #1677FF;
	}

	.line--error {
		background: #FF3141;
	}

	.line--warning {
		background: #f0ad4e;
	}

	.line--success {
		background: #4cd964;
	}
}

::v-deep .custom-icon {
	background-color: #fff;
}
</style>
