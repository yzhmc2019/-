// pages/homepage/homepage.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiperIndex: 0,
    navBarH: 0,
    swiperData: [],
    typeData: [],
    https: getApp().globalData.https,
    video: '',
    // danmuShow: wx.getStorageSync('barrageSwitch'),
    dmControl: getApp().globalData.dmControl,
    tabBarH: wx.getStorageSync('navBarH')
  },

  bannerSwiperChange: function (e) {
    this.setData({
      swiperIndex: e.detail.current
    })
  },

  goDetails: function (e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/details/details?id=' + id,
    })
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
    // 调接口
    wx.request({
      url: getApp().globalData.https + '/api/index/index',
      method: 'POST',
      dataType: 'json',
      header: { "content-type": "application/json", "Accept": "application/json" },
      data: {},
      success: function (res) {
        if (res.data.code == 0) {
          that.setData({
            swiperData: res.data.data.activity.list,
            typeData: res.data.data.product.list,
            video: res.data.data.index_video
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