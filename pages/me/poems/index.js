var util = require('../../../utils/util.js')
var poemService = require('../../../service/poem/poem.js')

var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tagsPoems: [],
    hidden: true,
    list: [],
    scrollTop: 0,
    scrollHeight: 0,
    startX: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {


    //  这里要非常注意，微信的scroll-view必须要设置高度才能监听滚动事件，所以，需要在页面的onLoad事件中给scroll-view的高度赋值    
    // var that = this;
    // wx.getSystemInfo({
    //   success: function (res) {
    //     console.info(res.windowHeight);
    //     that.setData({
    //       scrollHeight: res.windowHeight
    //     });
    //   }
    // });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

    wx.setNavigationBarTitle({
      title: '我的诗集'
    })
    app.globalData.isPreViewStatus = true
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

    this.refresh()

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
  tagTap: function (e) {
    var id = parseInt(e.currentTarget.id.replace("tag-", ""))
    this.data.tagsPoems[id].open = !this.data.tagsPoems[id].open
    this.setData({ tagsPoems: this.data.tagsPoems })
  },
  tagMove: function (e) {
    // console.info(e)
    var id = e.currentTarget.id
    var poem = this.findPoem(id)

    var endX = e.touches[0].clientX
    var startX = this.data.startX
    if (endX - startX > 0) {//向右滑动

    } else { //向左滑动

    }

    if (endX - startX < -500 || endX - startX > 500) {
      return
    }
    poem.marginRight -= Math.round((endX - startX)/5)
    console.info("poem.marginRight:" + poem.marginRight)

    if (poem.marginRight>0) {
      poem.marginRight = 0
    }
    if (poem.marginRight < -100) {
      poem.marginRight = -100
    }
    console.info("poem.marginRight:" + poem.marginRight)
    this.setData({ tagsPoems: this.data.tagsPoems })
  },
  tagMoveStart: function (e) {
    // console.info(e)
    var startX = e.touches[0].clientX;
    this.setData({ startX: startX })
    console.info("startX:" + startX)
  },
  tagMoveEnd: function (e) {
    // console.info(e)

  },
  refresh: function () {
    var poems = poemService.getAllPoems()

    var poemList = util.map2list(poems)
    for (var i = 0; i < poemList.length; i++) {
      poemList[i]['marginRight'] = -100;
    }
    var tagsPoems = util.list2tags(poemList)
    tagsPoems.push({ tag: "全部集", list: poemList })
    for (var i = 0; i < tagsPoems.length; i++) {
      tagsPoems[i].open = false
    }
    tagsPoems[0].open = true
    this.setData({ tagsPoems: tagsPoems })
  },
  deletePoem: function (e) {
    var id = e.currentTarget.id;
    poemService.del(id)
    this.refresh()
  },
  findPoem: function (id) {
    for (var i = 0; i < this.data.tagsPoems.length; i++) {
      var poems = this.data.tagsPoems[i].list;
      for (var j = 0; j < poems.length; j++) {
        if (id === poems[j].id) {
          return poems[j]
        }
      }
    }
    return null;
  }
})