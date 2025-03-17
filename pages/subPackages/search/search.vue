<template>
  <view class="co-default-page search">
    
    <view class="title">基本用法，默认自动搜索</view>
    <co-search v-model="searchData1" :fixed="false"></co-search>

    <view class="title">手动点击搜索按钮搜索</view>
    <co-search default-button :fixed="false"></co-search>
    
    <view class="title">placeholder</view>
    <co-search placeholder="自定义placeholder" placeholder-color="#F76260" :fixed="false"></co-search>

    <view class="title">筛选条件</view>
    <co-search filter :filter-options="filterOptions" default-button :fixed="false"></co-search>
    
    <view class="title">顶部插槽</view>
    <co-search default-button :fixed="false">
      <template #searchTop>
        <view style="background: #4cd964;">我是顶部插槽</view>
      </template>
    </co-search>
    
    <view class="title">底部插槽</view>
    <co-search default-button :fixed="false">
      <template #searchBottom>
        <view style="background: #f0ad4e;">我是底部插槽</view>
      </template>
    </co-search>
    
    <view class="title">搜索栏的工具插槽</view>
    <co-search default-button :fixed="false">
      <template #toolbar>
        <co-svg-icon
          icon="download"
          color="#1689F5"
          size="22"
          class="co-padding-left-24"
        ></co-svg-icon>
      </template>
    </co-search>
    
    <view class="title">过滤条件的底部自定义按钮插槽</view>
    <co-search
      ref="search"
      v-model="searchData2"
      input-field="searchKey"
      default-button
      filter
      :filter-options="filterOptions"
      :fixed="false"
    >
      <template #filterFooter>
        <view class="confirm co-flex-center" @click="confirm">确定</view>
      </template>
    </co-search>
    
  </view>
</template>

<script>
export default {
  data() {
    return {
      searchData1: {
        searchText: '你好'
      },
      searchData2: {
        searchKey: '自定义字段'
      },
      filterOptions: [
        {
          field: 'text',
          label: 'text',
          component: 'Normal',
          labelType: 'input',
          inputType: 'text'
        },
        {
          field: 'time',
          label: 'time',
          component: 'Picker',
          pickerType: 'time'
        },
      ]
    }
  },
  methods: {
    confirm() {
      console.log(this.searchData2)
      this.$refs.search.searchEvent()
    }
  }
}
</script>

<style lang="scss" scoped>
.search {
  padding-bottom: 50vh;
  
  .confirm {
    height: 88rpx;
    border-top: 1rpx solid #EEEEEE;
    color: #fff;
    background: #1689F5;
  }
}
</style>
