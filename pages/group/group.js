// pages/group/group.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navBarH: 0,
    groupData: [],
    https: getApp().globalData.https,
    // danmuShow: wx.getStorageSync('barrageSwitch'),
    dmControl: getApp().globalData.dmControl,
    tabBarH: wx.getStorageSync('navBarH')
  },

  goChat: function (e) {
    const id = e.currentTarget.dataset.id;
    const name = e.currentTarget.dataset.name;
    if (wx.getStorageSync('userId')) {
      wx.navigateTo({
        url: '/pages/chat/chat?id=' + id + '&name=' + name + '',
      })
    } else {
      wx.navigateTo({
        url: '/pages/login/login?pageFrom=group&id=' + id + '&name=' + name + '',
      })
    }

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    const that = this;
    wx.getSystemInfo({
      success(res) {
        const type = res.model.substr(0, 8);
        if (type == "iPhone X") {
          that.setData({
            navBarH: 162
          });
        } else {
          that.setData({
            navBarH: 122
          });

        }
      }
    })

    if (this.data.dmControl != getApp().globalData.dmControl) {
      this.setData({
        dmControl: getApp().globalData.dmControl
      })
    }

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
    const that = this;
    wx.request({
      url: getApp().globalData.https + '/api/index/group',
      method: 'POST',
      dataType: 'json',
      header: { "content-type": "application/json", "Accept": "application/json" },
      data: {
        user_id: wx.getStorageSync('userId')
      },
      success: function (res) {
        if (res.data.code == 0) {
          const groupData = res.data.data;
          for (let i = 0; i < groupData.length; i++) {
            groupData[i].description = groupData[i].description.substr(0, 40);
          }
          that.setData({
            groupData: res.data.data
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })
        }
      },
      complete: function () {
        wx.hideLoading()
      }
    });
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