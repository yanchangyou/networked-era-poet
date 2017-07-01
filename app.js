var util = require('./utils/util.js')
var solr = require('/service/remote/solr/solr.js')

//app.js
var app = App({
  getUserInfo: function (cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.login({
        success: function () {
          // var code = loginRes.code
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo

              typeof cb == "function" && cb(that.globalData.userInfo)

              try {
                if (res.userInfo) {
                  solr.saveUser(res.userInfo)
                }
              } catch (e) {
                console.error("保存用户失败：")
                console.error(e)
              }

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
  globalData: {
    userInfo: null,
    isPreViewStatus: false
  },
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    // var logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)
    var that = this;
    setTimeout(function () {
      that.getUserInfo(function (userInfo) {
        that.globalData.userInfo = userInfo
      })
    })

  }
})