var util = require('../../../utils/util.js')
var poemService = require('../../../service/poem/poem.js')
var solr = require('../../../service/remote/solr/solr.js')

var app = getApp()
var pageCode = "poem-create"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tagsPoems: [],
    hidden: true,
    list: [],
    scrollTop: 0,
    scrollHeight: 0,
    startX: 0,
    startY: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    solr.log({ "pageCode": pageCode, "event": "onLoad" })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

    wx.setNavigationBarTitle({
      title: '我的诗集'
    })

    solr.log({ "pageCode": pageCode, "event": "onReady" })

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

    app.globalData.isPreViewStatus = true //用于判断用户是否预览状态

    this.refresh()
    solr.log({ "pageCode": pageCode, "event": "onShow" })

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    solr.log({ "pageCode": pageCode, "event": "onHide" })

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    solr.log({ "pageCode": pageCode, "event": "onUnload" })

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.refresh()
    solr.log({ "pageCode": pageCode, "event": "onPullDownRefresh" })

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    solr.log({ "pageCode": pageCode, "event": "onReachBottom" })

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    solr.log({ "pageCode": pageCode, "event": "onShareAppMessage" })

  },
  tagTap: function (e) {
    var id = parseInt(e.currentTarget.id.replace("tag-", ""))
    this.data.tagsPoems[id].open = !this.data.tagsPoems[id].open
    this.setData({ tagsPoems: this.data.tagsPoems })
    solr.log({ "pageCode": pageCode, "event": "tagTap", "tagId": id })

  },
  tagMove: function (e) {
    // console.info(e)
    var id = e.currentTarget.id
    var poem = this.findPoem(id)

    var endX = e.touches[0].clientX
    var endY = e.touches[0].clientY
    var startX = this.data.startX
    var startY = this.data.startY

    //修复 左右滑动和上下滑动 
    if (Math.abs(endX - startX) < Math.abs(endY - startY) * 2) {
      return
    }

    if (Math.abs(endX - startX) < 20) {
      return
    }

    if (endX - startX < -500 || endX - startX > 500) {
      return
    }

    poem.marginRight -= Math.round(endX - startX)

    if (poem.marginRight > 0) {
      poem.marginRight = 0
    }
    if (poem.marginRight < -100) {
      poem.marginRight = -100
    }
    // console.info("poem.marginRight:" + poem.marginRight)
    this.setData({ tagsPoems: this.data.tagsPoems })
  },
  tagMoveStart: function (e) {
    // console.info(e)
    var startX = e.touches[0].clientX;
    var startY = e.touches[0].clientY;
    this.setData({ startX: startX, startY: startY })
    // console.info("startX:" + startX)
  },
  tagMoveEnd: function (e) {

    var id = e.currentTarget.id
    var poem = this.findPoem(id)

    var endX = e.changedTouches[0].clientX;
    var endY = e.changedTouches[0].clientY;
    var startX = this.data.startX;
    var startY = this.data.startY;
    // console.info(e)
    if ((endX - startX) >= 20) {//向右滑动，马上关闭
      poem.marginRight = -100;
    }
    if ((endX - startX) < -20 && (Math.abs(endX - startX) > Math.abs(endY - startY) * 2)) {
      poem.marginRight = 0
    } else {
      poem.marginRight = -100
    }
    this.setData({ tagsPoems: this.data.tagsPoems })
    solr.log({ "pageCode": pageCode, "event": "tagMoveEnd" })

  },
  refresh: function () {
    var poems = poemService.getAllPoems()

    var poemList = util.map2list(poems)
    for (var i = 0; i < poemList.length; i++) {
      poemList[i]['marginRight'] = -100;
    }
    var tagsPoems = util.list2tags(poemList)
    tagsPoems.push({ tag: "全部集", list: poemList })
    for (var i = 0; i < tagsPoems.length; i++) {
      tagsPoems[i].open = false
    }
    tagsPoems[0].open = true
    //状态保持之前的，如果之前有状态
    var oldTagsPoems = this.data.tagsPoems
    for (var i = 0; i < tagsPoems.length; i++) {
      for (var j = 0; j < oldTagsPoems.length; j++) {
        if (tagsPoems[i].tag === oldTagsPoems[j].tag) {
          tagsPoems[i].open = oldTagsPoems[j].open
        }
      }
    }
    this.setData({ tagsPoems: tagsPoems })
  },
  deletePoem: function (e) {
    var id = e.currentTarget.id;
    poemService.del(id)
    this.refresh()
    solr.log({ "pageCode": pageCode, "event": "deletePoem" })

  },
  findPoem: function (id) {
    for (var i = 0; i < this.data.tagsPoems.length; i++) {
      var poems = this.data.tagsPoems[i].list;
      for (var j = 0; j < poems.length; j++) {
        if (id === poems[j].id) {
          return poems[j]
        }
      }
    }
    return null;
  }
})