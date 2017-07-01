var solr = require('../../../service/remote/solr/solr.js')
var util = require('../../../utils/util.js')
var poemService = require('../../../service/poem/poem.js')

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
    date: "",
    isPreview: app.globalData.isPreViewStatus,
    id: "",
    publishedPoemId: "",
    authorAvatarUrl: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var keywords, index, title, author, poem, date

    if (options['id']) {
      this.setData({ id: options['id'] })
      var id = options['id']
      var poems = wx.getStorageSync("allPoems")
      var localPoem = null;
      for (var i = 0; i < poems.length; i++) {
        if (poems[i].id === id) {
          localPoem = poems[i]
        }
      }
      if (localPoem) {
        keywords = localPoem.keywords
        index = localPoem.index
        title = localPoem.title
        author = localPoem.author
        poem = localPoem.poem
        date = localPoem.date
      } else {
        wx.showToast({
          title: '此诗不存在！',
          icon: 'error'
        })
      }
    } else {
      keywords = options.keywords
      index = options.index
      title = options.title
      author = options.author
      poem = JSON.parse(options.poem)
      date = options.date

      if (options['publishedPoemId']) {
        this.setData({ publishedPoemId: options['publishedPoemId'], authorAvatarUrl: options['authorAvatarUrl'] })
      }
    }

    this.setData({
      keywords: keywords,
      index: index,
      poem: poem,
      title: title,
      author: author,
      date: date,
      isPreview: app.globalData.isPreViewStatus
    })

    solr.log({ "pageCode": pageCode, "event": "onLoad", data: JSON.stringify(this.data) })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

    wx.setNavigationBarTitle({
      title: '诗'
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
  onShareAppMessage: function (event) {

    var keywords = this.data.keywords
    var index = this.data.index
    var title = this.data.title
    var author = this.data.author
    var poem = JSON.stringify(this.data.poem)
    var date = this.data.date
    var url = '/pages/poem/view/index?' + '&keywords=' + keywords + '&index=' + index + '&title=' + title + '&author=' + author + '&poem=' + poem + '&date=' + date;

    //分享时，默认存档
    this.savePoem(event, "赠送集")

    solr.log({
      "pageCode": pageCode,
      title: title,
      path: url
    }, "share")

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
  },
  savePoem: function (event, tags) {
    var data = this.data;
    var poem = {
      id: data.id,
      keywords: data.keywords,
      index: data.index,
      title: data.title,
      author: data.author,
      poem: data.poem,
      date: data.date,
      time: util.formatTime(new Date()),
      tags: tags || "草稿集"
    };

    poem = poemService.save(poem)

    this.setData({ id: poem.id })

    if (!tags) {
      wx.showToast({
        title: '已入我的草稿集！'
      })
    }

  },
  gotoCreatePoem: function () {
    wx.switchTab({
      url: '/pages/poem/create/index'
    })
    solr.log({ "pageCode": pageCode, "event": "gotoCreatePoem" })
  },
  gotoBack: function () {
    wx.navigateBack()
    solr.log({ "pageCode": pageCode, "event": "gotoBack" })
  },
  publishPoem: function () {
    var title = this.data.title
    var author = this.data.author
    var poem = this.data.poem
    var date = this.data.date
    var avatarUrl = app.globalData.userInfo.avatarUrl
    var id = util.makeDataId()
    var time = util.formatTime(new Date())

    var poem = {
      id: id,
      author: author,
      title: title,
      date: date,
      poem: poem,
      avatarUrl: avatarUrl,
      time: time
    }

    solr.savePoem(poem, function () {
      wx.showToast({
        title: '发表成功！',
      })
    })
  },
  likePoem: function (e) {
    var avatarUrl = app.globalData.userInfo.avatarUrl
    var userId1 = util.getUserId1(avatarUrl)
    var publishedPoemId = this.data.publishedPoemId
    var user = {}
    util.merge(app.globalData.userInfo, user)
    user['id1'] = userId1

    var poem = {}

    poem['id'] = publishedPoemId
    poem['title'] = this.data.title
    poem['author'] = this.data.author
    poem['poem'] = this.data.poem
    poem['date'] = this.data.date
    poem['avatarUrl'] = this.data.authorAvatarUrl

    solr.likePoemLog(user, poem)

  }
})