// pages/user/user.js
var network = require("../../utils/network.js")
var app = getApp();

Page({
  data: {
    hidden: true,

    username: '',
    xm: '',
    dailitypeStr: '',
    userheaderimg: '../../images/user/headPortrait.png',
  },
  onLoad: function (options) {
    
  },

  onReady: function () {
    
  },
  onShow: function () {
    var that = this;
    network.tokenExp(function () {
      that.getUserInfo();
    });
  },
  getUserInfo: function () {
    var that = this;
    network.POST({
      url: 'v15/user-info/index',
      params: {
        "mobile": app.userInfo.mobile,
        "token": app.userInfo.token
      },
      success: function (res) {
        // console.log(res);
        wx.hideLoading();
        if (res.data.code == 200) {
          var a = res.data.data[0].item;
          that.setData({
            info: a
          });
          wx.getStorage({
            key: 'userInfo',
            success: function (res2) {
              // console.log(res2)
              var obj = res2.data;
              obj.realname = a.realname;
              obj.avatar = a.avatar;
              obj.sex = a.sex;
              obj.agentlev_name = a.agentlev_name;
              obj.is_paypwd = a.is_paypwd;               
              wx.setStorage({
                key: 'userInfo',
                data: obj,
              })
            }
          })
          
        } else {
          wx.showToast({
            title: res.data.message,
            image: '../../images/error.png',
            duration: 1000
          });
        }
      },
      fail: function () {
        wx.hideLoading();
        wx.showToast({
          title: '服务器异常',
          image: '../../images/error.png',
          duration: 1000
        })
      }
    });
  },  
  //点击第一行
  tz_loginAfter: function () {    
      wx: wx.navigateTo({
        url: '/pages/user/inforModify/inforModify',
      })    
  },
  //退出登录
  exitLogin: function () {
    app.userInfo = null;
    wx.clearStorage();
    this.setData({
      hidden: true,
    })

    // this.setData({      
    //   username: '',
    //   xm: '',
    //   dailitypeStr: '',
    //   userheaderimg: '../../images/user/headPortrait.png',
    // })
    wx: wx.reLaunch({
      url: '/pages/user/login/login',
    })
  },
   
  //点击联系我们
  tz_kefu: function () {
    wx.navigateTo({
        url: '/pages/user/customerService/customerService',
    })
  },
  //点击使用帮助
  tz_help: function () {
    wx: wx.navigateTo({
      url: '/pages/user/help/help',
    })

  },
  //点击余额提现
  tz_cash: function () {
    
      wx: wx.navigateTo({
        url: '/pages/user/cash/cash',
      })
    

  },
  //点击学生推广
  tz_otherRegister: function () {
    
      wx: wx.navigateTo({
        url: '/pages/user/otherRegister/otherRegister?tuiguangid=' + '1',
      })
    

  },
  //点击代理推广
  tz_dailiRegister: function () {
    wx: wx.navigateTo({
      url: '/pages/user/otherRegister/otherRegister?tuiguangid=' + '2',
    })
      

  },
  tz_card:function(){
    wx.navigateTo({
      url: '/pages/user/mycard/mycard',
    })
  },
  tz_member: function () {
    wx.navigateTo({
      url: '/pages/home/directMember/directMember?mytype=' + '1'
    })
  },
})