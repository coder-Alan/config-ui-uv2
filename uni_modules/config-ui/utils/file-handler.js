import ConfigStore from '../utils/config-store';

const FileSystemManager = wx.getFileSystemManager()

/**
 * 比如可以根据附件信息的 fileId 拼出文件的下载地址
 * @param {String} fileId 线上服务器的文件id
 * @return {String} 完整的文件地址
 */
function getFileUrl(fileId) {
	return ConfigStore.downloadConfig.getUrlFun(fileId)
}

/**
 * 辅助函数，下载文件方法封装
 * @param {String} url 下载地址
 * @return {Promise} 文件临时路径
 */
function downloadFile(url) {
	return new Promise((resolve, reject) => {
		wx.downloadFile({
			url,
			header: ConfigStore.downloadConfig.header,
			timeout: ConfigStore.downloadConfig.timeout,
			filePath: ConfigStore.downloadConfig.filePath,
			success: (res)=> {
				if (res.tempFilePath.indexOf('.json') !== -1) {
					uni.showToast({
						title: '文件下载失败',
						icon: 'error'
					})
					reject('文件下载失败')
				}
				else {
					resolve(res.tempFilePath)
				}
			},
			fail: (err)=>{
				reject(err)
			}
		})
	})
}

/**
 * 下载文件，保存临时地址
 * @param {String} fileId 文件id，需拼接成url
 * @return {Promise} 文件临时路径
 */
async function downloadToTemp(fileId) {
	uni.showLoading({
		title: '文件下载中',
		mask: true
	})
	try{
		const { path } = await hasTempPath(fileId)
		uni.hideLoading()
		return path
	}catch(e){
		const url = getFileUrl(fileId)
		const path = await downloadFile(url)
		const fileManager = uni.getStorageSync('CONFIGUI_FILE_MANAGER') || {}
		fileManager[fileId] = {
			type: 'temp',
			path
		}
		uni.setStorageSync('CONFIGUI_FILE_MANAGER', fileManager)
		uni.hideLoading()
		return path
	}
}

/**
 * 辅助函数，下载文件并保存到本地
 * @param {String} fileId 线上服务器的文件id
 */
function downloadToStorage(fileId) {
	uni.showLoading({
		title: '文件下载中',
		mask: true
	})
	const fileManager = uni.getStorageSync('CONFIGUI_FILE_MANAGER') || {}
	const url = getFileUrl(fileId)
	downloadFile(url)
		.then(path => {
			const storagePath = FileSystemManager.saveFileSync(path)
			fileManager[fileId] = {
				path: storagePath,
				type: 'storage'
			}
			uni.setStorageSync('CONFIGUI_FILE_MANAGER', fileManager)
			uni.showToast({ title: '下载完成' })
		})
		.catch(e => {
			uni.hideLoading()
			console.warn(e)
		})
}

/**
 * 辅助函数，判断是否存在文件临时路径
 * @param {String} fileId 保存在服务器上的文件id
 * @return {Promise}
 */
function hasTempPath(fileId) {
	const fileManager = uni.getStorageSync('CONFIGUI_FILE_MANAGER')

	return new Promise((resolve, reject) => {
		// 存在临时文件和本地文件的情况下
		if (fileManager && fileManager[fileId]) {
			const info = fileManager[fileId]
			FileSystemManager.getFileInfo({
				filePath: info.path,
				success: () => {
					resolve(info)
				},
				fail: () => {
					// 缓存中存在路径，但手机不存在该临时或本地文件
					delete fileManager[fileId]
					uni.setStorageSync('CONFIGUI_FILE_MANAGER', fileManager)
					reject(false)
				}
			})
		}
		else {
			reject(false)
		}
	})
}

/**
 * 先判断是否存在临时路径或本地路径；
 * 如果存在路径，先判断是否存在该文件；
 * 如果存在再判断路径类型，如果是临时路径则把文件保存到本地，如果是本地路径则不处理；
 * 如果不存在路径，则直接下载并保存到本地
 * @param {String} fileId 保存在服务器上的文件id
 */
function downloadHandler(fileId) {
	return hasTempPath(fileId)
		.then(info => {
			// type - storage：本地文件，temp：临时文件
			if (info.type === 'storage') {
				return uni.showToast({
					title: '该文件已下载'	,
					icon: 'none'
				})
			}
			else {
				const fileManager = uni.getStorageSync('CONFIGUI_FILE_MANAGER') || {}
				// 把临时文件保存到本地，传入临时文件路径，返回本地文件路径
				const storagePath = FileSystemManager.saveFileSync(info.path)
				fileManager[fileId] = {
					path: storagePath,
					type: 'storage'
				}
				uni.setStorageSync('CONFIGUI_FILE_MANAGER', fileManager)
				uni.showToast({ title: '文件下载成功' })
			}
		})
		.catch(() => {
			// 重新下载
			downloadToStorage(fileId)
		})
}

/**
 * 上传文件方法封装
 * @param {Object} data
 * @param {String} data.path 要上传文件资源的路径 (本地路径)
 * @return {Promise} 上传后的结果
 */
function handleUpload(data = {}) {
	if (!data.path) return Promise.reject('上传失败，请传入本地路径');

	const { uploadConfig } = ConfigStore

	if (!uploadConfig.url) throw new Error('请配置上传地址');

  return new Promise((resolve, reject) => {
    uni.uploadFile({
      url: uploadConfig.url,
      filePath: data.path,
			name: 'file',
      header: {
        'Content-Type': 'multipart/form-data',
        ...uploadConfig.header
      },
      success: (uploadFileRes) => {
        const res = JSON.parse(uploadFileRes.data)
        uploadConfig.success({ res, resolve, reject })
      }
    })
  })
}

/**
 * 将文件大小字节转换成KB，MB，GB，TB
 * @param {Number} size 文件大小字节
 * @return {String} 带单位的大小
 */
function fileSizeFormatter(size) {
  if (!size && size !== 0) return '';
  if (size < Math.pow(1024, 2))
    return (size / Math.pow(1024, 1)).toFixed(2) + ' KB';
  if (size < Math.pow(1024, 3))
    return (size / Math.pow(1024, 2)).toFixed(2) + ' MB';
  if (size < Math.pow(1024, 4))
    return (size / Math.pow(1024, 3)).toFixed(2) + ' GB';
  return (size / Math.pow(1024, 4)).toFixed(2) + ' TB';
}

/**
 * 转发文件到聊天
 * @param {String} fileId 线上服务器的文件id，需拼接成url
 * @param {String} fileName 自定义文件名，若留空则使用文件本身的文件名
 */
const shareFile = async (fileId, fileName = '') => {
	const tempFilePath = await downloadToTemp(fileId)
	await wx.shareFileMessage({
		filePath: tempFilePath, // 要分享的文件地址，必须为本地路径或临时路径
		fileName
	})
}

/**
 * 获取该小程序下的 本地临时文件 或 本地缓存文件 信息
 * @param {String} path 要读取的文件路径 (本地路径)
 * @return {Promise}
 */
const getFileInfo = (path, digestAlgorithm = 'md5') => {
	return new Promise((resolve, reject) => {
		FileSystemManager.getFileInfo({
			filePath: path,
			digestAlgorithm,
			success(res) {
				resolve(res)
			},
			fail(err) {
				reject(err)
			}
		})
	})
}

/**
 * 获取文件名的扩展名。
 * 
 * @param {string} filename - 要获取扩展名的文件名。
 * @returns {string} 文件名的扩展名，如果没有扩展名则返回空字符串。
 * 
 * 使用正则表达式匹配文件名中的后缀名。正则表达式解释如下：
 * - \.([^.]+)?: 匹配一个点（.）后面跟着一个或多个非点字符，这部分是可选的。
 * - $: 匹配字符串的结尾。
 * 
 * 如果匹配成功，返回匹配到的扩展名；否则返回空字符串。
 */
const getFileExtension = (filename) => {
  // 使用正则表达式匹配文件名中的后缀名
  const regex = /(?:\.([^.]+))?$/;
  const match = filename.match(regex);
  return match ? match[1] : '';
}

export {
	downloadToTemp,
	downloadHandler,
	handleUpload,
	fileSizeFormatter,
	getFileUrl,
	shareFile,
	getFileInfo,
  getFileExtension
}
