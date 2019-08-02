var network = require("../../../utils/network.js")
var app = getApp();

var page = 1;

var flag = false;

Page({
  data: {
    currentTabIndex: 0,
    list: [],
    num0:'', 
    num1: '',
    num2: '',
  },
  onLoad: function (options) {
    var that=this;
    network.tokenExp(function () {
      that.getList(0, flag, page)
    });
    
    
    
    
    
  },
  tabFun: function (e) {
    var that = this;
    var a = parseInt(e.currentTarget.dataset.tabindex);
    page = 1;
    
    flag = false;
    switch (a) {
      case 0:
        network.tokenExp(function () {
          that.getList('', flag, page);
        });
        
        break;
      case 1:
        network.tokenExp(function () {
          that.getList(1, flag, page);
        });
        
        break;
      case 2:
        network.tokenExp(function () {
          that.getList(2, flag, page);
        });
        
        break;
    };
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 0
    });
    that.setData({
      currentTabIndex: a
    });
  },
  getList: function (typenum,flag, page){
    var that=this;
    network.POST({
      url: "v15/card-bag/card-list",
      params: {
        "mobile": app.userInfo.mobile,
        "token": app.userInfo.token,
        "status": typenum,  
        "page": page,  
                       
      },
      success: function (res) {
        // console.log(res)
        wx.hideLoading();               
        if (res.data.code == 200) {
          var b = res.data.data[0].list;
          if (flag) {            
            that.setData({
              list: that.data.list.concat(b)
            });
          } else {
            that.setData({
              list: b
            });
          }
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
    })
  },
  tz_grant:function(e){
    wx.navigateTo({
      url: '/pages/user/mycard/grand/grand?tgkid=' + e.currentTarget.dataset.tgkid,
    })
  },
  onShow:function(){
    var that=this;
    network.POST({
      url: "v15/card-bag/count",
      params: {  
        "mobile": app.userInfo.mobile,
        "token": app.userInfo.token,      
      },
      success: function (res) {
        wx.hideLoading();
        wx.hideLoading();
        if (res.data.code == 200) {
          that.setData({
            num0: res.data.data[0].item.all,
            num1: res.data.data[0].item.status1,
            num2: res.data.data[0].item.status2,
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
  onReachBottom: function () {
    var that = this;
    wx.showToast({
      title: '加载中...',
      duration: 1000,
      icon: 'loading'
    })
    page++;
    // console.log(page)
    flag = true;
    var a = that.data.currentTabIndex;
    switch (a) {
      case 0:
        // console.log(page)
        that.getListMore('', flag, page);
        break;
      case 1:
        that.getListMore(1, flag, page);
        break;
      case 2:
        that.getListMore(2, flag, page);
        break;
    };

  },
  getListMore: function (typenum, flag, page){
    var that = this;
    network.POST({
      url: "v15/card-bag/card-list",
      params: {        
        "mobile": app.userInfo.mobile,
        "token": app.userInfo.token,
        "status": typenum,
        "page": page,
      },
      success: function (resnew) {
        // console.log(resnew.data.result)
        wx.hideLoading();
        if (resnew.data.code == 200) {
          if (resnew.data.data[0].hasmore == 0) {
            wx.showToast({
              title: '没有更多了',
              image: '../../../images/error.png',
              duration: 1000
            });
            return false
          }
          else{
            that.setData({             
              list: that.data.list.concat(resnew.data.data[0].list),
            });
          }
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
})