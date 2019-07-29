// pages/details/details.js
var wxParse = require('../../wxParse/wxParse.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    detailsData: {
      img: ''
    },
    https: getApp().globalData.https,
    pad: 0
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (wx.getStorageSync('jixing') == "iPhone X"){
      this.setData({
        pad: 80
      })
    }
    const that = this;
    const ww = wx.getSystemInfoSync().windowWidth;
    const left = (50 * ww) / 750;
    // 调接口
    wx.request({
      url: getApp().globalData.https + '/api/index/getBrand',
      method: 'POST',
      dataType: 'json',
      header: { "content-type": "application/json", "Accept": "application/json" },
      data: {
        id: options.id
      },
      success: function (res) {
        if (res.data.code == 0) {
          if(res.data.data.type == 1){
            wx.setNavigationBarTitle({
              title: '车型信息'
            })
          }else{
            wx.setNavigationBarTitle({
              title: '活动信息'
            })
          }
          let  article = res.data.data.content.replace(/\<img/gi, '<img style="width: 100%;height:auto;display:block;position: relative;"');
          res.data.data.content = article;
          that.setData({
            detailsData: res.data.data
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })
        }
      }
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