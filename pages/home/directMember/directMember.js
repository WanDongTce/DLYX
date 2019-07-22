var network = require("../../../utils/network.js");
var app = getApp();
var page = 1;
var hasmore = null;
Page({
  data: {

    list: '',
    keyword: '',
    orderby: '',

    schoolid: '',
    schoolname: '',
    mytype: '',
    sorttype: 0,
    sortdate: 0,
    sortname: 0,
    sortschool: 0,
  },
  onLoad: function (options) {
    var that = this;
    
    
      that.setData({
        schoolid: '',
        mytype: options.mytype,
        sorttype: 0,
        sortdate: 0,
        sortname: 0,
        sortschool: 0,
      })
      wx.setNavigationBarTitle({ title: '直属会员' })
    
    network.tokenExp(function () {
      that.getList(false);
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
  getList: function (contaFlag) {
    var that = this;
    network.POST({
      url: 'v15/agent/member-list',
      params: {
        "mobile": app.userInfo.mobile,
        "token": app.userInfo.token,
        "page": page,
        "type": that.data.mytype,
        "schoolid": that.data.schoolid,
        "search": that.data.keyword,
        "orderby": that.data.orderby,
      },
      success: function (res) {
        // console.log(res);
        wx.hideLoading();
        if (res.data.code == 200) {
          var a = res.data.data[0].list;
          if (contaFlag) {
            a = that.data.list.concat(a);
          }
          that.setData({
            list: a,
          });
          hasmore = res.data.data[0].hasmore;
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
    if (that.data.list.length > 0) {
      if (hasmore) {
        page++;
        that.getLis(true);
      } else {
        wx.showToast({
          title: '没有更多了',
          image: '../../../images/error.png',
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
  //排序：类型
  sorttype: function (e) {
    var that = this;
    var sorttype = Number(that.data.sorttype) + 1;
    // console.log(e.currentTarget.dataset.sortname)
    that.setData({

      sorttype: sorttype,
      sortdate: 0,
      sortname: 0,
      sortschool: 0,
    })
    if (sorttype % 2 == 1) {
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
    else if (sorttype % 2 == 0) {
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
  //排序：日期
  sortdate: function (e) {
    var that = this;
    var sortdate = Number(that.data.sortdate) + 1;
    // console.log(e.currentTarget.dataset.sortname)
    that.setData({

      sorttype: 0,
      sortdate: sortdate,
      sortname: 0,
      sortschool: 0,
    })
    if (sortdate % 2 == 1) {
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
    else if (sortdate % 2 == 0) {
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
  //排序：姓名
  sortname: function (e) {
    var that = this;
    var sortname = Number(that.data.sortname) + 1;
    // console.log(e.currentTarget.dataset.sortname)
    that.setData({
      sorttype: 0,
      sortdate: 0,
      sortname: sortname,
      sortschool: 0,
    })
    if (sortname % 2 == 1) {
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
    else if (sortname % 2 == 0) {
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
  //排序：代理
  sortschool: function (e) {
    var that = this;
    var sortschool = Number(that.data.sortschool) + 1;
    // console.log(e.currentTarget.dataset.sortname)
    that.setData({
      sorttype: 0,
      sortdate: 0,
      sortname: 0,
      sortschool: sortschool,
    })
    if (sortschool % 2 == 1) {
      that.setData({
        orderby: '5-1',
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
        orderby: '5-2',
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
  tz_memberdetails: function (e) {
    wx.navigateTo({
      url: '/pages/home/memberDetails/memberDetails?studentid=' + e.currentTarget.dataset.studentid + '&agentname=' + e.currentTarget.dataset.agentname,

    })
  },


})