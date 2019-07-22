// pages/user/login/login.js
var network = require("../../../utils/network.js")
var md5 = require("../../../utils/md5.js")
var app = getApp();

Page({
  data: {
    scrollWidth:'',
    username: '',
    password: ''
  },
  onLoad: function (options) {   
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          scrollWidth: res.windowWidth - res.windowWidth / 750 * 150
        });
      }
    });
  },
  userNameInput: function (e) {
    this.setData({
      username: e.detail.value.replace(/^\s*|\s*$/, '')
    })
  },
  passWordInput: function (e) {
    this.setData({
      password: e.detail.value.replace(/^\s*|\s*$/, '')
    })
  },
  //提交表单
  loginBtnClick: function (e) {
    var that=this;
    var username = that.data.username;
    var password = that.data.password;
    if (username.length == 0) {
      wx.showToast({
        title: '手机号不合法',
        image: '../../../images/error.png',
        duration: 1000
      });
      return false
    }
    else if (password.length == 0) {
      wx.showToast({
        title: '请输入密码',
        image: '../../../images/error.png',
        duration: 1000
      });
      return false
    }
    else {
      //成功
      network.POST({
        url: 'v15/login/index',
        params: {
          "mobile": username,
          "password": md5.hexMD5(password),
          "login_source": "1",
          "version_number": "0",          
        },
        success: function (res) {
          wx.hideLoading();
        //   console.log(res) 
            if (res.data.code == 200) {
                var a = res.data.data[0].item; 
                wx.setStorage({
                    key: 'userInfo',
                    data: a
                });
                app.userInfo = a; 
                if(a.agentlev==0){
                    wx.navigateTo({
                        url: '/pages/user/choice_step3/choice_step3'
                    })
                }
                else{
                    wx.switchTab({
                        url: '/pages/home/home'
                    });
                }
                        
            }
                  
           else {
            wx.showToast({
              title: res.data.message,
              icon:'none',
              duration: 1000
            })
          }
        },
        fail: function () {
          wx.hideLoading();
          wx.showToast({
            title: '服务器异常',
            image: '../../../images/error.png',
            duration: 1000
          })
        }
      })     
      // network.POST({
      //   url: 'account/login',
      //   params: {
      //     "username": e.detail.value.username,
      //     "password": md5.hexMD5(md5.hexMD5(e.detail.value.password)),
      //   },
      //   success: function (res2) {
      //     wx.hideLoading();
      //     if (res2.data.status == "S000") {
      //       wx.showToast({
      //         title: '登录成功',
      //         duration: 1000
      //       })
            
      //       app.userData.userinfo = res2.data.result;
      //       wx.setStorage({
      //         key: 'userinfo',
      //         data: res2.data.result,
      //         success: function () {
      //           wx.navigateBack({

      //           })
      //         }
      //       })
      //     }
      //     else {           
      //       wx.showModal({
      //         title: '提示',
      //         content: res2.data.msg,
      //       })
      //     }

      //   },
      //   fail: function () {
      //     wx.hideLoading();
      //     wx.showToast({
      //       title: '服务器异常',
      //       image: '../../../images/home/error.png',
      //       duration: 1000
      //     })
      //   }
        
      // })
      
    }
  },
  //忘记密码
  tz_forget: function () {
    wx.navigateTo({      
      url: '/pages/user/inforModify/modifyPassword/modifyPassword?title=' + '找回密码',
    })
  },

})