var network = require("../../../utils/network.js");
var app = getApp();
var page = 1;
var hasmore = null;
Page({
  data: {
    tabArr: {
      curHdIndex: 0,
      curBdIndex: 0,
      studentid:'',
      list:'',
      ssdl_agent: '',
      record:'',
      listQuestion: '',
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
    var that = this;
    if (that.data.tabArr.curHdIndex == 0) {
      wx.pageScrollTo({
        scrollTop: 0,
        duration: 0
      });
      page = 1;
      hasmore = '';
      
      network.tokenExp(function () {
        that.getList(false);
      });
    }
    else if (that.data.tabArr.curHdIndex == 1) {
      wx.pageScrollTo({
        scrollTop: 0,
        duration: 0
      });
      page = 1;
      hasmore = '';
      
      network.tokenExp(function () {
        that.getListQuestion(false);
      });
    }
    else if (that.data.tabArr.curHdIndex == 2) {
      wx.pageScrollTo({
        scrollTop: 0,
        duration: 0
      });
      page = 1;
      hasmore = '';
      
      network.tokenExp(function () {
        that.getRecord(false);
      });
    }
  },
  onLoad: function (options) {
    var that=this;
    that.setData({
      studentid: options.studentid,
      agentname: options.agentname,//所属代理
    })
    that.getList()
  },
  getList: function (contaFlag) {
    var that = this;
    network.POST({
      url: 'v15/agent-info/member-info',
      params: {
        "mobile": app.userInfo.mobile,
        "token": app.userInfo.token,
        "uid": that.data.studentid,       
      },
      success: function (res) {
        // console.log(res);
        wx.hideLoading();
        if (res.data.code == 200) {
          var a = res.data.data[0].item;          
          that.setData({
            list: a,
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
  getListQuestion: function (contaFlag) {
    var that = this;
    network.POST({
      url: 'v15/problem-square/list',
      params: {
        "mobile": app.userInfo.mobile,
        "token": app.userInfo.token,
        "page": page,
        "search_uid": that.data.studentid,
      },
      success: function (res) {
        // console.log(res);
        wx.hideLoading();
        if (res.data.code == 200) {
          var a = res.data.data[0].list;
          if (contaFlag) {
            a = that.data.listQuestion.concat(a);
          }
          that.setData({
            listQuestion: a,
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
  getRecord: function (contaFlag) {
    var that = this;
    network.POST({
      url: 'v15/agent-info/user-trading-list',
      params: {
        "mobile": app.userInfo.mobile,
        "token": app.userInfo.token,
        "page": page,
        "uid": that.data.studentid,  
      },
      success: function (res) {
        // console.log(res);
        wx.hideLoading();
        if (res.data.code == 200) {
          var a = res.data.data[0].list;
          if (contaFlag) {
            a = that.data.record.concat(a);
          }
          that.setData({
            record: a,
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
  onShow: function () {

  },
  onReachBottom: function () {
    var that = this;
    if (that.data.tabArr.curHdIndex == 1) {
      if (that.data.listQuestion.length > 0) {
        if (hasmore) {
          page++;
          that.getListQuestion(true);
        } else {
          wx.showToast({
            title: '没有更多了',
            image: '../../../images/error.png',
            duration: 1000
          })
        }
      }
    }
    if (that.data.tabArr.curHdIndex==2){
      if (that.data.record.length > 0) {
        if (hasmore) {
          page++;
          that.getRecord(true);
        } else {
          wx.showToast({
            title: '没有更多了',
            image: '../../../images/error.png',
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
  faka:function(){
    var that = this;

    network.POST({
      url: 'v15/card-bag/send-card',
      params: {
        "mobile": app.userInfo.mobile,
        "token": app.userInfo.token,
        "uid": that.data.studentid ,       
      },
      success: function (res) {
        // console.log(res);
        
        wx.hideLoading();
        if (res.data.code == 200) {
          wx.showToast({
            title: '操作成功',            
            duration: 1000
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
})