//index.js

var md5 = require('../../utils/md5.js')

//获取应用实例
var app = getApp()
Page({
  data: {
    poems: [["大江桥上得南花",
      "漠北端容此意加",
      "孤鹤更从山外见",
      "烟霞气象有中涯"]],
    poemIndex: 0,
    userInfo: {},
    poemKeywords: "",
    progressDisplay: "none",
    progressPercent: 0,
    poemContentDisplay: "",
    showNextPomeDisplay:"none"
  },
  setPoemKeywords: function(e) {
    var poemKeywords = e.detail.value;
    this.setData({ poemKeywords: poemKeywords});
  },
  makePoem: function() {
    var seed = this.data.poemKeywords;
    var poemType = '4';
    var uuid = md5.lmd5(seed + "-" + poemType);
    var that = this;
    var timer = setInterval(function () {
      var progressPercent = that.data.progressPercent;
      if (progressPercent > 100) {
        progressPercent = -5;
      }
      that.setData({
        progressPercent: progressPercent + 3
      });
      console.log("progressPercent:" + progressPercent)
    }, 100);
    //10秒之后开始清除timer，防止无限调用
    setTimeout(function () {
      clearInterval(timer);
      console.log("10秒超时");
    }, 10000)
    wx.request({
      url: 'https://dev.321zou.com/poem/getpoems',
      data: {
        'seed': seed,
        'type': poemType,
        'uuid': uuid
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res.data)
        var poems = res.data.poems;

        clearInterval(timer);
        that.setData({ progressDisplay: 'none', poemContentDisplay: '' })
        that.setData({ poems: poems, poemIndex: 0 });

        if (poems.length > 1) {
          that.setData({ showNextPomeDisplay: '' })
        }
      },
      fail: function (e) {
        clearInterval(timer);
        console.log("网络请求错误：" + e)
      }
    })

    this.setData({ progressDisplay: '', poemContentDisplay: 'none' })

  },
  //事件处理函数
  bindPoemTap: function() {
    setTimeout(this.makePoem, 500);
  },
  showNextPome : function(){
    var poemIndex = this.data.poemIndex;
    var poemLength = this.data.poems.length;
    poemIndex = (++poemIndex) % poemLength;
    console.log("poemIndex:" + poemIndex);
    this.setData({ poemIndex: poemIndex});
  },
  onLoad: function () {
    console.log('onLoad')
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo
      })
    })
  }
})
