var md5 = require('../../utils/md5.js')
var util = require('../../utils/util.js')
var solr = require('../../service/remote/solr/solr.js')

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
      // console.log(res.data)
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

  var json = {
    'keywords': poemKeywords,
    'type': poemType,
    'uuid': uuid,
  }
  solr.send(json, "make")
}

function save(poem) {
  if (findPoemById(poem['id'])) {
    update(poem)
  } else {
    insert(poem)
  }
  return poem
}

function insert(poem) {
  var poems = wx.getStorageSync("allPoems")||[]
  poem['id'] = util.makeDataId()
  poems.push(poem)
  wx.setStorageSync("allPoems", poems);
  return poem
}

function update(poem) {
  var poems = wx.getStorageSync("allPoems")
  var id = poem.id
  for (var i = 0; i < poems.length; i++) {
    if (poems[i].id === id) {
      util.merge(poem, poems[i]);
      break;
    }
  }
  wx.setStorageSync("allPoems", poems);
  return poem
}

function del(id) {
  var poems = wx.getStorageSync("allPoems")
  var index = 0;
  for (var i = 0; i < poems.length; i++) {
    index = i;
    if (poems[i].id === id) {
      break;
    }
  }
  poems.splice(index, 1)
  wx.setStorageSync("allPoems", poems);
}

function getAllPoems() {
  return wx.getStorageSync("allPoems") || []
}

function findPoemById(id) {
  var poems = getAllPoems()
  for(var i=0; i<poems.length; i++) {
    if (poems[i]['id'] == id){
      return poems[i]
    }
  }
  return null
}

module.exports = {
  createPoems: createPoems,
  getPoems: getPoems,
  save: save,
  del: del,
  getAllPoems: getAllPoems
}
