var util = require('./utils/util.js')

//app.js
var app = App({
  getUserInfo:function(cb){
    var that = this
    if(this.globalData.userInfo){
      typeof cb == "function" && cb(this.globalData.userInfo)
    }else{
      //调用登录接口
      wx.login({
        success: function () {
          // var code = loginRes.code
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              // wx.request({
              //   url: 'https://dev.321zou.com/sns/jscode2session?appid=wxe65a58e7d670475d&secret=08d4a1819589cfcd7c0ed5827bca0ebf&js_code=' + code + '&grant_type=authorization_code',
              //   header: {
              //     'content-type': 'application/json'
              //   },
              //   success: function (apiRes) {
              //     console.log(apiRes.data)

              //     //var result = util.decryptData(res.encryptedData, res.iv)
              //     //console.log(result)
              //   }
              // })
              typeof cb == "function" && cb(that.globalData.userInfo)
            },
            fail: function (error) {
              console.log(error)
            }
          })
        },
        fail: function (error) {
          console.log(error)
        }
      })
    }
  },
  globalData:{
    userInfo:null,
    isPreViewStatus: false
  },
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    // var logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)
    var that = this;
    setTimeout(function(){
      that.getUserInfo(function (userInfo) {
        that.globalData.userInfo = userInfo
      })
    })

  }
})