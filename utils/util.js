
var app = getApp()

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
  return app.globalData.userInfo;
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

module.exports = {
  formatTime: formatTime,
  escapeXChar: escapeXChar,
  getUserInfo: getUserInfo,
  merge: merge
}
