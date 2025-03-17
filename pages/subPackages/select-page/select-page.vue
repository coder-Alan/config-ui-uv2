<template>
  <view>
    <co-select-page
      :search-data.sync="searchData"
      :load="loadEvent"
      filter
      :filter-options="filterOptions"
      :default-value="defaultValue"
      multiple
      @confirm="onConfirm"
    ></co-select-page>
  </view>
</template>

<script>
export default {
  data() {
    return {
      searchData: {
        searchText: ''
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
      ],
      defaultValue: [
        { label: '选项3', value: '3' },
        { label: '选项4', value: '4' },
        { label: '选项5', value: '5' },
      ],
    }
  },
  methods: {
    loadEvent(params) {
      console.log(params)

      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve({
            list: [
              { label: '选项1', value: '1' },
              { label: '选项2', value: '2' },
              { label: '选项3', value: '3' },
              { label: '选项4', value: '4' },
              { label: '选项5', value: '5' },
              { label: '选项6', value: '6' },
              { label: '选项7', value: '7' },
              { label: '选项8', value: '8' },
              { label: '选项9', value: '9' },
              { label: '选项10', value: '10' },
              { label: '选项11', value: '11' },
              { label: '选项12', value: '12' },
              { label: '选项13', value: '13' },
            ],
            totalPage: 1,
          })
        }, 3000)
      })
    },
    onConfirm(e) {
      console.log(e)
    }
  },
}
</script>
