var util = require('../../../utils/util.js')

var app = getApp()
var SOLR_URL = 'https://dev.321zou.com/solr'

function send(json, prefix) {
  util.waitThenDo(function () {
    return util.getUserInfo()
  }, function () {
    var userInfo = packageSolrData(util.getUserInfo(), "user_", "_s")
    var solrJson = packageSolrData(json, prefix + "_", "_s")
    util.merge(userInfo, solrJson)

    appendBaseData(solrJson)

    wx.request({
      url: SOLR_URL + '/access/update?commitWithin=1000&overwrite=true&wt=json',
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
  })
}

function queryPoems(userId, param, callback) {
  var solrParam = ''
  for(var p in param) {
    solrParam += '+AND+' + p + ':' + param[p]
  }
  solrParam += '+OR+userId:' + userId
  wx.request({
    url: SOLR_URL + '/poem/select?q=*:*' + solrParam + '&wt=json&sort=status+asc,id+desc',
    method: 'GET',
    data: JSON.stringify(param),
    success: function (res) {
      callback(res.data.response.docs)
    },
    fail: function (e) {
      console.log("网络请求错误：" + e)
    }
  })
}
function savePoem(poem, callback) {
  wx.request({
    url: SOLR_URL + '/poem/update?commitWithin=1000&overwrite=true&wt=json',
    method: 'POST',
    header: {
      'content-type': 'application/json'
    },
    data: JSON.stringify([poem]),
    success: function (res) {
      if (typeof callback === 'function') {
        callback(res.data)
      }

      // console.log(res.data)
    },
    fail: function (e) {
      console.log("网络请求错误：" + e)
    }
  })
}

function saveUser(user) {

  var userId1 = util.getUserId1(user.avatarUrl)
  var time = util.formatTime(new Date())

  user['id1'] = userId1
  user['id'] = userId1
  user['time'] = time

  wx.request({
    url: SOLR_URL + '/user/update?commitWithin=1000&overwrite=true&wt=json',
    method: 'POST',
    header: {
      'content-type': 'application/json'
    },
    data: JSON.stringify([user]),
    success: function (res) {
      if (typeof callback === 'function') {
        // callback(res.data)
      }

      // console.log(res.data)
    },
    fail: function (e) {
      console.log("网络请求错误：" + e)
    }
  })

}
/**
 * 点赞日志
 */
function likePoemLog(user, poem, callback) {

  // saveUser(user)

  var userId1 = util.getUserId1(user.avatarUrl)
  user['id'] = userId1

  var id = util.makeDataId()
  var time = util.formatTime(new Date())
  var logId = user.id1 + "-" + poem.id

  var log = {id: logId, time: time, userId: user.id, poemId: poem.id}

  wx.request({
    url: SOLR_URL + '/like/update?commitWithin=1000&overwrite=true&wt=json',
    method: 'POST',
    header: {
      'content-type': 'application/json'
    },
    data: JSON.stringify([log]),
    success: function (res) {
      if (typeof callback === 'function') {
        callback(res.data)
      }

      // console.log(res.data)
    },
    fail: function (e) {
      console.log("网络请求错误：" + e)
    }
  })
}

function queryLike(param, callback) {
  wx.request({
    url: SOLR_URL + '/like/select?facet.field=poemId&facet=on&fl=poemId&q=poemId:*&rows=0&wt=json',
    method: 'GET',
    header: {
      'content-type': 'application/json'
    },
    data: JSON.stringify(param),
    success: function (res) {
      callback(res.data.facet_counts.facet_fields.poemId)
    },
    fail: function (e) {
      console.log("网络请求错误：" + e)
    }
  })
}

/**
 * 包装成solr的json数据
 */
function packageSolrData(json, prefix, subfix) {

  var solrJson = {};

  for (var p in json) {
    if (json[p] != null) {
      solrJson[prefix + p + subfix] = json[p].toString();
    } else {
      solrJson[prefix + p + subfix] = null
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
  log: log,
  queryPoems: queryPoems,
  savePoem: savePoem,
  likePoemLog: likePoemLog,
  saveUser: saveUser,
  queryLike: queryLike
}
