

var poemService = require('../../../service/poem/poem.js')
var util = require('../../../utils/util.js')

var app = getApp()

Page({
  /**
   * 数据
   */
  data: {
    poems: [["小桥流水里","湘浦荻花时","一夜三杯酒","孤舟万顷陂"]],
    poemIndex: 0,
    userInfo: {},
    poemKeywords: "",
    progressDisplay: "none",
    progressPercent: 0,
    poemContentDisplay: "",
    showNextPomeDisplay: "none",
    poemTitle: '',
    poemTypeIndex : 3,
    poemType: ['五言起头', '七言起头', '五言藏头', '七言藏头'],
    poemTypeTips: ['输入首句前几个字', '输入首句前几个字','输入前四个字', '输入前四个字']
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
    wx.setNavigationBarTitle({
      title: '为你作一首诗'
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }, 
  selectPoemType: function (e) {
    this.setData({
      poemTypeIndex: e.detail.value
    })
  },
  setTitle: function (e) {
    var poemTitle = e.detail.value
    poemTitle = util.escapeXChar(poemTitle)
    this.setData({ poemTitle: poemTitle })
  },
  /**
   * 预览
   */
  preViewPoem : function() {
    var title = this.data.poemTitle
    if (!title) {
      title = '无题'
    }
    var author = this.data.userInfo.nickName
    var date = new Date().toLocaleDateString();
    var poem = JSON.stringify(this.data.poems[this.data.poemIndex]);
    wx.navigateTo({
      url: '/pages/poem/view/index?poem=' + poem + '&title=' + title + '&author=' + author + '&date=' + date,
      fail : function() {//连续跳转5次，就会失败
        wx.navigateBack({
          delta: 3
        })
      }
    })
    app.globalData.isPreViewStatus = true//用于判断用户是否预览状态

  },
  setPoemKeywords: function (e) {
    var poemKeywords = e.detail.value
    poemKeywords = util.escapeXChar(poemKeywords)
    this.setData({ poemKeywords: poemKeywords })
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
    var poemType = this.data.poemTypeIndex-(-1);
    var successCallback = function (poems){
      // var poems = res.data.poems

      clearInterval(timer)
      that.setData({ progressDisplay: 'none', poemContentDisplay: '' })
      that.setData({ poems: poems, poemIndex: 0 })

      if (poems.length > 1) {
        that.setData({ showNextPomeDisplay: '' })
      }
    }
    var failCallback = function(e){
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
  }
})