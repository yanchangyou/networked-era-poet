var md5Module = require("md5.js")
function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}


function escapeXChar(str) {
  return str.replace(/[~!@#\$%\^&\*\(\)_\+\{\}:"<>\?`\-=\[\];',\.\/]/g, '')
}

function getUserInfo() {
  var app = getApp()
  try {
    return app.globalData.userInfo
  } catch (e) {
    console.log(e)
    app.getUserInfo()
    return null
  }
}

/**
 * 属性合并 fromBean， toBean
 * needReplace ： 如果属性存在是否需要合并; 默认替换
 */
function merge(fromBean, toBean, needReplace) {
  for (var p in fromBean) {
    if (false === needReplace && fromBean[p]) {
    } else {
      toBean[p] = fromBean[p];
    }
  }
  return toBean
}
function decryptData(sesssionKey, encryptedData, iv) {
  // base64 decode
  var sessionKey = new Buffer(sessionKey, 'base64')
  encryptedData = new Buffer(encryptedData, 'base64')
  iv = new Buffer(iv, 'base64')

  try {
    // 解密
    var decipher = crypto.createDecipheriv('aes-128-cbc', sessionKey, iv)
    // 设置自动 padding 为 true，删除填充补位
    decipher.setAutoPadding(true)
    var decoded = decipher.update(encryptedData, 'binary', 'utf8')
    decoded += decipher.final('utf8')

    decoded = JSON.parse(decoded)

  } catch (err) {
    throw new Error('Illegal Buffer')
  }

  if (decoded.watermark.appid !== this.appId) {
    throw new Error('Illegal Buffer')
  }

  return decoded
}

/**
 * 等待条件满足再执行，callback是无条件函数
 */
function waitThenDo(waitCheck, callback, timeout) {
  if (waitCheck()) {
    callback()
  } else {
    timeout = timeout || 500;
    setTimeout(function () {
      waitThenDo(waitCheck, callback, timeout)
    }, timeout)
  }
}

function md5(obj) {
  var str = "";
  if (typeof obj === 'object') {
    str = JSON.stringify(obj)
  } else {
    str = "" + obj
  }
  return md5Module.hex_md5(str)
}

module.exports = {
  formatTime: formatTime,
  escapeXChar: escapeXChar,
  getUserInfo: getUserInfo,
  merge: merge,
  decryptData: decryptData,
  waitThenDo: waitThenDo,
  md5: md5
}
