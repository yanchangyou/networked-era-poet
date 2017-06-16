var solr = require('../../../service/remote/solr/solr.js')
var util = require('../../../utils/util.js')
// index.js
var app = getApp()
var pageCode = "poem-view"
Page({

  /**
   * 数据
   */
  data: {
    keywords: "",
    poem: [],
    title: "",
    author: "",
    date: '',
    isPreview: app.globalData.isPreViewStatus,
    options: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.options = options
    var title = options.title
    var author = options.author
    var date = options.date
    var keywords = options.keywords
    var poem = JSON.parse(options.poem)

    this.setData({
      keywords: keywords,
      poem: poem,
      title: title,
      author: author,
      date: date,
      isPreview: app.globalData.isPreViewStatus
    })

    wx.setNavigationBarTitle({
      title: '诗'
    })

    solr.log({ "pageCode": pageCode, "event": "onLoad" })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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

    var title = this.data.title
    var author = this.data.author
    var date = this.data.date
    var keywords = this.data.keywords
    var poem = JSON.stringify(this.data.poem)
    var url = '/pages/poem/view/index?poem=' + poem + '&title=' + title + '&author=' + author + '&date=' + date
    console.log("share url:" + url)
    return {
      title: title,
      path: url,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }

    solr.log({
      "pageCode": pageCode,
      title: title,
      path: url
    }, "share")
  },
  savePoem: function () {
    var poems = wx.getStorageSync('poems') || {}
    var poemHash = util.md5(this.data.options)
    poems[poemHash] = this.data.options
    wx.setStorageSync('poems', poems)
  },
  gotoCreatePoem: function () {
    wx.navigateTo({
      url: '/pages/poem/create/index'
    })
    solr.log({ "pageCode": pageCode, "event": "gotoCreatePoem" })
  },
  gotoBack: function () {
    wx.navigateBack()
    solr.log({ "pageCode": pageCode, "event": "gotoBack" })
  }
})