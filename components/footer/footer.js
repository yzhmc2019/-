// pages/footer/footer.js
Component({
  properties:{
    pageFrom: {
      type: String
    },
    danmuShow: {
      type: String
    },
    tabBarH: {
      type: String
    }
  },
  data:{
    navBarH: 0,
    barrageShow: false
  },
  ready: function () {
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
  },
  methods: {
    goHome: function(e){
      if(this.properties.pageFrom != "home"){
        wx.redirectTo({
          url: '/pages/homepage/homepage',
        })
      }
    },
    goGroup: function(){
      if (this.properties.pageFrom != "group"){
        wx.redirectTo({
          url: '/pages/group/group',
        })
      }
      
    },
    goBarrage: function(){
      if (wx.getStorageSync('userId')) {
        wx.navigateTo({
          url: '/pages/barrage/barrage',
        })
      } else {
        wx.navigateTo({
          url: '/pages/login/login?pageFrom=footer',
        })
      }
      
    }
  }
})