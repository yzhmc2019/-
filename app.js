//app.js
App({

  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })


  },
  globalData: {
    userInfo: null,
    https: "https://audi.ithinky.com",
    dmControl: 1 // 0 - close, 1 - open
  },
  onShow: function () {

    // set default value  
    this.globalData.dmControl = 1
    if (wx.getStorageSync('barrageSwitch') == '0') {
      this.globalData.dmControl = wx.getStorageSync('barrageSwitch')
    }

    const that = this
    wx.request({
      url: 'https://audi.ithinky.com/api/index/shouBarrage',
      method: 'POST',
      dataType: 'json',
      header: { "content-type": "application/json", "Accept": "application/json" },
      data: {},
      success: function (res) {
        if (res.data.code == 0) {
          if (res.data.data == 0) {
            wx.setStorageSync('barrageSwitch', '0');
            that.globalData.dmControl = 0
          } else {
            wx.setStorageSync('barrageSwitch', '1');
            that.globalData.dmControl = 1
          }
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })
        }
      }
    })

    wx.getSystemInfo({
      success(res) {
        console.log(res.model.substr(0, 8))
        const type = res.model.substr(0, 8);
        if (type == "iPhone X") {
          wx.setStorageSync('navBarH', 162);
          wx.setStorageSync('jixing', "iPhone X");
        } else {
          wx.setStorageSync('navBarH', 122);
          wx.setStorageSync('jixing', " no iPhone X");
        }
      }
    })
  }
})