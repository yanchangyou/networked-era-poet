var solr = require('../../../service/remote/solr/solr.js')
// index.js
var app = getApp()

Page({

  /**
   * 数据
   */
  data: {
    poem: [],
    title: "",
    author: "",
    date:'',
    isPreview: app.globalData.isPreViewStatus
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var title = options.title
    var author = options.author
    var date = options.date;
    var poem = JSON.parse(options.poem);

    this.setData({
      poem: poem,
      title: title,
      author: author,
      date: date,
      isPreview: app.globalData.isPreViewStatus
    })

    wx.setNavigationBarTitle({
      title: '诗'
    })

    solr.log({ "event": "onLoad" })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

    solr.log({ "event": "onReady" })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

    solr.log({ "event": "onShow" })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

    solr.log({ "event": "onHide" })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

    solr.log({ "event": "onUnload" })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

    solr.log({ "event": "onPullDownRefresh" })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

    solr.log({ "event": "onReachBottom" })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

    var title = this.data.title
    var author = this.data.author
    var date = this.data.date
    var poem = JSON.stringify(this.data.poem);
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
          title: title,
          path: url 
          }, "share")
  },
  gotoCreatePoem : function() {
    wx.navigateTo({
      url: '/pages/poem/create/index'
    })
    solr.log({"event": "gotoCreatePoem" })
  },
  gotoBack : function() {
    wx.navigateBack()
    solr.log({ "event": "gotoBack" })
  }
})