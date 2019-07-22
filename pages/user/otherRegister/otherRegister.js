// pages/user/otherRegister/otherRegister.js
var network = require("../../../utils/network.js")
var QR = require("../../../utils/qrcode.js");
var app = getApp();
Page({
  data: {
    // src:'',
    // tuiguangid: '',
    myname: '',
    headerimg: '',
    maskHidden: true,
    imagePath: '',
    placeholder: 'ajihua',//默认二维码生成文本
    qrtext: '',
  },
  onLoad:function(options){
    this.setData({
      tuiguangid:options.tuiguangid,
    })
    var that = this;
    if(options.tuiguangid==1){
      wx.setNavigationBarTitle({ title: '学生推广' })
    }
    else if(options.tuiguangid == 2){
      wx.setNavigationBarTitle({ title: '代理推广' })
    }
    var that = this;  
    network.tokenExp(function () {
      that.getList()
    });
    
    wx.getStorage({
      key: 'userInfo',
      success: function (res) {
        that.setData({
          myname: res.data.realname,
          headerimg: res.data.avatar,
        })
      },
      fail: function (res) {
        that.setData({
          hidden: true
        })
      }
    })
    that.setData({
      maskHidden: false,
    });
    
  },
  onReady: function () {
    var size = this.setCanvasSize();//动态设置画布大小
    
  },
  getList:function(){
    var that = this;
    network.POST({
      url: 'v15/user-info/extension-url',
      params: {
        "mobile": app.userInfo.mobile,
        "token": app.userInfo.token,
      },
      success: function (res) {
        console.log(res);
        wx.hideLoading();
        if (res.data.code == 200) {
          if (that.data.tuiguangid==1){
            // console.log(res)
            that.setData({
              src: res.data.data[0].item.student
            });
            // console.log(that.data.src)
          }
          else if (that.data.tuiguangid == 2) {
            that.setData({
              src: res.data.data[0].item.agent
            });          
          }
          wx.hideToast()
          var size = that.setCanvasSize();
          //绘制二维码
          var username = res.data.username
          var myurl = that.data.src;          
          that.createQrCode(myurl, "mycanvas", size.w, size.h);
          that.setData({
            maskHidden: true,
            qrtext: '1. 打开微信扫一扫，扫描此二维码进行推广注册',
            qrtext2: '2. 截图（或长按）保存此二维码后在相册中查看使用',
          });
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
  //适配不同屏幕大小的canvas
  setCanvasSize: function () {
    var size = {};
    try {
      var res = wx.getSystemInfoSync();
      var scale = 750 / 400;//不同屏幕下canvas的适配比例；设计稿是750宽
      var width = res.windowWidth / scale;
      var height = width;//canvas画布为正方形
      size.w = width;
      size.h = height;

    } catch (e) {
      // Do something when catch error
      console.log("获取设备信息失败" + e);
    }
    return size;
  },
  createQrCode: function (url, canvasId, cavW, cavH) {
    //调用插件中的draw方法，绘制二维码图片
    QR.qrApi.draw(url, canvasId, cavW, cavH);

  },
  //获取临时缓存照片路径，存入data中
  canvasToTempImage: function () {
    var that = this;
    wx.canvasToTempFilePath({
      canvasId: 'mycanvas',
      success: function (res) {
        var tempFilePath = res.tempFilePath;
        console.log("********" + tempFilePath);
        that.setData({
          imagePath: tempFilePath,
        });
      },
      fail: function (res) {
        console.log(res);
      }
    });
  },

  previewImg: function (e) {
    wx.canvasToTempFilePath({
      canvasId: 'mycanvas',
      success: function (res) {
        console.log(res)
        var tempFilePath = res.tempFilePath;
        
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success(res) {
            wx.showToast({
              title: '已保存到相册',
              icon: 'success',
              duration: 1000
            });
          },
          fail(res) {
            wx.openSetting({
              success: (res) => {

              }
            })
          }
        })

      },
      fail: function (res) {
        wx.showToast({
          title: '保存失败',
          image: '../../../images/home/error.png',
          duration: 1000
        });
      }
    });


  },
  formSubmit: function (e) {
    var that = this;
    var url = e.detail.value.url;
    that.setData({
      maskHidden: false,
    });
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 2000
    });
    var st = setTimeout(function () {
      wx.hideToast()
      var size = that.setCanvasSize();
      //绘制二维码
      that.createQrCode(url, "mycanvas", size.w, size.h);
      that.setData({
        maskHidden: true
      });
      clearTimeout(st);
    }, 1500)

  }

})