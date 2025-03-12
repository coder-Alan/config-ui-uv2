<template>
	<view class="co-calendar-item__weeks-box" :class="{
		'co-calendar-item--disable':weeks.disable,
		'co-calendar-item--before-checked-x':weeks.beforeMultiple,
		'co-calendar-item--multiple': weeks.multiple,
		'co-calendar-item--after-checked-x':weeks.afterMultiple,
		}" @click="choiceDate(weeks)" @mouseenter="handleMousemove(weeks)">
		<view class="co-calendar-item__weeks-box-item" :class="{
				'co-calendar-item--checked':calendar.fullDate === weeks.fullDate && (calendar.userChecked || !checkHover),
				'co-calendar-item--checked-range-text': checkHover,
				'co-calendar-item--before-checked':weeks.beforeMultiple,
				'co-calendar-item--multiple': weeks.multiple,
				'co-calendar-item--after-checked':weeks.afterMultiple,
				'co-calendar-item--disable':weeks.disable,
				}">
			<text v-if="selected && weeks.extraInfo" class="co-calendar-item__weeks-box-circle"></text>
			<text class="co-calendar-item__weeks-box-text co-calendar-item__weeks-box-text-disable co-calendar-item--checked-text">{{weeks.date}}</text>
		</view>
		<view :class="{'co-calendar-item--today': weeks.isToday}"></view>
	</view>
</template>

<script>
export default {
	name: 'CoCalendarItem',
	props: {
		weeks: {
			type: Object,
			default () {
				return {}
			}
		},
		calendar: {
			type: Object,
			default: () => {
				return {}
			}
		},
		selected: {
			type: Array,
			default: () => {
				return []
			}
		},
		checkHover: {
			type: Boolean,
			default: false
		}
	},
	methods: {
		choiceDate(weeks) {
			this.$emit('change', weeks)
		},
		handleMousemove(weeks) {
			this.$emit('handleMouse', weeks)
		}
	}
}
</script>

<style lang="scss" >
	$uni-primary: #007aff !default;

	.co-calendar-item__weeks-box {
		flex: 1;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
		justify-content: center;
		align-items: center;
		margin: 1px 0;
		position: relative;
	}

	.co-calendar-item__weeks-box-text {
		font-size: 14px;
		// font-family: Lato-Bold, Lato;
		font-weight: bold;
		color: darken($color: $uni-primary, $amount: 40%);
	}

	.co-calendar-item__weeks-box-item {
		position: relative;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
		justify-content: center;
		align-items: center;
		width: 40px;
		height: 40px;
		/* #ifdef H5 */
		cursor: pointer;
		/* #endif */
	}


	.co-calendar-item__weeks-box-circle {
		position: absolute;
		top: 5px;
		right: 5px;
		width: 8px;
		height: 8px;
		border-radius: 8px;
		background-color: #dd524d;

	}

	.co-calendar-item__weeks-box .co-calendar-item--disable {
		cursor: default;
	}

	.co-calendar-item--disable .co-calendar-item__weeks-box-text-disable {
		color: #D1D1D1;
	}

	.co-calendar-item--today {
		position: absolute;
		top: 10px;
		right: 17%;
		background-color: #dd524d;
		width:6px;
		height: 6px;
		border-radius: 50%;
	}

	.co-calendar-item--extra {
		color: #dd524d;
		opacity: 0.8;
	}

	.co-calendar-item__weeks-box .co-calendar-item--checked {
		background-color: $uni-primary;
		border-radius: 50%;
		box-sizing: border-box;
		border: 3px solid #fff;
	}

	.co-calendar-item--checked .co-calendar-item--checked-text {
		color: #fff;
	}

	.co-calendar-item--multiple .co-calendar-item--checked-range-text {
		color: #333;
	}

	.co-calendar-item--multiple {
		background-color:  #F6F7FC;
		// color: #fff;
	}

	.co-calendar-item--multiple .co-calendar-item--before-checked,
	.co-calendar-item--multiple .co-calendar-item--after-checked {
		background-color: $uni-primary;
		border-radius: 50%;
		box-sizing: border-box;
		border: 3px solid #F6F7FC;
	}

	.co-calendar-item--before-checked .co-calendar-item--checked-text,
	.co-calendar-item--after-checked .co-calendar-item--checked-text {
		color: #fff;
	}

	.co-calendar-item--before-checked-x {
		border-top-left-radius: 50px;
		border-bottom-left-radius: 50px;
		box-sizing: border-box;
		background-color: #F6F7FC;
	}

	.co-calendar-item--after-checked-x {
		border-top-right-radius: 50px;
		border-bottom-right-radius: 50px;
		background-color: #F6F7FC;
	}
</style>
