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
    index: "",
    title: "",
    author: "",
    poem: [],
    date: '',
    isPreview: app.globalData.isPreViewStatus,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var keywords = options.keywords
    var index = options.index
    var title = options.title
    var author = options.author
    var poem = JSON.parse(options.poem)
    var date = options.date

    this.setData({
      keywords: keywords,
      index: index,
      poem: poem,
      title: title,
      author: author,
      date: date,
      isPreview: app.globalData.isPreViewStatus
    })

    wx.setNavigationBarTitle({
      title: '诗'
    })

    solr.log({ "pageCode": pageCode, "event": "onLoad", data: JSON.stringify(this.data) })
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

    var keywords = this.data.keywords
    var index = this.data.index
    var title = this.data.title
    var author = this.data.author
    var poem = JSON.stringify(this.data.poem)
    var date = this.data.date
    var url = '/pages/poem/view/index?' + '&keywords=' + keywords + '&index=' + index + '&title=' + title + '&author=' + author + '&poem=' + poem + '&date=' + date;
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
    var data = this.data;
    var poem = {
      keywords: data.keywords,
      index: data.index,
      title: data.title,
      author: data.author,
      poem: data.poem,
      date: data.date
    };

    var poems = wx.getStorageSync('poems') || {}
    var poemHash = util.md5(poem)
    poems[poemHash] = poem
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