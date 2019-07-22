var network = require("../../../../utils/network.js");
var app = getApp();
var page = 1;
var hasmore = null;
Page({
  data: {
    tabArr: {
      curHdIndex: 0,
      curBdIndex: 0
    },
    date: app.currentdate2,//选择的时间,
    currentdate2: app.currentdate2 
  },
  bindDateChange: function (e) {
    // console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
    this.getAll()
    
  },
  getAll:function(){
    var that=this;
    if (that.data.tabArr.curHdIndex == 0) {
      // console.log('000')
      wx.pageScrollTo({
        scrollTop: 0,
        duration: 0
      });
      page = 1;
      hasmore = '';
      
      network.tokenExp(function () {
        that.getListLjsy(false);
      });
    }
    else if (that.data.tabArr.curHdIndex == 1) {
      // console.log('111')
      wx.pageScrollTo({
        scrollTop: 0,
        duration: 0
      });
      page = 1;
      hasmore = '';
      
      network.tokenExp(function () {
        that.getListXzhy(false);
      });
    }
    else if (that.data.tabArr.curHdIndex == 2) {
      // console.log('222')
      wx.pageScrollTo({
        scrollTop: 0,
        duration: 0
      });
      page = 1;
      hasmore = '';
      
      network.tokenExp(function () {
        that.getListXzdl(false);
      });
    }
  },
  tabFun: function (e) {
    //获取触发事件组件的dataset属性 
    var _datasetId = e.target.dataset.id;
    var _obj = {};
    _obj.curHdIndex = _datasetId;
    _obj.curBdIndex = _datasetId;
    this.setData({
      tabArr: _obj
    });
    var that=this;
    that.getAll();
  },
  
  onLoad: function (options) {
    // console.log(options)
    // this.empty = this.selectComponent("#empty");
    var that=this;
    that.setData({
      tabArr: {
        curHdIndex: options.tabarr,
        curBdIndex: options.tabarr
      },
    })
    that.getAll()
  },
  // 积累收益
  getListLjsy: function (contaFlag){
    var that = this;
    network.POST({
      url: 'v15/agent-info/earnings',
      params: {
        "mobile": app.userInfo.mobile,
        "token": app.userInfo.token,
        "type": 1,
        "page": page,
        "month": that.data.date,                      
      },
      success: function (res) {
        // console.log(res);       
        wx.hideLoading();
        if (res.data.code == 200) {
          var a = res.data.data[0].list;
          if (contaFlag) {
            a = that.data.listLjsy.concat(a);
          }
          that.setData({
            listLjsy: a,           
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
  //新增会员
  getListXzhy: function (contaFlag) {
    var that = this;
    network.POST({
      url: 'v15/agent-info/new-member',
      params: {
        "mobile": app.userInfo.mobile,
        "token": app.userInfo.token,
        "page": page,
        "month": that.data.date,
      },
      success: function (res) {
        // console.log(res);
        wx.hideLoading();
        if (res.data.code == 200) {
          var a = res.data.data[0].list;
          if (contaFlag) {
            a = that.data.listXzhy.concat(a);
          }
          that.setData({
            listXzhy: a,
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
  //新增代理
  getListXzdl: function (contaFlag) {
    var that = this;
    network.POST({
      url: 'v15/agent-info/new-agent',
      params: {
        "mobile": app.userInfo.mobile,
        "token": app.userInfo.token,
        "page": page,
        "month": that.data.date,
      },
      success: function (res) {
        // console.log(res);
        wx.hideLoading();
        if (res.data.code == 200) {
          var a = res.data.data[0].list;
          if (contaFlag) {
            a = that.data.listXzdl.concat(a);
          }
          that.setData({
            listXzdl: a,
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
  onShow: function () {

  },
  onReachBottom: function () {
    var that = this;
    
    if (that.data.tabArr.curHdIndex == 0){
      if (that.data.listLjsy.length > 0) {
        if (hasmore) {
          page++;
          that.getListLjsy(true);
        } else {
          wx.showToast({
            title: '没有更多了',
            image: '../../../../images/error.png',
            duration: 1000
          })
        }
      }
    }
    else if (that.data.tabArr.curHdIndex == 1) {
      if (that.data.listXzhy.length > 0) {
        if (hasmore) {
          page++;
          that.getListXzhy(true);
        } else {
          wx.showToast({
            title: '没有更多了',
            image: '../../../../images/error.png',
            duration: 1000
          })
        }
      }
    }
    else  {
      if (that.data.listXzdl.length > 0) {
        if (hasmore) {
          page++;
          that.getListXzdl(true);
        } else {
          wx.showToast({
            title: '没有更多了',
            image: '../../../../images/error.png',
            duration: 1000
          })
        }
      }
    }
  },
  onUnload: function () {
    page = 1;  
    hasmore = null;    
  },
  // 点击查看全部
  see_all: function () {
    var that=this;
    // console.log(that.data.tabArr.curHdIndex)
    if (that.data.tabArr.curHdIndex==0){
      wx.navigateTo({
        url: '/pages/home/finance/allIncome/allIncome?tztype=' + 1,
      })
    } 
    else if (that.data.tabArr.curHdIndex == 1) {
      wx.navigateTo({
        url: '/pages/home/finance/allIncreaseMember/allIncreaseMember',
      })
    }
    else{
      wx.navigateTo({
        url: '/pages/home/finance/allIncreaseAgent/allIncreaseAgent',
      })
    }
  },
  // 跳转详情
  tz_ljsy:function(e){
    wx: wx.navigateTo({
      url: '/pages/home/finance/allIncomeDetail/allIncomeDetail?type=' + e.currentTarget.dataset.type + '&info=' + e.currentTarget.dataset.info + '&price=' + e.currentTarget.dataset.price + '&createdate=' + e.currentTarget.dataset.createdate
    })
  },
   // 跳转详情
  tz_xzhy:function(e) {
    wx: wx.navigateTo({
      url: '/pages/home/finance/allIncreaseMemberDetail/allIncreaseMemberDetail?refereename=' + e.currentTarget.dataset.refereename + '&username=' + e.currentTarget.dataset.username + '&createtime=' + e.currentTarget.dataset.createtime + '&userschool=' + e.currentTarget.dataset.userschool + '&agenttype=' + e.currentTarget.dataset.agenttype
    })
  },
   // 跳转详情
  tz_xzdl:function(e) {
    wx.navigateTo({
      url: '/pages/home/finance/allIncreaseAgentDetail/allIncreaseAgentDetail?name=' + e.currentTarget.dataset.name + '&agenttype=' + e.currentTarget.dataset.agenttype + '&parentagent=' + e.currentTarget.dataset.parentagent + '&area=' + e.currentTarget.dataset.area
    })
    
  }
})