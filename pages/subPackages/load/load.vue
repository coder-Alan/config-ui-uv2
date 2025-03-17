<template>
  <view class="co-default-page">
    <co-search
      v-model="searchData"
      input-field="searchKey"
      default-button
      @search="onSearch"
    ></co-search>
    <co-load
      ref="loadRef"
      v-model="list"
      :load="loadEvent"
      :search-data="searchData"
    >
      <view v-for="item in list" :key="item.name">{{ item.name }}</view>
    </co-load>
  </view>
</template>

<script>
export default {
  data() {
    return {
      list: [],
      searchData: {
        searchKey: '',
      },
    }
  },
  methods: {
    onSearch() {
      this.$refs.loadRef.search()
    },
    loadEvent(params) {
      console.log(params)

      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve({
            list: [
              { name: '张三' },
              { name: '李四' },
              { name: '王五' },
              { name: '赵六' },
              { name: '钱七' },
            ],
            totalPage: 1
          })
        }, 5000)
      })
    }
  },
}
</script>
