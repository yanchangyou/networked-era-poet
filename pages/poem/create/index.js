

var poemService = require('../../../service/poem/poem.js')
var solr = require('../../../service/remote/solr/solr.js')
var util = require('../../../utils/util.js')
var pageCode = "poem-create"
var app = getApp()

Page({
  /**
   * 数据
   */
  data: {
    poems: [["小桥流水里", "湘浦荻花时", "一夜三杯酒", "孤舟万顷陂"]],
    poemIndex: 0,
    userInfo: {},
    poemKeywords: "",
    progressDisplay: "none",
    progressPercent: 0,
    poemContentDisplay: "",
    showNextPomeDisplay: "none",
    poemTitle: '',
    poemTypeIndex: 3,
    poemType: ['五言起头', '七言起头', '五言藏头', '七言藏头'],
    poemTypeTips: ['输入首句前几个字', '输入首句前几个字', '输入前四个字', '输入前四个字']
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      })
    })
    solr.log({ "pageCode": pageCode, "event": "onUnload" })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

    wx.setNavigationBarTitle({
      title: '为你作一首诗'
    })
    solr.log({ "pageCode": pageCode, "event": "onReady" })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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
  selectPoemType: function (e) {

    var data = { poemTypeIndex: e.detail.value }
    this.setData(data)
    util.merge({ "pageCode": pageCode }, data)
    solr.log(data)
  },
  setTitle: function (e) {
    var poemTitle = e.detail.value
    poemTitle = util.escapeXChar(poemTitle)
    var data = { poemTitle: poemTitle }
    this.setData(data);
    util.merge({ "pageCode": pageCode }, data)
    solr.log(data)
  },
  /**
   * 预览
   */
  preViewPoem: function () {
    var title = this.data.poemTitle
    if (!title) {
      title = '无题'
    }
    var keywords = this.data.poemKeywords
    var index = this.data.poemIndex
    var author = this.data.userInfo.nickName
    var date = new Date().toLocaleDateString();
    var poem = JSON.stringify(this.data.poems[this.data.poemIndex]);
    wx.navigateTo({
      url: '/pages/poem/view/index?' + '&keywords=' + keywords + '&index=' + index + '&title=' + title + '&author=' + author + '&poem=' + poem + '&date=' + date,
      fail: function () {//连续跳转5次，就会失败
        wx.navigateBack({
          delta: 3
        })
      }
    })
    app.globalData.isPreViewStatus = true//用于判断用户是否预览状态

    var data = { keywords: keywords, poem: poem, title: title, poemIndex: this.data.poemIndex }
    util.merge({ "pageCode": pageCode }, data)
    solr.log(data, "preview")
  },
  /**
   * 修改
   */
  editPoem: function () {
    var title = this.data.poemTitle
    if (!title) {
      title = '无题'
    }
    var keywords = this.data.poemKeywords
    var index = this.data.poemIndex
    var author = this.data.userInfo.nickName
    var date = new Date().toLocaleDateString();
    var poem = this.data.poems[this.data.poemIndex]
    wx.navigateTo({
      url: '/pages/poem/icreate/index?' + '&title=' + title + '&author=' + author + '&line0=' + poem[0] + '&line1=' + poem[1] + '&line2=' + poem[2] + '&line3=' + poem[3]
    })
    app.globalData.isPreViewStatus = true//用于判断用户是否预览状态

    var data = { keywords: keywords, poem: poem, title: title, poemIndex: this.data.poemIndex }
    util.merge({ "pageCode": pageCode }, data)
    solr.log(data, "preview")
  },
  setPoemKeywords: function (e) {
    var poemKeywords = e.detail.value
    poemKeywords = util.escapeXChar(poemKeywords)
    var data = { poemKeywords: poemKeywords }
    this.setData(data)
    util.merge({ "pageCode": pageCode }, data)
    solr.log(data)
  },
  makePoem: function () {
    var that = this
    var timer = setInterval(function () {
      var progressPercent = that.data.progressPercent
      if (progressPercent > 100) {
        progressPercent = -5
      }
      that.setData({
        progressPercent: progressPercent + 3
      })
    }, 100)
    //10秒之后开始清除timer，防止无限调用
    setTimeout(function () {
      clearInterval(timer)
      console.log("超过10秒清除进度条")
    }, 10000)

    this.setData({ progressDisplay: '', poemContentDisplay: 'none' })

    var poemKeywords = this.data.poemKeywords
    var poemType = this.data.poemTypeIndex - (-1);
    var successCallback = function (poems) {
      // var poems = res.data.poems

      clearInterval(timer)
      that.setData({ progressDisplay: 'none', poemContentDisplay: '' })
      that.setData({ poems: poems, poemIndex: 0 })

      if (poems.length > 1) {
        that.setData({ showNextPomeDisplay: '' })
      }
    }
    var failCallback = function (e) {
      clearInterval(timer)
    }
    poemService.createPoems(poemKeywords, poemType, successCallback, failCallback)

  },
  //事件处理函数
  bindPoemTap: function () {
    setTimeout(this.makePoem, 500)
  },
  showNextPome: function () {
    var poemIndex = this.data.poemIndex
    var poemLength = this.data.poems.length
    poemIndex = (++poemIndex) % poemLength
    this.setData({ poemIndex: poemIndex })
  },
  bindICreateTap: function() {
    wx.navigateTo({
      url: '/pages/poem/icreate/index',
    })
  }
})