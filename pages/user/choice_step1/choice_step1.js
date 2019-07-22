// pages/user/choice_step1/choice_step1.js
var network = require("../../../utils/network.js")
var md5 = require("../../../utils/md5.js")
var app = getApp();

Page({

  
  data: {
      phone:''
  },

  onLoad: function (options) {
      
  },
  inputphone:function(){
      this.setData({
          phone: e.detail.value.replace(/^\s*|\s*$/, '')
      })
        // if(!(/^1(3|4|5|7|8)\d{9}$/.test(username))) {
        //     wx.showToast({
        //         title: '手机号不合法',
        //         image: '../../images/error.png',
        //         duration: 1000
        //     })
        // }
  },
    clickfinish:function(){
        var that = this;
        var phone = that.data.phone;
        if (!(/^1(3|4|5|7|8)\d{9}$/.test(phone))) {
            wx.showToast({
                title: '手机号不合法',
                image: '../../../images/error.png',
                duration: 1000
            })
        }
        else{
            network.POST({
                url: 'v15/user-info/update-agent',
                params: {
                    "mobile": app.userInfo.mobile,
                    "token": app.userInfo.token,
                    "parent_mobile": phone,

                },
                success: function (res) {
                    console.log(res);
                    wx.hideLoading();
                    if (res.data.code == 200) {
                        that.clicktiaoguo();

                    } else {
                        wx.showToast({
                            title: res.data.message,
                            icon: 'none',
                            duration: 1000
                        });
                    }
                },
                fail: function () {
                    wx.hideLoading();
                    wx.showToast({
                        title: '服务器异常',
                        icon: 'none',
                        duration: 1000
                    })
                }
            });
        }
    },
    clicktiaoguo:function(){
        wx.switchTab({
            url: '/pages/home/home'
        });
           
        
    }
})