var util = require('../../../utils/util.js')

var app = getApp()

function send(json, prefix) {
  var userInfo = packageSolrData(util.getUserInfo(),"user")
  var solrJson = packageSolrData(json, prefix)
  util.merge(userInfo, solrJson)

  appendBaseData(solrJson)

  wx.request({
    url: 'https://dev.321zou.com/solr/access/update?commitWithin=1000&overwrite=true&wt=json',
    method: 'POST',
    header: {
      'content-type': 'application/json'
    },
    data: JSON.stringify([solrJson]),
    success: function (res) {
      console.log(res.data)
    },
    fail: function (e) {
      console.log("网络请求错误：" + e)
    }
  })
}

/**
 * 包装成solr的json数据
 */
function packageSolrData(json, prefix) {

  var solrJson = {};

  for (var p in json) {
    if (json[p] != null) {
      solrJson[prefix + "_" + p + "_s"] = json[p].toString();
    } else {
      solrJson[prefix + "_" + p + "_s"] = null
    }
  }
  return solrJson
}

/**
添加基础数据
*/
function appendBaseData(solrJson) {
  solrJson['id'] = "" + new Date().getTime() + Math.random()
  solrJson['time_s'] = util.formatTime(new Date())
  return solrJson
}

function log(data, prefix) {
  prefix = prefix ? "_" + prefix : "";
  this.send(data, "log" + prefix);
}

module.exports = {
  send: send,
  log: log
}
