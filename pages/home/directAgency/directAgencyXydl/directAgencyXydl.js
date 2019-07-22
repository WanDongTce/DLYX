var network = require("../../../../utils/network.js");
var app = getApp();
var page = 1;
var hasmore = null;
Page({
  data: {
    isShowDialog: false,
    animationData: null,
    list:'',
    keyword: '',
    orderby: '',
    sortname:0,
    sortschool:0,
    sortdate: 0,
    dlxm: '',
    dljb: '',
    dlqy: '',
    ssdl: '',
    zcsj: '',
  },
  onLoad: function (options) {
    
    this.setData({
      sortname:0,
      sortschool: 0,
      sortdate: 0,
    })
    var that=this;
    network.tokenExp(function () {
      that.getList();
    });
    
    
  },
  // 搜索的关键字
  keyword: function (e) {
    this.setData({
      keyword: e.detail.value.replace(/^\s*|\s*$/, '')
    })
  },
  bindconfirm: function (e) {
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 0
    });
    page = 1;
    hasmore = '';
    this.getList(false);
    
  },
  onShow: function () {

  },
  getList: function (){
    var that = this;
    network.POST({
      url: 'v15/agent/just-school-list',
      params: {
        "mobile": app.userInfo.mobile,
        "token": app.userInfo.token,
        "page": page,
        "search": that.data.keyword,
        "orderby": that.data.orderby,
      },
      success: function (res) {
        // console.log(res);
        wx.hideLoading();
        if (res.data.code == 200) {
          var a = res.data.data[0].list;
          
          that.setData({
            list: a,
          });
          hasmore = res.data.data[0].hasmore;
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
    });
  },
  
  showDialog: function () {
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    });
    this.animation = animation;
    animation.translateY(300).step();
    this.setData({
      animationData: animation.export(),
      isShowDialog: true
    });
    setTimeout(function () {
      animation.translateY(0).step();
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200);
  },
  hideDialog: function () {
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    });
    this.animation = animation;
    animation.translateY(300).step();
    this.setData({
      animationData: animation.export()
    });
    setTimeout(function () {
      animation.translateY(0).step();
      this.setData({
        animationData: animation.export(),
        isShowDialog: false,
        agentDetail: {}
      });
    }.bind(this), 200);
  },
  name_dialog:function(e){
    this.showDialog();
    this.setData({
      dlxm: e.currentTarget.dataset.dlxm,
      dljb: e.currentTarget.dataset.dljb,
      dlqy: e.currentTarget.dataset.dlqy,
      ssdl: e.currentTarget.dataset.ssdl,
      zcsj: e.currentTarget.dataset.zcsj,
    })
  },
  onReachBottom: function () {
    var that = this;

    
      if (that.data.list.length > 0) {
        if (hasmore) {
          page++;
          that.getLis(true);
        } else {
          wx.showToast({
            title: '没有更多了',
            image: '../../../../images/error.png',
            duration: 1000
          })
        }
      }
    
  },
  onUnload: function () {
    page = 1;
    hasmore = null;
    this.setData({
      keyword: ''
    });
  },
  //排序：姓名
  sortname: function (e) {
    var that = this;
    var sortname = Number(that.data.sortname) + 1;
    // console.log(e.currentTarget.dataset.sortname)
    that.setData({
      sortname: sortname,
      sortschool:0,
      sortdate:0
    })
    if(sortname%2==1){
      that.setData({
        orderby: '1-1',
      })
      wx.pageScrollTo({
        scrollTop: 0,
        duration: 0
      });
      page = 1;
      hasmore = '';
      this.getList(false);
    }
    else if (sortname % 2 == 0){
      that.setData({
        orderby: '1-2',
      })
      wx.pageScrollTo({
        scrollTop: 0,
        duration: 0
      });
      page = 1;
      hasmore = '';
      this.getList(false);
    }
  },
  //排序：学校
  sortschool: function (e) {
    var that = this;
    var sortschool = Number(that.data.sortschool) + 1;
    // console.log(e.currentTarget.dataset.sortname)
    that.setData({
      sortname:0,
      sortdate: 0,
      sortschool: sortschool
    })
    if (sortschool % 2 == 1) {
      that.setData({
        orderby: '2-1',
      })
      wx.pageScrollTo({
        scrollTop: 0,
        duration: 0
      });
      page = 1;
      hasmore = '';
      this.getList(false);
    }
    else if (sortschool % 2 == 0) {
      that.setData({
        orderby: '2-2',
      })
      wx.pageScrollTo({
        scrollTop: 0,
        duration: 0
      });
      page = 1;
      hasmore = '';
      this.getList(false);
    }
  },
  //排序：日期
  sortdate: function (e) {
    var that = this;
    var sortdate = Number(that.data.sortdate) + 1;
    // console.log(e.currentTarget.dataset.sortname)
    that.setData({
      sortname: 0,
      sortschool: 0,
      sortdate: sortdate
    })
    if (sortdate % 2 == 1) {
      that.setData({
        orderby: '3-1',
      })
      wx.pageScrollTo({
        scrollTop: 0,
        duration: 0
      });
      page = 1;
      hasmore = '';
      this.getList(false);
    }
    else if (sortdate % 2 == 0) {
      that.setData({
        orderby: '3-2',
      })
      wx.pageScrollTo({
        scrollTop: 0,
        duration: 0
      });
      page = 1;
      hasmore = '';
      this.getList(false);
    }
  },
  tz_directAgencyXydlSchool:function(e){
    wx.navigateTo({
      url: '/pages/home/directAgency/directAgencyXydlSchool/directAgencyXydlSchool?schoolid=' + e.currentTarget.dataset.schoolid + '&schoolname=' + e.currentTarget.dataset.schoolname + '&mytype=' + 2,
    })
  }
})