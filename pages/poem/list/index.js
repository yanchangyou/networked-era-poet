// index.js

var util = require('../../../utils/util.js')
var solr = require('../../../service/remote/solr/solr.js')

var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    poems: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    solr.queryPoems(function (docs) {
      var poems = []
      for (var i = 0; i < docs.length; i++) {
        var doc = docs[i];
        if (doc['poems_s']) {
          //doc.poems_s = JSON.parse(doc.poems_s)
          poems.push(doc)
        }
      }
      that.setData({ poems: docs })
    });

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  poemTap: function (e) {
    var id = e.currentTarget.id;
    var poem = util.findById(this.data.poems, id)

    var title = poem.title
    if (!title) {
      title = '无题'
    }
    // var keywords = this.data.poemKeywords
    // var index = this.data.poemIndex
    var author = poem.author
    var date = poem.createDate
    var poem = JSON.stringify(poem.poem);
    wx.navigateTo({
      url: '/pages/poem/view/index?' + '&title=' + title + '&author=' + author + '&poem=' + poem + '&date=' + date
    })
    app.globalData.isPreViewStatus = false//用于判断用户是否预览状态

  }
})