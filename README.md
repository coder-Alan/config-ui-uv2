<h3 align="center" style="margin: 30px 0 30px;font-weight: bold;font-size:40px;">Config UI</h3>
<h3 align="center">可动态配置的UI组件库</h3>

[![stars](https://img.shields.io/github/stars/coder-Alan/config-ui-uv2?style=flat-square&logo=GitHub)](https://github.com/coder-Alan/config-ui-uv2)
[![forks](https://img.shields.io/github/forks/coder-Alan/config-ui-uv2?style=flat-square&logo=GitHub)](https://github.com/coder-Alan/config-ui-uv2)
[![issues](https://img.shields.io/github/issues/coder-Alan/config-ui-uv2?style=flat-square&logo=GitHub)](https://github.com/coder-Alan/config-ui-uv2)
[![release](https://img.shields.io/github/v/release/coder-Alan/config-ui-uv2?style=flat-square)](https://gitee.com/coder-Alan/config-ui-uv2/releases)
[![license](https://img.shields.io/github/license/umicro/uView2.0?style=flat-square)](https://en.wikipedia.org/wiki/MIT_License)

## 说明

config UI，是以配置驱动的UI组件库，涵盖常用的组件，通过简单的配置即可生成内容丰富、功能强大的表单。

## 安装

#### **uni-app插件市场链接** —— [https://ext.dcloud.net.cn/plugin?id=22467](https://ext.dcloud.net.cn/plugin?id=22467)

## 引入

在 `App.vue` 文件引入 `scss`

```scss
<style lang="scss">
@import '@/uni_modules/config-ui/styles/common.scss';
@import '@/uni_modules/config-ui/styles/loading.scss';
</style>
```

在 `main.js` 文件进行仓库初始化

```js
// #ifndef VUE3
import Vue from 'vue'
import './uni.promisify.adaptor'

import ConfigStore from './uni_modules/config-ui/utils/config-store'

ConfigStore.init({
  dictConfig: {
    key: '', // 字典编码的字段名
    getFun: (code) => {}, // {Function} 获取字典的接口，args: code 字典编码
  },
  uploadConfig: {
    url: '', // 上传接口
    header: {}, // 请求头
    success: ({ res, resolve, reject }) => {}, // {Function} 上传成功后的回调，args: res、resolve、reject，需返回 resolve 或者 reject。
  },
  downloadConfig: {
    header: {}, // HTTP 请求的 Header，Header 中不能设置 Referer
    timeout: 1000 * 60 * 5, // 5分钟
    filePath: '', // 指定文件下载后存储的路径 (本地路径)
    getUrlFun: (fileId) => {}, // {Function} 获取下载路径，args: fileId 文件id，需返回 String 类型 url。
  },
  geoConfig: {
    key: '', // 地理信息编码的字段名
    value: '', // 地理信息编码对应的中文名的字段名
    getFun: (code) => {}, // {Function} 获取地理信息接口, args: code 区域编码, args 为空时查全部省份，需返回 Promise.resolve(Array) 类型。
  },
})

Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
  ...App
})
app.$mount()
// #endif
```



## 使用方法

配置easycom规则后，自动按需引入，无需`import`组件，直接引用即可。

```html
<template>
	<co-button type="primary">按钮</co-button>
</template>
```

## 文档说明

- ### co-form

------

#### Attributes

| 属性名        | 说明                                                    | 类型          | 默认值                  |
| ------------- | ------------------------------------------------------- | ------------- | ----------------------- |
| v-model       | 表单数据对象                                            | object        | {}                      |
| options       | 表单项配置，具体配置见下表                              | array[object] | []                      |
| is-format     | 是否需要格式化数据，如果是，只保留 options 属性里的字段 | boolean       | true                    |
| before-upload | 上传前的回调函数                                        | Function      | () => Promise.resolve() |
| before-remove | 删除前的回调函数                                        | Function      | () => Promise.resolve() |

##### options

| 属性       | 说明                                                   | 类型    | 默认值 |
| ---------- | ------------------------------------------------------ | ------- | ------ |
| field      | 字段名                                                 | string  | -      |
| component  | 所需要用到的组件名，具体配置见下表                     | string  | -      |
| slot       | 是否使用插槽                                           | boolean | -      |
| slotName   | 插槽名称                                               | string  | -      |
| hidden     | 是否显示该表单项，比 showConfig 属性的优先级高         | boolean | -      |
| showConfig | 显示条件，具体配置见下表                               | object  | -      |
| required   | 是否必填                                               | boolean | false  |
| rule       | 表单验证规则，具体配置见下表，更详细可查看 validate.js | object  | -      |
| ...        | 其余配置为对应组件的配置，具体配置见下表               |         |        |

##### options.showConfig

| 属性    | 说明                                 | 类型          | 默认值 |
| ------- | ------------------------------------ | ------------- | ------ |
| type    | 对比方式，具体配置见下表             | string        | all    |
| options | 显示条件的配置项集合，具体配置见下表 | array[object] | -      |

##### options.showConfig.options

| 属性  | 说明                                                         | 类型                 | 默认值 |
| ----- | ------------------------------------------------------------ | -------------------- | ------ |
| field | 表单里某个对比字段，如果是数组，说明这个字段是对象里面的某个字段 | string/array[string] | -      |
| terms | 对比条件，具体配置见下表                                     | string               | ===    |
| value | 表单里某个对比字段的值，如果是数组，说明这个字段是对象里面的某个字段 | string/number/array  | -      |

##### options.rule

| 属性    | 说明                 | 类型   | 默认值 |
| ------- | -------------------- | ------ | ------ |
| reg     | 验证规则，正则表达式 | RegExp | -      |
| message | 验证失败提示信息     | string | -      |

##### options.component

| 类型        | 说明                        |
| ----------- | --------------------------- |
| Normal      | 代表 CoFormNormal 组件      |
| Picker      | 代表 CoFormPicker 组件      |
| Cascader    | 代表 CoFormCascader 组件    |
| Upload      | 代表 CoFormUpload 组件      |
| CheckButton | 代表 CoFormCheckButton 组件 |

##### options.showConfig.type

| 类型   | 说明               |
| ------ | ------------------ |
| all    | 所有条件满足才显示 |
| anyOne | 任意一项满足就显示 |

##### options.showConfig.options.terms

| 类型      | 说明     |
| --------- | -------- |
| ===       | 等于     |
| !==       | 不等于   |
| >         | 大于     |
| >=        | 大于等于 |
| <         | 小于     |
| <=        | 小于等于 |
| includes  | 包含     |
| !includes | 不包含   |
| null      | 为空     |
| !null     | 不为空   |

#### Events

| 事件名         | 说明                                                         | 回调参数                             |
| -------------- | ------------------------------------------------------------ | ------------------------------------ |
| change         | 当某个字段的值发生变化时触发                                 | 共两个参数，依次为字段名、改变后的值 |
| blur           | 当 CoFormNormal 组件里的 textarea 组件失去焦点时触发         | -                                    |
| clear          | 当点击 CoFormNormal 组件和 CoFormPicker 组件的清除按钮时触发 | 共一个参数，为当前点击的配置项       |
| * 自定义事件名 | 对应组件的触发事件                                           | 共一个参数，为当前触发的配置项       |

#### Slots

| 插槽名         | 说明                                                         |
| -------------- | ------------------------------------------------------------ |
| append         | 输入框后置内容，当配置项的 labelType = input 且 slot = true 且 slotName = append  时生效 |
| * 自定义插槽名 | 当配置项的 component != Normal/Picker/Cascader/Upload/CheckButton，或者 labelType = text 且 slot = true，或者 labelType != input/arrow/text/textarea/radio 时生效 |



- [ ] **co-form-label**

Attributes

| 属性名 | 说明   | 类型   | 默认值 |
| ------ | ------ | ------ | ------ |
| config | 配置项 | object | -      |

config

| 属性          | 说明                   | 类型          | 默认值     |
| ------------- | ---------------------- | ------------- | ---------- |
| label         | 标签内容               | string        | -          |
| labelColor    | 标签颜色               | string        | -          |
| labelSize     | 标签大小               | string        | -          |
| layout        | 标签布局               | string        | horizontal |
| required      | 是否必填，用于标记星号 | boolean       | false      |
| labelIconList | 标签图标列表           | array[object] | -          |
| boxStyle      | 标签容器样式           | string        | -          |

config.labelIconList

| 属性   | 说明                   | 类型   | 默认值 |
| ------ | ---------------------- | ------ | ------ |
| icon   | 图标                   | string | -      |
| color  | 图标颜色               | string | -      |
| size   | 图标大小               | string | -      |
| style  | 图标样式               | string | -      |
| method | 点击图标时触发的方法名 | string | -      |

Events

| 事件名    | 说明               | 回调参数                             |
| --------- | ------------------ | ------------------------------------ |
| iconClick | 点击标签图标时触发 | 共一个参数，为点中的图标配置的方法名 |



- [x] **co-form-normal**

Attributes

| 属性名  | 说明                     | 类型                  | 默认值 |
| ------- | ------------------------ | --------------------- | ------ |
| v-model | 表单内容数据             | string/number/boolean | -      |
| attrs   | 属性配置，具体配置见下表 | object                | -      |

attrs

| 属性             | 说明                                                         | 类型    | 默认值                                                       |
| ---------------- | ------------------------------------------------------------ | ------- | ------------------------------------------------------------ |
| labelType        | 标签类型，具体配置见下表                                     | string  | -                                                            |
| valueColor       | 值的颜色                                                     | string  | #333                                                         |
| borderAlign      | 边框位置，具体配置见下表                                     | string  | bottom                                                       |
| layout           | 标签位置，具体配置见下表                                     | string  | horizontal                                                   |
| disabled         | 是否禁用                                                     | boolean | false                                                        |
| placeholder      | 占位符内容                                                   | string  | -                                                            |
| placeholderColor | 占位符颜色                                                   | string  | #ccc                                                         |
| radioList        | 单项选择器的选择项列表                                       | array   | [ { label: '是', value: 'Y' }, { label: '否', value: 'N' }, ] |
| customStyle      | 自定义样式                                                   | string  | -                                                            |
| unit             | 单位，仅当 labelType 属性为 input/text 时生效                | string  | -                                                            |
| inputType        | input框的类型，仅当 labelType 属性为 input/text 时生效，具体配置见下表 | string  | text                                                         |
| maxlength        | 最大输入长度，设置为 -1 时不限制最大长度，仅当 labelType 属性为 textarea 时生效 | number  | -1                                                           |
| showTip          | 值为空时是否显示提示，仅当 labelType 属性为 arrow 时生效     | boolean | true                                                         |
| clear            | 是否显示清除按钮，仅当 labelType 属性为 arrow 时生效         | boolean | false                                                        |
| methodName       | 点击事件的回调名称，仅当 labelType 属性为 text/arrow 时生效  | string  | -                                                            |
| ellipsis         | 是否需要单行省略，仅当 labelType 属性为 text/arrow 时生效    | boolean | false                                                        |
| ...              | CoFormLabel 组件的属性                                       |         |                                                              |

attrs.labelType

| 类型     | 说明       |
| -------- | ---------- |
| input    | 输入框     |
| arrow    | 选择箭头   |
| text     | 文本       |
| textarea | 多行输入框 |
| radio    | 单项选择器 |

attrs.borderAlign

| 类型     | 说明     |
| :------- | -------- |
| top      | 上边框   |
| bottom   | 下边框   |
| vertical | 上下边框 |

attrs.layout

| 类型       | 说明       |
| ---------- | ---------- |
| horizontal | 标签在左侧 |
| vertical   | 标签在上方 |

attrs.inputType

| 类型          | 说明               |
| ------------- | ------------------ |
| text          | 文本输入键盘       |
| number        | 数字输入键盘       |
| digit         | 带小数点的数字键盘 |
| idcard        | 身份证输入键盘     |
| tel           | 电话输入键盘       |
| safe-password | 密码安全输入键盘   |
| nickname      | 昵称输入键盘       |

Events

| 事件名 | 说明                                                         | 回调参数                                       |
| ------ | ------------------------------------------------------------ | ---------------------------------------------- |
| blur   | 当 textarea 组件失去焦点时触发                               | -                                              |
| clear  | 当点击 Input 组件或者 Arrow 组件的清除按钮时触发             | 共一个参数，为当前的属性配置                   |
| click  | 当点击 CoFormLabel 组件图标或者点击 labelType 属性为 arrow/text 类型时触发 | 共两个参数，依次为触发的事件名、当前的属性配置 |

- [x] **co-form-picker**

Attributes

| 属性名  | 说明                     | 类型                       | 默认值 |
| ------- | ------------------------ | -------------------------- | ------ |
| v-model | 表单内容数据             | string/number/object/array | -      |
| attrs   | 属性配置，具体配置见下表 | object                     | -      |

attrs

| 属性       | 说明                                                         | 类型          | 默认值  |
| ---------- | ------------------------------------------------------------ | ------------- | ------- |
| pickerType | 选择器类型，具体配置见下表                                   | string        | default |
| returnType | 返回值类型，具体配置见下表                                   | string        | value   |
| label      | 标签内容，CoFormNormal、CoDictionaryPicker、CoPicker 组件的属性 | string        | -       |
| dictName   | 字典名称，CoDictionaryPicker 组件的属性                      | string        | -       |
| multiple   | 是否多选，CoDictionaryPicker、CoPicker 组件的属性            | boolean       | false   |
| required   | 是否必填，CoDictionaryPicker、CoPicker、CoDatetimePicker 组件的属性 | boolean       | -       |
| startDate  | 开始日期，CoDatetimePicker 组件的属性                        | string/number | -       |
| endDate    | 结束日期，CoDatetimePicker 组件的属性                        | string/number | -       |
| list       | 选项列表，CoPicker 组件的属性                                | array[object] | []      |
| labelKey   | 标签字段名，CoPicker 组件的属性                              | string        | label   |
| valueKey   | 值字段名，CoPicker 组件的属性                                | string        | value   |
| ...        | CoFormNormal 组件的属性                                      |               |         |

attrs.pickerType

| 类型          | 说明                                  |
| ------------- | ------------------------------------- |
| default       | 默认选择器 - CoPicker                 |
| dictionary    | 字典选择器 - CoDictionaryPicker       |
| time          | 时间选择器 - CoTimePicker             |
| month         | 年月选择器 - CoTimePicker             |
| date          | 日期选择器 - CoDatetimePicker         |
| datetime      | 日期时间选择器 - CoDatetimePicker     |
| daterange     | 日期范围选择器 - CoDatetimePicker     |
| datetimerange | 日期时间范围选择器 - CoDatetimePicker |
| area          | 地区选择器 - CoAreaPicker             |

attrs.returnType

| 类型   | 说明     |
| ------ | -------- |
| value  | 返回值   |
| label  | 返回标签 |
| object | 返回对象 |

Events

| 事件名         | 说明                                                         | 回调参数                     |
| -------------- | ------------------------------------------------------------ | ---------------------------- |
| clear          | 当点击 CoPicker 组件的清除按钮触发或者点击 CoFormNormal 组件里面的 Arrow 组件的清除按钮触发 | 共一个参数，为当前的属性配置 |
| * 自定义事件名 | 当点击 CoFormNormal 组件里面的 CoFormLabel 组件的图标触发    | 共一个参数，为当前的属性配置 |



- [x] **co-form-cascader**

Attributes

| 属性名  | 说明                     | 类型                       | 默认值 |
| ------- | ------------------------ | -------------------------- | ------ |
| v-model | 表单内容数据             | string/number/object/array | -      |
| attrs   | 属性配置，具体配置见下表 | object                     | -      |

attrs

| 属性          | 说明                                                         | 类型          | 默认值 |
| ------------- | ------------------------------------------------------------ | ------------- | ------ |
| disabled      | 是否禁用                                                     | boolean       | false  |
| options       | 数据列表                                                     | array[object] | []     |
| labelKey      | 标签字段名                                                   | string        | label  |
| valueKey      | 值字段名                                                     | string        | value  |
| returnType    | 选中的返回类型，具体配置见下表                               | string        | value  |
| showAllLevels | 是否显示选中值的完整路径                                     | boolean       | true   |
| emitPath      | 是否返回由该节点所在的各级菜单的值所组成的数组，若设置 false，则只返回该节点的值 | boolean       | true   |

attrs.returnType

| 类型   | 说明     |
| ------ | -------- |
| value  | 返回值   |
| object | 返回对象 |

Events

| 事件名         | 说明                                                         | 回调参数                     |
| -------------- | ------------------------------------------------------------ | ---------------------------- |
| clear          | 当点击 CoPicker 组件的清除按钮触发或者点击 CoFormNormal 组件里面的 Arrow 组件的清除按钮触发 | 共一个参数，为当前的属性配置 |
| * 自定义事件名 | 当点击 CoFormNormal 组件里面的 CoFormLabel 组件的图标触发    | 共一个参数，为当前的属性配置 |



- [x] **co-form-upload**

Attributes

| 属性名        | 说明                                                         | 类型                 | 默认值 |
| ------------- | ------------------------------------------------------------ | -------------------- | ------ |
| v-model       | 表单内容数据                                                 | array[object]/string | -      |
| attrs         | 属性配置，具体配置见下表                                     | object               | -      |
| before-upload | 上传文件之前的钩子，参数为上传的文件，若返回 Promise 且被 reject，则停止上传。 | function             | -      |
| before-remove | 删除文件之前的钩子，参数为上传的文件和上传列表，若返回 Promise 且被 reject，则停止上传。 | function             | -      |

attrs

| 属性                         | 说明                                                       | 类型          | 默认值                                                       |
| ---------------------------- | ---------------------------------------------------------- | ------------- | ------------------------------------------------------------ |
| uploadType                   | 上传类型，具体配置见下表                                   | string        | image                                                        |
| uploadConfig                 | 上传配置                                                   | object        | { count: 1, sourceType: ['album', 'camera'], sizeType: ['compressed'], } |
| max                          | 最多上传多少张图片                                         | string        | 1                                                            |
| required                     | 是否必填                                                   | boolean       | false                                                        |
| disabled                     | 是否禁用                                                   | boolean       | false                                                        |
| placeholder                  | 待上传时的占位符，仅当 uploadType 属性为 file/video 时生效 | string        | -                                                            |
| customStyle                  | 自定义样式                                                 | string        | -                                                            |
| customActionSheet            | 自定义菜单按钮，格式为[{label: '\*', value: '\*'}]         | array[object] | []                                                           |
| allowOfflineUpload           | 是否允许在断网情况下上传                                   | boolean       | false                                                        |
| allowWatermarkOriginalUpload | 是否允许水印上传后再上传水印原图                           | boolean       | false                                                        |
| ...                          | CoFormLabel 组件的属性                                     |               |                                                              |

attrs.uploadType

| 类型  | 说明 |
| ----- | ---- |
| image | 图片 |
| file  | 文件 |
| video | 视频 |

Events

| 事件名            | 说明                                              | 回调参数                                   |
| ----------------- | ------------------------------------------------- | ------------------------------------------ |
| watermarkOriginal | 水印原图上传完成后触发                            | 共一个参数，为包含水印数据和原图数据的对象 |
| fulfilled         | 上传成功后触发                                    | 共一个参数，为上传成功后的数据             |
| uploadRemove      | 删除上传文件后触发                                | 共一个参数，为当前删除的文件数据           |
| * 自定义事件名    | 当点击 CoFormLabel 组件的图标触发                 | 共一个参数，为当前的属性配置               |
| * 自定义事件名    | 设置 customActionSheet 属性时，点击自定义菜单触发 | -                                          |



- [x] **co-form-check-button**

Attributes

| 属性名  | 说明                     | 类型                         | 默认值 |
| ------- | ------------------------ | ---------------------------- | ------ |
| v-model | 表单内容数据             | string/number/boolean/object | -      |
| attrs   | 属性配置，具体配置见下表 | object                       | -      |

attrs

| 属性        | 说明                     | 类型          | 默认值                                                       |
| ----------- | ------------------------ | ------------- | ------------------------------------------------------------ |
| type        | 按钮类型，具体配置见下表 | string        | primary                                                      |
| list        | 数据列表                 | array[object] | [ { label: '是', value: 'Y' }, { label: '否', value: 'N' } ] |
| labelKey    | 标签字段名               | string        | label                                                        |
| valueKey    | 值字段名                 | string        | value                                                        |
| customStyle | 自定义样式               | string        | -                                                            |
| disabled    | 是否禁用                 | boolean       | false                                                        |
| ...         | CoFormLabel 组件的属性   |               |                                                              |

attrs.type

| 类型    | 说明     |
| :------ | -------- |
| primary | 主要按钮 |
| warning | 警告按钮 |
| danger  | 危险按钮 |

Events

| 事件名         | 说明                              | 回调参数                     |
| -------------- | --------------------------------- | ---------------------------- |
| * 自定义事件名 | 当点击 CoFormLabel 组件的图标触发 | 共一个参数，为当前的属性配置 |



- ### co-svg-icon

------

#### Attributes

| 属性名       | 说明             | 类型          | 默认值 |
| ------------ | ---------------- | ------------- | ------ |
| icon         | 图标名称         | string        | -      |
| size         | 图标大小         | string/number | 16     |
| color        | 图标颜色，16进制 | string        | #999   |
| svg          | 自定义svg        | string        | -      |
| custom-class | 自定义class      | string/array  | -      |

#### Events

| 事件名 | 说明         | 回调参数 |
| ------ | ------------ | -------- |
| click  | 当点击时触发 | -        |



- ### co-button

------

#### Attributes

| 属性名   | 说明           | 类型    | 默认值  |
| -------- | -------------- | ------- | ------- |
| type     | 按钮类型       | string  | default |
| plain    | 是否为朴素按钮 | boolean | false   |
| disabled | 是否禁用按钮   | boolean | false   |
| icon     | 图标名称       | string  | -       |
| style    | 自定义样式     | string  | -       |

##### type

| 类型    | 说明     |
| ------- | -------- |
| default | 默认按钮 |
| primary | 主要按钮 |
| success | 成功按钮 |
| info    | 信息按钮 |
| warning | 警告按钮 |
| danger  | 危险按钮 |

#### Events

| 事件名 | 说明         | 回调参数 |
| ------ | ------------ | -------- |
| click  | 当点击时触发 | -        |

#### Slots

| 插槽名  | 说明           |
| ------- | -------------- |
| default | 自定义默认内容 |



- ### co-tag

------

#### Attributes

| 属性名   | 说明                     | 类型    | 默认值  |
| -------- | ------------------------ | ------- | ------- |
| type     | 标签类型，具体配置见下表 | string  | primary |
| effect   | 标签效果，具体配置见下表 | string  | light   |
| hit      | 是否有边框描边           | boolean | false   |
| ellipsis | 是否省略                 | boolean | false   |
| style    | 标签样式                 | string  | -       |

##### type

| 类型    | 说明 |
| ------- | ---- |
| primary | 主要 |
| success | 成功 |
| info    | 信息 |
| warning | 警告 |
| danger  | 危险 |

##### effect

| 类型  | 说明 |
| ----- | ---- |
| light | 亮色 |
| dark  | 暗色 |
| plain | 朴素 |

#### Slots

| 插槽名  | 说明           |
| ------- | -------------- |
| default | 自定义默认内容 |



- ### co-alert

------

#### Attributes

| 属性名           | 说明                       | 类型    | 默认值 |
| ---------------- | -------------------------- | ------- | ------ |
| title            | Alert 标题                 | string  | -      |
| type             | Alert 类型，具体配置见下表 | string  | info   |
| color            | 文字颜色                   | string  | -      |
| background-color | 背景颜色                   | string  | -      |
| custom-style     | 自定义样式                 | string  | -      |
| show-icon        | 是否显示图标               | boolean | true   |
| icon             | 自定义图标                 | string  | -      |
| icon-size        | 图标大小                   | number  | 18     |
| icon-color       | 图标颜色                   | string  | -      |
| effect           | 主题                       | string  | light  |

##### type

| 类型    | 说明 |
| ------- | ---- |
| success | 成功 |
| info    | 信息 |
| warning | 警告 |
| error   | 错误 |

##### effect

| 类型  | 说明 |
| ----- | ---- |
| light | 浅色 |
| dark  | 深色 |



- ### co-menu

------

#### Events

| 事件名 | 说明             | 回调参数                       |
| ------ | ---------------- | ------------------------------ |
| click  | 点击菜单项时触发 | 共一个参数，为点击的菜单项索引 |

#### Slots

| 插槽名  | 说明           | 子标签       |
| ------- | -------------- | ------------ |
| default | 自定义默认内容 | co-menu-item |
| content | 自定义区域内容 | -            |



- ### co-menu-item

------

#### Attributes

| 属性名 | 说明             | 类型          | 默认值 |
| ------ | ---------------- | ------------- | ------ |
| index  | 菜单项的唯一标志 | string/number | -      |

#### Slots

| 插槽名  | 说明           | 类型 |
| ------- | -------------- | ---- |
| default | 自定义默认内容 | -    |



- ### co-tree

------

#### Attributes

| 属性名        | 说明                                                         | 类型             | 默认值 |
| ------------- | ------------------------------------------------------------ | ---------------- | ------ |
| default-value | 默认值，单选时为id，多选时为id数组                           | string/array[id] | -      |
| data          | 展示数据                                                     | array[object]    | []     |
| props         | 配置选项，具体配置见下表                                     | object           | -      |
| show-checkbox | 是否显示多选框，节点是否可被选择                             | boolean          | false  |
| only-leaf     | 是否仅在叶子节点才显示多选框，仅当 showCheckbox 属性为 true 时生效 | boolean          | false  |
| multiple      | 是否多选                                                     | boolean          | false  |
| lazy          | 是否启用懒加载                                               | boolean          | false  |
| load          | 加载子树数据的方法，仅当 lazy 属性为 true 时生效             | Function         | -      |
| disabled      | 复选框禁用数组，存储 id，仅当 showCheckbox 属性为 true 时生效 | array[id]        | []     |
| id-separator  | id分隔符，默认为 - ，如果设置了 defaultValue 默认值，务必设置 idSeparator | string           | -      |

#### props

| props    | 说明                                                       | 类型   | 默认值   |
| -------- | ---------------------------------------------------------- | ------ | -------- |
| id       | 指定节点id为节点对象的某个属性值                           | string | id       |
| label    | 指定节点标签为节点对象的某个属性值                         | string | label    |
| children | 指定子树为节点对象的某个属性值                             | string | children |
| isLeaf   | 指定节点是否为叶子节点，仅当 lazy 属性为 true 的情况下生效 | string | isLeaf   |

#### Events

| 事件名       | 说明                             | 回调参数                                                     |
| ------------ | -------------------------------- | ------------------------------------------------------------ |
| check        | 点击的节点选中状态发生变化时触发 | 共三个参数，依次为当前节点数据、当前节点是否被选中、当前所有已选中的节点数据 |
| check-change | 相关的节点选中状态发生变化时触发 | 共三个参数，依次为当前节点数据、当前节点是否被选中、当前所有已选中的节点数据 |
| click        | 点击叶子节点时触发               | 共一个参数，为当前节点数据                                   |



- ### co-popup

------

#### Attributes

| 属性名               | 说明                                          | 类型                | 默认值 |
| -------------------- | --------------------------------------------- | ------------------- | ------ |
| v-model              | 是否显示弹框                                  | boolean             | false  |
| placement            | 弹出位置                                      | top\|bottom\|center | bottom |
| position             | 定位方式                                      | fixed\|absolute     | fixed  |
| fixed                | 弹出距离                                      | string/number       | -      |
| height               | 内容高度                                      | string/number       | unset  |
| width                | 弹框宽度，仅当 placement 属性为 center 时生效 | string/number       | 80vw   |
| round                | 是否显示圆角                                  | boolean             | false  |
| modal                | 是否显示遮罩                                  | boolean             | true   |
| close-on-click-modal | 是否可以通过点击遮罩层关闭                    | boolean             | true   |

#### Events

| 事件名 | 说明             | 回调参数 |
| ------ | ---------------- | -------- |
| open   | 当弹框打开时触发 | -        |
| opened | 当弹框打开后触发 | -        |
| close  | 当弹框关闭时触发 | -        |
| closed | 当弹框关闭后触发 | -        |

#### Slots

| 插槽名  | 说明           | 类型 |
| ------- | -------------- | ---- |
| default | 自定义默认内容 | -    |



- ### co-collapse

------

#### Attributes

| 属性名        | 说明               | 类型        | 默认值 |
| ------------- | ------------------ | ----------- | ------ |
| title         | 标题               | string      | 标题   |
| custom-class  | 自定义class        | string      | -      |
| open          | 是否默认是打开状态 | boolean     | false  |
| icon-position | 展开图标的位置     | left\|right | right  |

#### Events

| 事件名 | 说明                 | 回调参数 |
| ------ | -------------------- | -------- |
| open   | 当折叠面板打开时触发 | -        |
| close  | 当折叠面板关闭时触发 | -        |

#### Slots

| 插槽名  | 说明                   | 类型 |
| ------- | ---------------------- | ---- |
| default | 自定义默认内容         | -    |
| title   | 自定义标题             | -    |
| right   | 自定义折叠栏的右侧部分 | -    |



- ### co-search

------

#### Attributes

| 属性名            | 说明                                                         | 类型          | 默认值           |
| ----------------- | ------------------------------------------------------------ | ------------- | ---------------- |
| v-model           | 搜索条件                                                     | object        | {}               |
| input-field       | 输入框的搜索值字段名                                         | string        | searchText       |
| placeholder       | 输入框的占位符                                               | string        | 请输入搜索关键字 |
| placeholder-color | 输入框的占位符颜色                                           | string        | #999             |
| color             | 输入框的文字颜色                                             | string        | #333             |
| background        | 输入框的背景颜色                                             | string        | #fff             |
| border            | 是否需要边框                                                 | boolean       | true             |
| filter            | 是否需要搜索条件                                             | boolean       | false            |
| filter-options    | 搜索条件的表单配置                                           | array[object] | []               |
| default-button    | 是否需要默认的搜索按钮，不需要时将会自动搜索                 | boolean       | false            |
| is-format         | 是否格式化搜索条件，如果是，只保留 filterOptions 属性里的字段 | boolean       | true             |
| fixed             | 是否固定在顶部                                               | boolean       | true             |

#### Events

| 事件名         | 说明                                              | 回调参数 |
| -------------- | ------------------------------------------------- | -------- |
| search         | 点击搜索按钮或者自动搜索时触发                    | -        |
| reset          | 点击重置按钮时触发                                | -        |
| * 自定义事件名 | 点击搜索条件表单的表单项 labelType = arrow 时触发 | -        |

#### Slots

| 插槽名       | 说明                     | 类型 |
| ------------ | ------------------------ | ---- |
| searchTop    | 自定义搜索栏顶部内容     | -    |
| searchBottom | 自定义搜索栏底部内容     | -    |
| toolbar      | 自定义右侧按钮           | -    |
| filterFooter | 自定义搜索条件的底部按钮 | -    |



- ### co-footer

------

#### Attributes

| 属性名  | 说明                                 | 类型          | 默认值                                                       |
| ------- | ------------------------------------ | ------------- | ------------------------------------------------------------ |
| options | 底部操作栏的按钮配置，具体配置见下表 | array[object] | [{ type: 'primary', text: '提交', slot: false, disbaled: false, methodName: 'click' }] |
| fixed   | 是否固定在底部                       | boolean       | true                                                         |
| shadow  | 是否显示阴影                         | boolean       | true                                                         |

##### options

| 属性       | 说明           | 类型                                    | 默认值  |
| ---------- | -------------- | --------------------------------------- | ------- |
| type       | 按钮类型       | primary\|success\|info\|warning\|danger | primary |
| text       | 按钮文本       | string                                  | 提交    |
| plain      | 是否为朴素按钮 | boolean                                 | false   |
| disabled   | 是否禁用       | boolean                                 | false   |
| methodName | 回调事件名     | string                                  | click   |

#### Events

| 事件名         | 说明           | 回调参数 |
| -------------- | -------------- | -------- |
| * 自定义事件名 | 点击按钮时触发 | -        |

#### Slots

| 插槽名  | 说明           | 类型 |
| ------- | -------------- | ---- |
| default | 自定义默认内容 | -    |



- ### co-load

------

#### Attributes

| 属性名      | 说明                                               | 类型          | 默认值                                            |
| ----------- | -------------------------------------------------- | ------------- | ------------------------------------------------- |
| v-model     | 列表数据                                           | array[object] | []                                                |
| search-data | 接口的查询参数，其他参数也可以通过该字段传递，必传 | object        | {}                                                |
| load        | 加载列表数据的方法                                 | Function      | () => Promise.resolve({ list: [], totalPage: 0 }) |
| init-search | 是否需要在组件初始化时搜索                         | boolean       | true                                              |
| page-size   | 每页条数                                           | number        | 20                                                |
| placeholder | 暂无数据时的提示语                                 | string        | 暂无数据                                          |
| loading     | 是否显示加载中的提示弹框                           | boolean       | true                                              |

#### Events

| 事件名        | 说明                 | 回调参数                       |
| ------------- | -------------------- | ------------------------------ |
| loadingChange | 当加载状态改变时触发 | 共一个参数，为改变后的加载状态 |
| listChange    | 当列表数据改变时触发 | 共一个参数，为改变后的列表数据 |

#### Slots

| 插槽名  | 说明           | 类型 |
| ------- | -------------- | ---- |
| default | 自定义默认内容 | -    |



- ### co-select-page

------

#### Attributes

| 属性名             | 说明                                                | 类型          | 默认值                                            |
| ------------------ | --------------------------------------------------- | ------------- | ------------------------------------------------- |
| search-data        | 接口的查询参数，其他参数也可以通过该字段传递，必传  | object        | {}                                                |
| load               | 加载列表数据的方法                                  | Function      | () => Promise.resolve({ list: [], totalPage: 0 }) |
| init-search        | 是否需要在组件初始化时搜索                          | boolean       | true                                              |
| placeholder        | 暂无数据时的提示语                                  | string        | 暂无数据                                          |
| filter             | 是否开启搜索条件筛选                                | boolean       | false                                             |
| filter-options     | 搜索条件的表单配置                                  | array[object] | []                                                |
| search-input-field | 搜索框的输入字段，属于 search-data 属性里的一个字段 | string        | searchText                                        |
| label-key          | 用于展示数据                                        | string        | label                                             |
| value-key          | 用于选中状态                                        | string        | value                                             |
| multiple           | 是否多选                                            | boolean       | false                                             |
| back               | 点击确认后是否返回上一个页面                        | boolean       | true                                              |
| slot-type          | 使用插槽组件的类型，组件需自行引入                  | string        | -                                                 |
| has-search         | 是否需要搜索框                                      | boolean       | true                                              |
| default-value      | 默认选中数据                                        | array         | []                                                |
| required           | 是否必须选择数据后才能点击确定按钮                  | boolean       | true                                              |

#### Events

| 事件名            | 说明                 | 回调参数                       |
| ----------------- | -------------------- | ------------------------------ |
| confirm           | 当点击确认按钮时触发 | 共一个参数，为当前选中的数据   |
| listChange        | 当列表数据改变时触发 | 共一个参数，为改变后的列表数据 |
| update:searchData | 当查询参数改变时触发 | 共一个参数，为改变后的查询参数 |

#### Slots

| 插槽名 | 说明         | 类型 |
| ------ | ------------ | ---- |
| footer | 自定义底部栏 | -    |



- ### co-steps

------

#### Attributes

| 属性名         | 说明               | 类型                                   | 默认值 |
| -------------- | ------------------ | -------------------------------------- | ------ |
| active         | 设置当前激活步骤   | number                                 | -1     |
| process-status | 设置当前步骤的状态 | wait\|process\|warning\|error\|success | wait   |

#### Slots

| 插槽名  | 说明           | 子标签  |
| ------- | -------------- | ------- |
| default | 自定义默认内容 | co-step |



- ### co-step

------

#### Attributes

| 属性名 | 说明                       | 类型                                   | 默认值 |
| ------ | -------------------------- | -------------------------------------- | ------ |
| icon   | 图标                       | string                                 | -      |
| color  | 图标颜色                   | string                                 | -      |
| top    | 图标与步骤条顶部之间的距离 | string                                 | 50%    |
| status | 步骤状态                   | wait\|process\|warning\|error\|success | wait   |

#### Events

| 事件名 | 说明               | 回调参数 |
| ------ | ------------------ | -------- |
| click  | 当点击步骤条时触发 | -        |

#### Slots

| 插槽名  | 说明           | 类型 |
| ------- | -------------- | ---- |
| icon    | 自定义步骤图标 | -    |
| content | 自定义步骤内容 | -    |
