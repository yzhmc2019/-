// pages/chat/chat.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    svh: '',
    st: 0,
    iwh: 0,
    wh: 0,
    type: '',
    cursorSpacing: 0,
    groupId: '',
    members: '',
    membersData: [],
    https: getApp().globalData.https,
    sy: '',
    msgData: [],
    sendText: '',
    mycheck: 0,
    x: 0,
    y: 0,
    sc: 1,
    imgUrl: '',
    jishiqi: '',
    lunxunSwitch: true,
    scrollBottom: true,
    scrollTop: true,
    swh: 0,
  },

  checkImg: function (e) {
    const wh = wx.getSystemInfoSync().windowHeight;
    const url = 'https://aodi.ekaifa.net' + e.currentTarget.dataset.url + '';
    const array = [];
    array.push(url)
    wx.previewImage({
      current: 'https://aodi.ekaifa.net' + e.currentTarget.dataset.url +'', 
      urls:array
      
    })
    // this.setData({
    //   mycheck: 1,
    //   x: 0,
    //   y: 0,
    //   sc: 1,
    //   imgUrl: e.currentTarget.dataset.url,
    //   wh: wh
    // })
  },

  scrolltolower: function () {
    this.setData({
      scrollBottom: true
    })
  },

  scroll: function (e) {
    const scrollcwh = e.detail.scrollHeight - e.detail.scrollTop;
    if(this.data.svh > scrollcwh - 20){
      this.setData({
        scrollBottom: true
      })
    }else{
      this.setData({
        scrollBottom: false
      })
    }
  },

  close: function () {
    this.setData({
      mycheck: 0
    })
  },

  tuodong: function () {
    this.setData({
      mycheck: 1
    })
  },

  suofang: function () {
    this.setData({
      mycheck: 1
    })
  },

  scrolltoupper: function () {
    const that = this;
    if(this.data.scrollTop){
      this.setData({
        scrollTop: false
      })
      const id = that.data.msgData[0].id;
      wx.showLoading({
        title: '加载中',
        mask: true
      })
      wx.request({
        url: getApp().globalData.https + '/api/index/groupMessage',
        method: 'POST',
        dataType: 'json',
        header: { "content-type": "application/json", "Accept": "application/json" },
        data: {
          group_id: that.data.groupId,
          user_id: wx.getStorageSync('userId'),
          id: id,
          type: 'up'
        },
        success: function (res) {
          if (res.data.code == 0) {
            const group = res.data.data.group.concat(that.data.msgData);
            let ost;
            wx.createSelectorQuery().select("#scrollWrapper").boundingClientRect(function (rect){
               ost = rect.height;
            }).exec();

            that.setData({
              msgData: group
            },function(){
              setTimeout(function(){
                wx.createSelectorQuery().select("#scrollWrapper").boundingClientRect(function (rect) {
                  const st = rect.height - that.data.swh;
                  that.setData({
                    st: rect.height - ost,
                  })
                }).exec();
                wx.hideLoading()
              },500)
              const _st = res.data.data.group.length * 60;
              that.setData({
                st: _st,

              })
              
            })
           
          } else {
            wx.hideLoading()
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 2000
            })
          }
        },
        fail: function(){
          wx.hideLoading()
          wx.showToast({
            title: '加载失败',
            icon: 'none',
            duration: 2000
          })
        },
        complete: function () {
       
          
            that.setData({
              scrollTop: true
            })
          
         
        }
      })
    }
    
  },

  //  发送文字
  sendText: function (e) {
    const that = this;
    this.setData({
      lunxunSwitch: false
    })
    wx.showLoading({
      title: '发送中',
    })
    wx.request({
      url: getApp().globalData.https + '/api/index/sendMessage',
      method: 'POST',
      dataType: 'json',
      header: { "content-type": "application/json", "Accept": "application/json" },
      data: {
        user_id: wx.getStorageSync('userId'),
        group_id: that.data.groupId,
        message: e.detail.value
      },
      success: function (res) {
        wx.hideLoading()
        if (res.data.code == 0) {
        
          let id;
          if(that.data.msgData.length == 0){
            id = ''
          }else{
            const lastIndex = that.data.msgData.length - 1;
            id = that.data.msgData[lastIndex].id;
          }
          wx.request({
            url: getApp().globalData.https + '/api/index/groupMessage',
            method: 'POST',
            dataType: 'json',
            header: { "content-type": "application/json", "Accept": "application/json" },
            data: {
              group_id: that.data.groupId,
              user_id: wx.getStorageSync('userId'),
              id: id
            },
            success: function (res) {
              if (res.data.code == 0) {
                const group = that.data.msgData.concat(res.data.data.group);
                that.setData({
                  msgData: group,
                  lunxunSwitch: true
                })
                setTimeout(function () {
                  that.setData({
                    st: 100000000000
                  })
                }, 100);
              } else {
                wx.showToast({
                  title: res.data.msg,
                  icon: 'none',
                  duration: 2000
                })
              }
            }
          })
          that.setData({
            sendText: ''
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })
        }
      },
      fail: function (){
        wx.hideLoading();
        wx.showToast({
          title: '发送失败',
          icon: 'none',
          duration: 2000
        })
      }
    })
  },

  // 发送图片
  uploadImages: function (e) {
    const that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        that.setData({
          lunxunSwitch: false
        })
        const tempFilePaths = res.tempFilePaths;
        wx.uploadFile({
          url: getApp().globalData.https + "/api/index/uploadFile", // 仅为示例，非真实的接口地址
          filePath: tempFilePaths[0],
          name: 'file',
          formData: {
            user_id: wx.getStorageSync('userId'),
            group_id: that.data.groupId
          },
          success(res) {
            let _res = JSON.parse(res.data);
            if(_res.code == 0){
              let id;
              if (that.data.msgData.length == 0) {
                id = ''
              } else {
                const lastIndex = that.data.msgData.length - 1;
                id = that.data.msgData[lastIndex].id;
              }
              wx.request({
                url: getApp().globalData.https + '/api/index/groupMessage',
                method: 'POST',
                dataType: 'json',
                header: { "content-type": "application/json", "Accept": "application/json" },
                data: {
                  group_id: that.data.groupId,
                  user_id: wx.getStorageSync('userId'),
                  id: id
                },
                success: function (res) {
                  if (res.data.code == 0) {
                    const group = that.data.msgData.concat(res.data.data.group);
                    that.setData({
                      msgData: group,
                      lunxunSwitch: true
                    })
                    setTimeout(function () {
                      that.setData({
                        st: 100000000000
                      })
                    }, 100);
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
              wx.showToast({
                title: _res.msg,
                icon: 'none',
                duration: 2000
              })
            }
          }
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      groupId: options.id,
    })
    wx.setNavigationBarTitle({
      title: options.name
    })
    this.loadChatData();
    const that = this;
    const ww = wx.getSystemInfoSync().windowWidth;
    const wh = wx.getSystemInfoSync().windowHeight;
    const cursorSpacing = (15 * ww) / 750;
    this.setData({
      cursorSpacing: cursorSpacing,
    })
    wx.getSystemInfo({
      success(res) {
        const type = res.model.substr(0, 8);
        if (type == "iPhone X") {
          const ih = (292 * ww) / 750;
          const svh = wh - ih;
          that.setData({
            svh: svh,
            iwh: 182,
            type: 'iPhone X',
            ich: 102
          });
        } else {
          const ih = (212 * ww) / 750;
          const svh = wh - ih;
          that.setData({
            svh: svh,
            iwh: 102,
            ich: 102
          });
          
        }
      }
    });
    // 调接口
    wx.request({
      url: getApp().globalData.https + '/api/index/groupTop',
      method: 'POST',
      dataType: 'json',
      header: { "content-type": "application/json", "Accept": "application/json" },
      data: {
        user_id: wx.getStorageSync('userId'),
        group_id: that.data.groupId
      },
      success: function (res) {
        if (res.data.code == 0) {
          let sy;
          if(res.data.data.user.count > 100){
            sy = "+100";
          }else{
            sy = res.data.data.user.count
          }
          that.setData({
            members: res.data.data.user.count,
            membersData: res.data.data.user.list,
            sy: sy
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

  loadChatData: function(){
    const that = this;
    wx.request({
      url: getApp().globalData.https + '/api/index/groupMessage',
      method: 'POST',
      dataType: 'json',
      header: { "content-type": "application/json", "Accept": "application/json" },
      data: {
        group_id: that.data.groupId,
        user_id: wx.getStorageSync('userId'),
        id: ''
      },
      success: function (res) {
        if (res.data.code == 0) {
          that.setData({
            msgData: res.data.data.group
          })
          setTimeout(function(){
            const query = wx.createSelectorQuery();
            query.select("#scrollWrapper").boundingClientRect(function (rect) {
              const st = rect.height - that.data.svh;
              that.setData({
                swh: rect.height
              })
            }).exec();
          },100)
          setTimeout(function () {
            that.setData({
              st: 100000000000
            })
          }, 100);
          setTimeout(function () {
            that.setData({
              st: 100000000000
            })
          }, 500);
          setTimeout(function () {
            that.setData({
              st: 100000000000
            })
          }, 1000);
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

  updateChatData: function () {
    const that = this;
    let id;
    if(this.data.msgData.length == 0){
      id = '';
    }else{
      const lastIndex = that.data.msgData.length - 1;
      id = that.data.msgData[lastIndex].id;
    }
    this.setData({
      lunxunSwitch: false
    })
    wx.request({
      url: getApp().globalData.https + '/api/index/groupMessage',
      method: 'POST',
      dataType: 'json',
      header: { "content-type": "application/json", "Accept": "application/json" },
      data: {
        group_id: that.data.groupId,
        user_id: wx.getStorageSync('userId'),
        id: id
      },
      success: function (res) {
        if (res.data.code == 0) {
          const group = that.data.msgData.concat(res.data.data.group);
          that.setData({
            msgData: group,
          })
          if (that.data.scrollBottom) {
            setTimeout(function () {
              that.setData({
                st: 100000000000
              })
            }, 100);
          } else {

          }
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })
        }
      },
      complete: function(){
        that.setData({
          lunxunSwitch: true
        })
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
    const that = this;
    setInterval(function(){
      if(that.data.lunxunSwitch){
        that.updateChatData();
      }
    },3000)
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