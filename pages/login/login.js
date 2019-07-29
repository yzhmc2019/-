// pages/login/login.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    groupId: '',
    groupName: ''
  },

  bindGetUserInfo: function (e) {
    const that = this;
    wx.login({
      success: function (res) {
        if (res.code) {
          if (e.detail.errMsg == "getUserInfo:ok") {
            wx.request({
              url: getApp().globalData.https + '/api/index/wxLogin',
              method: 'POST',
              dataType: 'json',
              header: { "content-type": "application/json", "Accept": "application/json" },
              data: {
                code: res.code,
                iv: e.detail.iv,
                encryptedData: e.detail.encryptedData
              },
              success: function (res) {
                if (res.data.code == 0) {
                  wx.setStorageSync('touxiang', res.data.data.headimgurl);
                  wx.setStorageSync('nichengjiami', res.data.data.nickName_encryption);
                  wx.setStorageSync('openid', res.data.data.openid);
                  wx.setStorageSync('userId', res.data.data.user_id);
                  wx.showToast({
                    title: "授权成功",
                    icon: 'success',
                    duration: 2000
                  })
                  if(that.data.pageFrom == "footer"){
                    setTimeout(function () {
                      wx.redirectTo({
                        url: '/pages/barrage/barrage',
                      })
                    }, 1500)
                  }
                  if(that.data.pageFrom == "group"){
                    setTimeout(function () {
                      wx.redirectTo({
                        url: '/pages/chat/chat?id=' + that.data.groupId +'&name='+ that.data.groupName +'',
                      })
                    }, 1500)
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
          } else {

          }

        }
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      groupId: options.id,
      pageFrom: options.pageFrom,
      groupName: options.name
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

  }
})