var md5 = require('../../utils/md5.js')

/**
 * 功能：生成诗
 * 参数：
 *  keywords：关键词
 *  poemType：诗类型 1，五言首句；2，五言藏头；3，七言首句；4，七言藏头；
 *  callback：生产诗之后的回调函数
 */
function createPoems(poemKeywords, poemType, successCallback, failCallback) {
  var uuid = md5.hex_md5(poemKeywords + "-" + poemType)
  getPoemFromInterface(poemKeywords, poemType, uuid, successCallback, failCallback)
}
/**
 * 功能：获取诗
 * 参数：
 *  uuid：诗的唯一标识
 */
function getPoems(uuid, successCallback, failCallback) {
  getPoemFromInterface('', '', uuid, successCallback, failCallback)
}
/**
 * 功能：从接口中获取诗
 * 参数：
 *  keywords：关键词
 *  poemType：诗类型 1，五言首句；2，五言藏头；3，七言首句；4，七言藏头；
 *  uuid：uuid诗的唯一标识，第一次生产，以后直接使用uuid获取
 *  successCallback：生产诗成功之后的回调函数
 *  failCallback：失败回调函数
 */
function getPoemFromInterface(poemKeywords, poemType, uuid, successCallback, failCallback) {
  wx.request({
    url: 'https://dev.321zou.com/poem/getpoems',
    data: {
      'seed': poemKeywords,
      'type': poemType,
      'uuid': uuid
    },
    header: {
      'content-type': 'application/json'
    },
    success: function (res) {
      console.log(res.data)
      var poems = res.data.poems
      if (typeof successCallback === 'function') {
        successCallback(poems)
      }
    },
    fail: function (e) {
      console.log("网络请求错误：" + e)
      if (typeof failCallback === 'function') {
        failCallback(e)
      }
    }
  })
}


module.exports = {
  createPoems: createPoems,
  getPoems: getPoems
}
