
var app = getApp()

function send(json) {
  console.log("userinfo:" + app.globalData.userInfo)
  json['id'] = "" + new Date().getTime() + Math.random()
  json['avatarUrl_s'] = app.globalData.userInfo.avatarUrl
  json['country_s'] = app.globalData.userInfo.country
  json['gender_s'] = app.globalData.userInfo.gender
  json['nickName_s'] = app.globalData.userInfo.nickName
  json['province_s'] = app.globalData.userInfo.province
  json['city_s'] = app.globalData.userInfo.city
  json['language_s'] = app.globalData.userInfo.language

  wx.request({
    url: 'https://dev.321zou.com/solr/access/update?commitWithin=1000&overwrite=true&wt=json',
    method: 'POST',
    header: {
      'content-type': 'application/json'
    },
    data: JSON.stringify([json]),
    success: function (res) {
      console.log(res.data)
    },
    fail: function (e) {
      console.log("网络请求错误：" + e)
    }
  })
}

module.exports = {
  send: send
}
