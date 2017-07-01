// index.js

var util = require('../../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    poems: [{ id: "1498385047495.2227", author_s: "李白", title_s: "静夜思静夜思静", avatarUrl_s: "http://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83epKhXVAA3ruU15UQ1c5g0EicyLaJzw28J86SVWwOwZnAJo28NsBa6zeoBJDGMEYibvRiaOhwYrxeUrLg/0", viewCount: 100, likeCount: 10000, commentCount: 1 },
      { id: "1", author_s: "李白", title_s: "静夜思", avatarUrl_s: "http://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83epKhXVAA3ruU15UQ1c5g0EicyLaJzw28J86SVWwOwZnAJo28NsBa6zeoBJDGMEYibvRiaOhwYrxeUrLg/0", viewCount:100,likeCount:10, commentCount:1000 },
      { id: "1", author_s: "李白", title_s: "静夜思", avatarUrl_s: "http://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83epKhXVAA3ruU15UQ1c5g0EicyLaJzw28J86SVWwOwZnAJo28NsBa6zeoBJDGMEYibvRiaOhwYrxeUrLg/0", viewCount: 100, likeCount: 100000, commentCount: 1 },
      { id: "1", author_s: "李白", title_s: "静夜思", avatarUrl_s: "http://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83epKhXVAA3ruU15UQ1c5g0EicyLaJzw28J86SVWwOwZnAJo28NsBa6zeoBJDGMEYibvRiaOhwYrxeUrLg/0", viewCount: 100, likeCount: 10000, commentCount: 100 },
      { id: "1", author_s: "李白", title_s: "静夜思", avatarUrl_s: "http://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83epKhXVAA3ruU15UQ1c5g0EicyLaJzw28J86SVWwOwZnAJo28NsBa6zeoBJDGMEYibvRiaOhwYrxeUrLg/0", viewCount: 100, likeCount: 10, commentCount: 1 },
      { id: "1", author_s: "李白", title_s: "静夜思", avatarUrl_s: "http://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83epKhXVAA3ruU15UQ1c5g0EicyLaJzw28J86SVWwOwZnAJo28NsBa6zeoBJDGMEYibvRiaOhwYrxeUrLg/0", viewCount: 100, likeCount: 10, commentCount: 1  }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
  poemTap: function(e) {
    var id = e.currentTarget.id;
    var poem = util.findById(this.data.poems, id)


  }
})