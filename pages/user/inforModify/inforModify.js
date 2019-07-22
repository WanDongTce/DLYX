// pages/user/inforModify/inforModify.js
var network = require("../../../utils/network.js");
var app = getApp();
Page({
  data: {
    array: ['男', '女'],
    index: 1,    
    oldPic: false,
    headImg: '',
    headImgUrl: '',
  },
  bindPickerChange: function (e) {    
    var xb
    if (e.detail.value == 0) {
      xb = 1
    }
    if (e.detail.value == 1) {
      xb = 2
    }
    network.POST({
      url: 'v15/user-info/update',
      params: {        
        'mobile': app.userInfo.mobile,
        'token': app.userInfo.token,
        'sex': xb,
      },
      success: function (res) {
        wx.hideLoading()
        console.log(res)
        if (res.data.code == 200) {         
          wx.showToast({
            title: '修改成功',
            icon: 'succsss',
            duration: 1000,
            success: function () {
            }
          })
        } else {
          wx.showToast({
            title: '修改失败',
            image: '../../../images/home/error.png',
            duration: 1000
          })
        }
      },
      fail: function () {
        wx.hideLoading()
        wx.showToast({
          title: '服务器异常',
          image: '../../../images/home/error.png',
          duration: 1000
        })
      }
    })
    this.setData({
      index: e.detail.value
    })
    wx.getStorage({
      key: 'userInfo',
      success: function (res2) {
        // console.log(res2)
        var obj = res2.data;        
        obj.sex = xb.toString();        
        wx.setStorage({
          key: 'userInfo',
          data: obj,
        })
      }
    })
  },

  //修改账户密码
  tz_modifypassword: function () {
    wx.navigateTo({
      url: '/pages/user/inforModify/modifyPassword/modifyPassword',
    })
  },
  //设置提现密码
  tz_txpassword: function () {
    wx.navigateTo({
      url: '/pages/user/inforModify/txPassword/txPassword',
    })
    
  },
  tz_bankcard: function () {
    wx.navigateTo({
      url: '/pages/user/inforModify/bankcard/bankcard',
    })
  },
  onLoad: function (options) {
      
  },
  
  
  onShow: function () {
    var that = this;
    network.tokenExp(function () {
      that.getUserInfo()
    });     
  },
  getUserInfo:function(){
    var that=this;
    wx.getStorage({
      key: 'userInfo',
      success: function (res) {

        var index;
        if (res.data.sex == "1") {
          index = 0;
        } else {
          index = 1;
        } 
        that.setData({
          index:index
        })               
      },
    })
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
            info: a,                        
            headImg: a.avatar
          });
        } else {
          wx.showToast({
            title: res.data.message,
            image: '../../../images/error.png',
            duration: 1000
          });
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
    });
  },
  modHead: function () {
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        // console.log(res.tempFilePaths);
        that.setData({
          headImgUrl: res.tempFilePaths[0]
        });
        that.uploadImg();
      }
    });
  },
  uploadImg: function () {
    var that = this;
    wx.showLoading({
      title: '加载中',
    });
    // console.log(that.data.headImg);
    wx.uploadFile({
      url: app.requestUrl + 'v14/public/upload',
      filePath: that.data.headImgUrl,
      name: "avatar",
      formData: {
        // 'mobile': app.userInfo.mobile,
        // 'token': app.userInfo.token,
        // 'app_source_type': app.app_source_type
      },
      success: function (res) {
        console.log(res);
        wx.hideLoading();
        var a = JSON.parse(res.data);       
        if (a.code == 200) {
          //修改头像
          network.POST({
            url: 'v15/user-info/update',
            params: {
              "mobile": app.userInfo.mobile,
              "token": app.userInfo.token,
              "avatar": a.data[0].list[0].file_url
            },
            success: function (res5) {
              // console.log(res5);
              wx.hideLoading();
              if (res5.data.code == 200) {   
                wx.showToast({
                  title: '修改成功',
                  duration: 1000
                });            
                that.setData({
                  headImg: a.data[0].list[0].file_url
                });
                
              } else {
                wx.showToast({
                  title: res5.data.message,
                  image: '../../../images/error.png',
                  duration: 1000
                });
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
        } else {

          wx.showToast({
            title: '上传失败',
            image: '../../../images/error.png',
            duration: 1000
          });

        }
      },
      fail: (res) => {

        wx.showToast({
          title: '服务器异常',
          image: '../../../images/error.png',
          duration: 1000
        })
      }
    });

  }
  
  
})