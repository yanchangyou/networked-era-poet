// index.js
var util = require('../../../utils/util.js')

var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '',
    author: '',
    line0: '',
    line1: '',
    line2: '',
    line3: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
    var title = options['title']
    var author = options['author']
    var line0 = options['line0']
    var line1 = options['line1']
    var line2 = options['line2']
    var line3 = options['line3']

    this.setData({title:title,author:author,line0:line0, line1:line1,line2:line2,line3:line3})

    wx.setNavigationBarTitle({
      title: '亲自作诗'
    })
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
  onInputChange: function(e) {
    var value = util.escapeXChar(e.detail.value)
    var field = e.currentTarget.id;
    // this.setData({ field: value })
    this.data[field] = value
    console.log(this.data)
  },
  onTitleChange: function (e) {
    this.onInputChange(e);
  },
  onAuthorChange: function (e) {
    this.onInputChange(e);
  },
  onLine0Change: function (e) {
    this.onInputChange(e);
  },
  onLine1Change: function (e) {
    this.onInputChange(e);
  },
  onLine2Change: function (e) {
    this.onInputChange(e);
  },
  onLine3Change: function (e) {
    this.onInputChange(e);
  },
  gotoBack: function () {
    wx.navigateBack()
  },
  preview: function () {
    
    app.globalData.isPreViewStatus = true//用于判断用户是否预览状态

    var title = this.data.title || '无题'
    var author = this.data.author || '佚名'
    var date = new Date().toLocaleDateString();
    var poem = JSON.stringify([this.data.line0, this.data.line1, this.data.line2, this.data.line3]);
    wx.navigateTo({
      url: '/pages/poem/view/index?poem=' + poem + '&title=' + title + '&author=' + author + '&date=' + date,
      fail: function () {//连续跳转5次，就会失败
        wx.navigateBack({
          delta: 3
        })
      }
    })
  }
})