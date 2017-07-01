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
    this.refresh()
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

    app.globalData.isPreViewStatus = false//用于判断用户是否预览状态
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
    this.refresh()
    wx.stopPullDownRefresh()
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
  refresh: function () {
    var that = this;
    var param = {}
    solr.queryPoems(param, function (docs) {
      solr.queryLike({}, function (poemIds) {
        for (var i = 0; i < docs.length; i++) {
          var likeCount = 0
          for (var j = 0; j < poemIds.length; j += 2) {
            if (poemIds[j] === docs[i].id) {
              likeCount = poemIds[j + 1]
              break;
            }
          }
          docs[i].likeCount = likeCount
        }
        that.setData({ poems: docs })
      })
    });

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
    var authorAvatarUrl = poem.avatarUrl
    var date = poem.date
    var poem = JSON.stringify(poem.poem);
    wx.navigateTo({
      url: '/pages/poem/view/index?' + '&title=' + title + '&author=' + author + '&poem=' + poem + '&publishedPoemId=' + id + '&authorAvatarUrl=' + authorAvatarUrl
    })

  }
})