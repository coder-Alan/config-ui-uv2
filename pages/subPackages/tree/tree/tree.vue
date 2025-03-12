<template>
  <view class="co-default-page">

    <view class="title">基础用法</view>
    <co-tree :data="data1" @click="onClick1"></co-tree>

    <view class="title">可选择</view>
    <co-tree :data="data1" show-checkbox only-leaf multiple @check="onCheck1"></co-tree>

    <view class="title">懒加载</view>
    <co-tree :data="data2" show-checkbox lazy multiple :load="loadEvent"></co-tree>

    <view class="title">默认选中</view>
    <co-tree :data="data1" :default-value="defaultValue1" show-checkbox multiple @check="onCheck4"></co-tree>

  </view>
</template>

<script>
export default {
  data() {
    return {
      data1: [
        {
          id: '1',
          label: 'Level 1',
          children: [
            {
              id: '1-1',
              label: 'Level 1-1',
              children: [
                {
                  id: '1-1-1',
                  label: 'Level 1-1-1'
                }
              ]
            },
            {
              id: '1-2',
              label: 'Level 1-2',
              children: [
                {
                  id: '1-2-1',
                  label: 'Level 1-2-1'
                }
              ]
            }
          ]
        },
        {
          id: '2',
          label: 'Level 2',
          children: [
            {
              id: '2-1',
              label: 'Level 2-1',
              children: [
                {
                  id: '2-1-1',
                  label: 'Level 2-1-1'
                },
                {
                  id: '2-1-2',
                  label: 'Level 2-1-2'
                }
              ]
            },
            {
              id: '2-2',
              label: 'Level 2-2',
              children: [
                {
                  id: '2-2-1',
                  label: 'Level 2-2-1'
                }
              ]
            }
          ]
        },
        {
          id: '3',
          label: 'Level 3',
          children: []
        },
        {
          id: '4',
          label: 'Level 4'
        }
      ],
      checkData1: {},
      defaultValue1: ['1-1-1', '2-1-1'],
      data2: [
        {
          id: '1',
          label: 'Level 1',
        }
      ]
    }
  },
  methods: {
    onCheck1(...args) {
      console.log('基本用法选择的数据', ...args)
    },
    onCheck4(...args) {
      console.log('默认选中', ...args)
    },
    onClick1(e) {
      console.log('基本用法点击的数据', e)
    },
    loadEvent(id) {
      return new Promise((resolve) => {
        setTimeout(() => {
          const list = []
          for (let i = 1; i <= 3; i++) {
            list.push({
              id: `${id}-${i}`,
              label: `Level ${id}-${i}`,
              isLeaf: i === 3
            })
          }
          resolve(list)
        }, 3000)
      })
    }
  }
}
</script>
