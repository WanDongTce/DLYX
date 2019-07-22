// pages/user/register/register.js
var network = require("../../../utils/network.js");
var md5 = require("../../../utils/md5.js");
const app = getApp();
var regMobile = /^1(3|4|5|7|8)\d{9}$/;
var regPassw = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,18}$/;
var c = 60;


Page({

  /**
   * 页面的初始数据
   */
  data: {
      verifyCodeTime: "获取验证码",
      verify_color: false,

      scrollWidth: '',
      username: '',
      password: '',
      verifycode: '',

      passwordimg: '../../../images/login/see_off.png',
      passwordtype_left: 'password',
      passwordtype: 'password',
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
    //手机号
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
    verifycode: function (e) {
        this.setData({
            verifycode: e.detail.value.replace(/^\s*|\s*$/, '')
        })
    },
    //提交表单
    loginBtnClick: function (e) {
        var that = this;
        var username = that.data.username;
        var password = that.data.password;
        var vcode = that.data.verifycode;
        if (!regMobile.test(username)) {
            wx.showToast({
                title: '手机号不合法',
                icon: 'none',
                duration: 1000
            })
        }
        else if (password.length == 0) {
            wx.showToast({
                title: '密码不能为空',
                icon: 'none',
                duration: 1000
            })
        }
        else if (!regPassw.test(password)) {
            wx.showToast({
                title: '密码6-18位，包含至少一个字母和一个数字',
                icon: 'none'
            })
        }
        else if (vcode.length == 0) {
            wx.showToast({
                title: '请输入验证码',
                icon: 'none'
            })
        }
        
        else {
            //成功
            network.POST({
                url: 'v15/login/register',
                params: {
                    "mobile": username,
                    "password": md5.hexMD5(password),
                    "code": vcode,
                    
                },
                success: function (res) {
                    wx.hideLoading();
                    // console.log(res) 
                    if (res.data.code == 200) {
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
                                // console.log(res)
                                if (res.data.code == 200) {
                                    var a = res.data.data[0].item;
                                    wx.setStorage({
                                        key: 'userInfo',
                                        data: a
                                    });
                                    app.userInfo = a;
                                    if (a.agentlev == 0) {
                                        wx.navigateTo({
                                            url: '/pages/user/choice_step3/choice_step3'
                                        })
                                    }
                                    else {
                                        wx.switchTab({
                                            url: '/pages/home/home'
                                        });
                                    }

                                }

                                else {
                                    wx.showToast({
                                        title: res.data.message,
                                        icon: 'none',
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
                        
                    }

                    else {
                        wx.showToast({
                            title: res.data.message,
                            icon: 'none',
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
            

        }
    },
    //验证码
    identify: function (e) {
        var that = this;
        if (!that.data.verify_color) {
            var username = that.data.username;
            var intervalId = null;
            if (!regMobile.test(username)) {
                wx.showToast({
                    title: '手机号不合法',
                    image: '../../../images/error.png',
                    duration: 1000
                })
            }
            else {

                network.POST({
                    url: 'v4/login/sendcode',
                    params: {
                        "mobile": username,
                        "type": 3
                    },
                    success: function (res) {
                        // console.log(res);
                        wx.hideLoading();
                        if (res.data.code == 200) {
                            wx.showToast({
                                title: '发送成功',
                                duration: 1000
                            })
                            that.setData({
                                verify_color: true
                            });
                            intervalId = setInterval(function () {
                                c--;
                                that.setData({
                                    verifyCodeTime: c + 's后重发'
                                })
                                if (c == 0) {
                                    clearInterval(intervalId);
                                    c = 60;
                                    that.setData({
                                        verifyCodeTime: '获取验证码',
                                        verify_color: false
                                    })
                                }
                            }, 1000);
                        } else {
                            wx.showToast({
                                title: res.data.message,
                                image: '../../../images/error.png',
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

            }
        }
    },
    //点击密码图片
    passwordimg: function () {
        var that = this;
        if (that.data.passwordtype == 'password') {
            that.setData({
                passwordimg: '../../../images/login/see_on.png',
                passwordtype: 'text',
            })
        }
        else {
            that.setData({
                passwordimg: '../../../images/login/see_off.png',
                passwordtype: 'password',
            })
        }
    },
    agremt:function(){
        wx.navigateTo({
            url: '/pages/user/agremt/agremt',
        })
    }
})