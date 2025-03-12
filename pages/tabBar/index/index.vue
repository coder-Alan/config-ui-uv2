<template>
	<view class="index-page co-default-page">
		<view class="banner">
			<image class="image" :src="require('@/static/logo.png')" mode="scaleToFill"></image>
		</view>
		<co-icon-bar
			v-for="(item, index) in list"
			:key="index"
			:thumbnail="item.thumbnail"
      @click="handleClick(item)"
		>
      <view class="co-flex-1 co-justify-between co-padding-left-24">
        <view>{{ item.name }}</view>
        <view>{{ item.label }}</view>
      </view>
    </co-icon-bar>
	</view>
</template>

<script>
import barIcon from '@/static/bar-icon.png'

export default {
  data() {
    return {
      list: [
        {
          name: 'co-svg-icon',
          label: '图标',
          thumbnail: barIcon,
          path: '/pages/subPackages/icon/icon/icon'
        },
        {
          name: 'co-button',
          label: '按钮',
          thumbnail: barIcon,
          path: '/pages/subPackages/button/button'
        },
        {
          name: 'co-tag',
          label: '标签',
          thumbnail: barIcon,
          path: '/pages/subPackages/tag/tag'
        },
        {
          name: 'co-form',
          label: '表单',
          thumbnail: barIcon,
          path: '/pages/subPackages/form/form/form'
        },
        {
          name: 'co-tree',
          label: '树形控件',
          thumbnail: barIcon,
          path: '/pages/subPackages/tree/tree/tree'
        },
        {
          name: 'co-collapse',
          label: '折叠面板',
          thumbnail: barIcon,
          path: '/pages/subPackages/collapse/collapse/collapse'
        },
        {
          name: 'co-load',
          label: '自动加载',
          thumbnail: barIcon,
          path: '/pages/subPackages/load/load/load'
        },
        {
          name: 'co-popup',
          label: '弹出框',
          thumbnail: barIcon,
          path: '/pages/subPackages/popup/popup/popup'
        },
        {
          name: 'co-search',
          label: '搜索',
          thumbnail: barIcon,
          path: '/pages/subPackages/search/search/search'
        },
        {
          name: 'co-footer',
          label: '底部栏',
          thumbnail: barIcon,
          path: '/pages/subPackages/footer/footer/footer'
        },
        {
          name: 'co-step',
          label: '步骤条',
          thumbnail: barIcon,
          path: '/pages/subPackages/step/step/step'
        },
        {
          name: 'co-select-page',
          label: '选择页',
          thumbnail: barIcon,
          path: '/pages/subPackages/select-page/select-page/select-page'
        },
        {
          name: 'co-menu',
          label: '菜单弹框',
          thumbnail: barIcon,
          path: '/pages/subPackages/menu/menu/menu'
        },
        {
          name: 'co-alert',
          label: '提示',
          thumbnail: barIcon,
          path: '/pages/subPackages/alert/alert/alert'
        },
      ],
    }
  },
  methods: {
    handleClick(e) {
      uni.navigateTo({
        url: e.path
      })
    }
  },
}
</script>

<style lang="scss" scoped>
.index-page {
	.banner {
		padding: 24rpx;
		height: 234rpx;

		.image {
			width: 100%;
			height: 100%;
			border-radius: 20rpx;
			overflow: hidden;
		}
	}
}
</style>
