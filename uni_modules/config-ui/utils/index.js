import ConfigStore from '../utils/config-store';

/**
 * 生成uuid
 * @return {String} 32位uuid
 */
const createUUID = () => {
  let d = new Date().getTime();
  const uuid = 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(
    /[xy]/g,
    function (c) {
      const r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c == 'x' ? r : (r & 0x3) | 0x8).toString(16);
    }
  );
  return uuid;
}

const china = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
/**
 * 将阿拉伯数字转成中文数字
 * @param {Number} num 阿拉伯数字
 * @return {String} 中文数字
 */
const convertToChinaNum = (num) => {
  if (!num || isNaN(num)) {
    return '零';
  }
  const english = num.toString().split('');
  let result = '';
  for (let i = 0; i < english.length; i++) {
    result += china[Number(english[i])];
  }
  return result;
}

/**
 * 根据字典值来获取其字典名，或者根据字典名获取字典值
 * @param {String|Array} dictData 字典值 或 字典名
 * @param {String} dictName 字典分类
 * @param {String} type 获取类型，value：字典值来获取其字典名，name：根据字典名获取字典值
 * @return {String} 字典名
 */
const getDicName = (dictData, dictName, type = 'value') => {
	if (typeof dictData === 'string' && dictData.indexOf(',') !== -1) {
		dictData = dictData.split(',')
	}
  const dicMap = ConfigStore.dictionary[dictName]
	const dicNameFormatter = (dicMap) => {
		let data
		if (type === 'value') {
			if (Reflect.toString.call(dictData) === '[object Array]') {
        data = dictData.map((item) => dicMap.get(item).dictName).join(',')
			}
			else {
				data = dicMap.get(dictData).dictName
			}
		}
		else if (type === 'name') {
			const values = Array.from(dicMap.values())
			for (let i = 0; i < values.length; i++) {
				if (values[i].dictName === dictData) {
					data = values[i].dictValue
					break
				}
			}
		}
		return data
	}
  return new Promise((resolve, reject) => {
    if (dicMap && dicMap.size) {
      resolve(dicNameFormatter(dicMap))
    } else {
      const mapWatch = ConfigStore.$watch(
        () => {
          return ConfigStore.dictionary[dictName]
        },
        (dicMap) => {
          mapWatch()
					resolve(dicNameFormatter(dicMap))
        }
      )
      ConfigStore.getDictMap(dictName)
    }
  })
}

const requestAnimationFrame = (callback) => {
	setTimeout(() => {
		callback()
	}, 16)
}

// 时间选择器组件数据
const date = new Date();
const yearArr = [];
const monthArr = [];
const dayArr = [];
const hourArr = [];
const minuteArr = [];
for (let i = 1990; i <= date.getFullYear(); i++) {
  yearArr.push(i.toString());
}
for (let i = 1; i <= 12; i++) {
  monthArr.push(i < 10 ? '0' + i : i.toString());
}
for (let i = 0; i <= 23; i++) {
  hourArr.push(i < 10 ? '0' + i : i.toString());
}
for (let i = 0; i <= 59; i++) {
  minuteArr.push(i < 10 ? '0' + i : i.toString());
}
export const years = yearArr;
export const months = monthArr;
export const hours = hourArr;
export const minutes = minuteArr;
export const seconds = minuteArr;

const getCssSize = (val) => {
  const reg = /^[0-9]*$/g
  return (typeof val === 'number' || reg.test(val)) ? val + 'px' : val;
}

/**
 * 获取第一个匹配选择器 selector 的节点信息
 * @param {String} selector 类似于 CSS 的选择器
 * @param {Object} _this 当前上下文
 * @return {Object} 节点信息
 */
const getNodeInfo = (selector, _this) => {
  return new Promise((resolve) => {
    uni.createSelectorQuery()
    .in(_this)
    .select(selector)
    .boundingClientRect(data => {
      resolve(data)
    })
    .exec()
  })
}

export {
  requestAnimationFrame,
  getDicName,
  convertToChinaNum,
  createUUID,
  getCssSize,
  getNodeInfo
}
