<template>
  <view class="co-default-page">
    <view class="co-flex-row co-padding-left-12 co-padding-right-12">
      <co-button class="co-flex-1" style="width: 100%;" type="warning" @click="layoutChange('horizontal')">横排</co-button>
      <co-button class="co-flex-1" style="width: 100%;" type="primary" @click="layoutChange('vertical')">竖排</co-button>
    </view>

    <view class="title">Text 纯文本</view>
    <co-form v-model="textFormData" :options="textOptions" @arrowClick="onArrowClick"></co-form>

    <view class="title">Input 输入框</view>
    <co-form v-model="inputFormData" :options="inputOptions"></co-form>

    <view class="title">Textarea 输入框</view>
    <co-form v-model="textareaFormData" :options="textareaOptions"></co-form>

    <view class="title">Radio 单选框</view>
    <co-form v-model="radioFormData" :options="radioOptions"></co-form>

    <view class="title">带对钩的单选框</view>
    <co-form v-model="gouFormData" :options="gouOptions"></co-form>

    <view class="title">Datetime 时间选择器</view>
    <co-form v-model="timeFormData" :options="timeOptions"></co-form>

    <view class="title">Dictionary 字典选择器</view>
    <co-form v-model="dictFormData" :options="dictOptions"></co-form>

    <view class="title">Area 省市区选择器</view>
    <co-form v-model="areaFormData" :options="areaOptions"></co-form>

    <view class="title">级联选择器</view>
    <co-form v-model="cascaderFormData" :options="cascaderOptions"></co-form>

    <view class="title">Upload 上传</view>
    <co-form v-model="uploadFormData" :options="uploadOptions"></co-form>

  </view>
</template>

<script>
export default {
  data() {
    return {
      layout: 'horizontal',
      textFormData: {
        arrow: '一般配合点击事件',
        text: '我是纯文本'
      },
      textOptions: [],
      inputFormData: {
        text: '输入框',
        number: 123,
        idcard: '110111199001011234',
        digit: 1.1,
        safePassword: 123456,
        nickname: '这是昵称',
        arrow: '选中后的值',
        text: '文本'
      },
      inputOptions: [],
      textareaFormData: {
        textarea: '长文本输入框',
      },
      textareaOptions: [],
      radioFormData: {
        radio: 'Y'
      },
      radioOptions: [],
      gouFormData: {
        gou1: 'Y',
        gou2: 'Y',
        gou3: 'Y'
      },
      gouOptions: [],
      timeFormData: {},
      timeOptions: [],
      dictFormData: {
        dict: '1'
      },
      dictOptions: [],
      uploadFormData: {},
      uploadOptions: [],
      cascaderFormData: {},
      cascaderOptions: [],
      areaFormData: {},
      areaOptions: [],
    }
  },
  onLoad() {
    this.layoutChange('horizontal')
  },
  methods: { 
    layoutChange(type) {
      this.layout = type
      this.setTextFormOptions()
      this.setInputFormOptions()
      this.setTextareaFormOptions()
      this.setRadioFormOptions()
      this.setGouFormOptions()
      this.setTimeFormOptions()
      this.setDictFormOptions()
      this.setAreaFormOptions()
      this.setUploadFormOptions()
      this.setCascaderFormOptions()
    },
    setOptionsLayout(options) {
      for (let i = 0; i < options.length; i++) {
        options[i].layout = this.layout
      }
      return options
    },
    setTextFormOptions() {
      const textOptions = [
        {
          field: 'text',
          label: 'text',
          component: 'Normal',
          labelType: 'text',
          required: true
        },
        {
          field: 'arrow',
          label: 'arrow',
          component: 'Normal',
          labelType: 'arrow',
          methodName: 'arrowClick'
        }
      ]
      this.textOptions = this.setOptionsLayout(textOptions)
    },
    setInputFormOptions() {
      const inputOptions = [
        {
          field: 'text',
          label: 'text',
          component: 'Normal',
          labelType: 'input',
          inputType: 'text'
        },
        {
          field: 'number',
          label: 'number',
          component: 'Normal',
          labelType: 'input',
          inputType: 'number',
        },
        {
          field: 'idcard',
          label: 'idcard',
          component: 'Normal',
          labelType: 'input',
          inputType: 'idcard'
        },
        {
          field: 'digit',
          label: 'digit',
          component: 'Normal',
          labelType: 'input',
          inputType: 'digit'
        },
        {
          field: 'safePassword',
          label: 'safe-password',
          component: 'Normal',
          labelType: 'input',
          inputType: 'safe-password'
        },
        {
          field: 'nickname',
          label: 'nickname',
          component: 'Normal',
          labelType: 'input',
          inputType: 'nickname'
        }
      ]
      this.inputOptions = this.setOptionsLayout(inputOptions)
    },
    setTextareaFormOptions() {
      const textareaOptions = [
        {
          field: 'textarea',
          label: 'textarea',
          component: 'Normal',
          labelType: 'textarea'
        }
      ]
      this.textareaOptions = this.setOptionsLayout(textareaOptions)
    },
    setRadioFormOptions() {
      const radioOptions = [
        {
          field: 'radio',
          label: 'radio',
          component: 'Normal',
          labelType: 'radio',
          radioList: [
            {
              label: '正确',
              value: 'Y'
            },
            {
              label: '错误',
              value: 'N'
            },
            {
              label: '未知',
              value: 'U'
            },
            {
              label: '未定义',
              value: 'W'
            },
            {
              label: '未测试',
              value: 'T'
            }
          ]
        }
      ]
      this.radioOptions = this.setOptionsLayout(radioOptions)
    },
    setGouFormOptions() {
      const gouOptions = [
        {
          field: 'gou1',
          label: 'gou1',
          component: 'CheckButton',
          type: 'primary',
          list: [
            { label: '是', value: 'Y' },
            { label: '否', value: 'N' }
          ]
        },
        {
          field: 'gou2',
          label: 'gou2',
          component: 'CheckButton',
          type: 'danger',
          list: [
            { label: '是', value: 'Y' },
            { label: '否', value: 'N' }
          ]
        },
        {
          field: 'gou3',
          label: 'gou3',
          component: 'CheckButton',
          type: 'warning',
          list: [
            { label: '是', value: 'Y' },
            { label: '否', value: 'N' }
          ]
        }
      ]
      this.gouOptions = this.setOptionsLayout(gouOptions)
    },
    setTimeFormOptions() {
      const timeOptions = [
        {
          field: 'time',
          label: 'time',
          component: 'Picker',
          pickerType: 'time'
        },
        {
          field: 'month',
          label: 'month',
          component: 'Picker',
          pickerType: 'month'
        },
        {
          field: 'date',
          label: 'date',
          component: 'Picker',
          pickerType: 'date'
        },
        {
          field: 'datetime',
          label: 'datetime',
          component: 'Picker',
          pickerType: 'datetime'
        },
        {
          field: 'daterange',
          label: 'daterange',
          component: 'Picker',
          pickerType: 'daterange'
        },
        {
          field: 'datetimerange',
          label: 'datetimerange',
          component: 'Picker',
          pickerType: 'datetimerange'
        }
      ]
      this.timeOptions = this.setOptionsLayout(timeOptions)
    },
    setDictFormOptions() {
      const dictOptions = [
        {
          field: 'dict',
          label: '字典',
          component: 'Picker',
          pickerType: 'dictionary',
          dictCode: 'DICT_NAME_CODE',
        },
      ]
      this.dictOptions = this.setOptionsLayout(dictOptions)
    },
    setAreaFormOptions() {
      const areaOptions = [
        {
          field: 'area',
          label: '地区',
          component: 'Picker',
          pickerType: 'area',
          emitPath: true,
        },
      ]
      this.areaOptions = this.setOptionsLayout(areaOptions)
    },
    setCascaderFormOptions() {
      const cascaderOptions = [
        {
          field: 'cascader',
          label: 'cascader',
          component: 'Cascader',
          options: [
            {
              value: 'guide',
              label: 'Guide',
              children: [
                {
                  value: 'disciplines',
                  label: 'Disciplines',
                  children: [
                    {
                      value: 'consistency',
                      label: 'Consistency',
                    },
                    {
                      value: 'feedback',
                      label: 'Feedback',
                    },
                    {
                      value: 'efficiency',
                      label: 'Efficiency',
                    },
                    {
                      value: 'controllability',
                      label: 'Controllability',
                    },
                  ],
                },
                {
                  value: 'navigation',
                  label: 'Navigation',
                  children: [
                    {
                      value: 'side nav',
                      label: 'Side Navigation',
                    },
                    {
                      value: 'top nav',
                      label: 'Top Navigation',
                    },
                  ],
                },
              ]
            },
            {
              value: 'resource',
              label: 'Resource',
              children: [],
            },
          ]
        },
      ]
      this.cascaderOptions = this.setOptionsLayout(cascaderOptions)
    },
    setUploadFormOptions() {
      const uploadOptions = [
        {
          field: 'upload',
          label: '图片',
          component: 'Upload',
          uploadType: 'image',
          max: 2
        },
        {
          field: 'upload2',
          label: '文件',
          component: 'Upload',
          uploadType: 'file',
          max: 5
        }
      ]
      this.uploadOptions = uploadOptions
    },
    onArrowClick(e) {
      console.log(e)
      uni.showToast({
        title: '我被点击了',
        icon: 'none'
      })
    }
  }
}
</script>
