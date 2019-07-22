var network = require("../../../utils/network.js");
var app = getApp();
Page({
  data: {
    directinfoshow:'',
    numberone:'',
    numbertwo: '',
  },
  onLoad: function (options) {
    var that=this;
    if (app.userInfo.agentlev < 5) {
      that.setData({
        directinfoshow: 1
      })
      network.tokenExp(function () {
        that.getNumberOne();
        that.getNumberTwo()
      });
      
    }
    else {
      that.setData({
        directinfoshow: 2
      })
      network.tokenExp(function () {
        that.getNumberTwo()
      });
      
    }
  },
  getNumberOne:function(){
    var that = this;
    network.POST({
      url: 'v15/agent/just-school-list',
      params: {
        "mobile": app.userInfo.mobile,
        "token": app.userInfo.token,
        "page": 1,
      },
      success: function (res) {
        // console.log(res);
        wx.hideLoading();
        if (res.data.code == 200) {
          var a = res.data.data[0].list;
          that.setData({
            numberone: res.data.data[0].count,
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
  getNumberTwo: function () {
    var that = this;
    network.POST({
      url: 'v15/agent/just-fifty-list',
      params: {
        "mobile": app.userInfo.mobile,
        "token": app.userInfo.token,
        "page": 1,
      },
      success: function (res) {
        // console.log(res);
        wx.hideLoading();
        if (res.data.code == 200) {         
          that.setData({
            numbertwo: res.data.data[0].count,
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
  onShow: function () {

  },
  tz_numberone:function(){
    var that=this;
    if(that.data.numberone==0){
      wx.showToast({
        title: '暂无数据',
        image: '../../../images/error.png',
        duration: 1000
      })
    }
    else{
      wx.navigateTo({
        url: '/pages/home/directAgency/directAgencyXydl/directAgencyXydl',
      })
    }
  },
  tz_numbertwo: function () {
    var that = this;
    if (that.data.numbertwo == 0) {
      wx.showToast({
        title: '暂无数据',
        image: '../../../images/error.png',
        duration: 1000
      })
    }
    else {
      wx.navigateTo({
        url: '/pages/home/directAgency/directJm/directJm',
      })
    }
  },
})