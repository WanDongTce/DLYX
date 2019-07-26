// pages/user/inforModify/txPassword/txPassword.js

var network = require("../../../../utils/network.js");
var md5 = require("../../../../utils/md5.js");
var app = getApp();
Page({
  data: {
    is_paypwd:''
  },
  onLoad:function(){
    
  },
  onShow: function (options) {
    var that=this;
    if (app.userInfo.is_paypwd==2){
      that.setData({
        is_paypwd: 2
      })
    }
    else if (app.userInfo.is_paypwd == 1) {
      that.setData({
        is_paypwd: 1
      })
    }
  },
  //旧密码
  modify_passw_old: function (e) {
    this.setData({
      modify_passw_old: e.detail.value.replace(/^\s*|\s*$/, '')
    })
    if (this.data.modify_passw_old.length == 0) {
      wx.showModal({
        title: '提示',
        content: '旧密码不能为空',
        showCancel: false
      })
      return false;
    }
  },
  //新密码
  modify_passw: function (e) {
    this.setData({
      modify_passw: e.detail.value.replace(/^\s*|\s*$/, '')
    })
    var modify_passw = this.data.modify_passw;
    var regPassw = /^\d{6}$/;
    if (!regPassw.test(modify_passw)) {
      wx.showModal({
        title: '提示',
        content: '提现密码为6位数字',
        showCancel: false
      })
      return false;
    }
  },
  //再次输入密码
  modify_passw_again: function (e) {
    this.setData({
      modify_passw_again: e.detail.value.replace(/^\s*|\s*$/, '')
    })
    if (this.data.modify_passw !== this.data.modify_passw_again) {
      wx.showModal({
        title: '提示',
        content: '再次输入的密码与新密码不符',
        showCancel: false,
      })
      return false;
    }
  },
  onLoad: function (options) {

  },
  //点击提交
  bindFormSubmit: function (e) {
    var regPassw = /^\d{6}$/;
    if(app.userInfo.is_paypwd==1){
      if (e.detail.value.modify_passw_old.length == 0) {
        wx.showModal({
          title: '提示',
          content: '旧密码不能为空',
          showCancel: false
        })
        return false;
      }
    }
    
    if (e.detail.value.modify_passw.length == 0) {
      wx.showModal({
        title: '提示',
        content: '新密码不能为空',
        showCancel: false
      })
      return false;
    }
    else if (!regPassw.test(e.detail.value.modify_passw)) {
      wx.showModal({
        title: '提示',
        content: '提现密码为6位数字',
        showCancel: false
      })
    }
    else if (e.detail.value.modify_passw_again !== e.detail.value.modify_passw) {
      // console.log(111)
      wx.showModal({
        title: '提示',
        content: '再次输入的密码与新密码不符',
        showCancel: false,
      })
      return false
    }
    else {
      // 旧密码
      var password_old = e.detail.value.modify_passw_old;
      if(app.userInfo.is_paypwd==2){
        var p_password_old=''
      }
      else if (app.userInfo.is_paypwd == 1){
        var p_password_old = md5.hexMD5(password_old);
      }
      // 密码
      var password = e.detail.value.modify_passw;
      var that = this;
      // console.log(app.userInfo.mobile)
      network.POST({
        url: 'v15/user-info/set-cash-pwd',
        params: {
          // 'mobile': app.userInfo.mobile,
          // 'password_old': md5.hexMD5(password_old),
          // 'password': md5.hexMD5(password)
          "mobile": app.userInfo.mobile,
          "token": app.userInfo.token,
          "password": p_password_old,
          "password1": md5.hexMD5(password),
          "password2": md5.hexMD5(password),
        },
        success: function (res) {
          wx.hideLoading();
          // console.log(res);
          if (res.data.code == 200) {
            wx.showToast({
              title: '修改密码成功',
              duration: 1000,
              success: function () {
                
              }
            })
            wx.getStorage({
              key: 'userInfo',
              success: function (res2) {
                // console.log(res2)
                var obj = res2.data;                
                obj.is_paypwd = 1;
                app.userInfo.is_paypwd = 1;
                wx.setStorage({
                  key: 'userInfo',
                  data: obj,
                })
              }
            })
            wx.navigateBack({
              
            })
          } else {

            wx.showToast({
              title: res.data.message,
              image: '../../../../images/error.png',
              duration: 1000
            });
          }
        },
        fail: function () {
          wx.hideLoading();
          wx.showToast({
            title: '服务器异常',
            image: '../../../../images/error.png',
            duration: 1000
          })
        }
      })
    }
  }
})