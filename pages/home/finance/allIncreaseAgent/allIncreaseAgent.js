var network = require("../../../../utils/network.js")
var app = getApp();
var page = 1;
var hasmore = null;
Page({
  data: {
    date: '',
    date2: '',
    // incometype: [
    //   { name: '校园代理', id: 1 },
    //   { name: '校园加盟商', id: 2 },
      
    // ],
    inputrefereeinput: '',
    // incometypeid: '',
    open: false,//显示sidebar
  },
  onLoad: function (options) {
    var that = this;
    that.setData({
      currentdate: app.currentdate
    })
    network.tokenExp(function () {
      that.getListXzdl(false)
    });
    

  },
  tap_ch: function (e)//显示 隐藏板块选择侧边栏
  {
    if (this.data.open) {
      this.setData({ open: false });
    }
    else {
      this.setData({ open: true });
    }
  },
  onShow: function () {

  },
  // 筛选时间
  bindDateChange: function (e) {
    // console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
  },
  bindDateChange2: function (e) {
    // console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date2: e.detail.value
    })
  },
  // 选择收益类型
  // incometype: function (e) {
  //   // console.log(e.currentTarget.dataset.incometypeid)
  //   this.setData({
  //     incometypeid: e.currentTarget.dataset.incometypeid
  //   })
  // },
  // 输入推荐人
  bindinput: function (e) {
    this.setData({
      inputrefereeinput: e.detail.value
    })
  },
  // 点击重置
  reset: function () {
    var that = this;
    that.setData({
      date: '',
      date2: '',
      inputrefereeinput: '',
    })
  },
  sure: function () {
    var that = this;
    var date_new = Date.parse(new Date(that.data.date)) / 1000;
    var date2_new = Date.parse(new Date(that.data.date2)) / 1000;   
    if ((Boolean(that.data.date)) !== (Boolean(that.data.date2))) {
      wx.showToast({
        title: '搜索时间不合法',
        image: '../../../../images/error.png',
        duration: 1000
      })
      return false
    }
    else if (date_new > date2_new) {
      wx.showToast({
        title: '搜索时间不合法',
        image: '../../../../images/error.png',
        duration: 1000
      })
    }
    else {
      //提交
      this.setData({ open: false })
      page = 1;
      this.getListXzdl(false)
    }
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
        "referee": that.data.inputrefereeinput,
        "time_begin": that.data.date,
        "time_end": that.data.date2,
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
  tz_detail: function (e) {
    wx: wx.navigateTo({
      url: '/pages/home/finance/allIncreaseAgentDetail/allIncreaseAgentDetail?name=' + e.currentTarget.dataset.name + '&agenttype=' + e.currentTarget.dataset.agenttype + '&parentagent=' + e.currentTarget.dataset.parentagent + '&area=' + e.currentTarget.dataset.area
    })
  },
  onReachBottom: function () {
    var that = this;
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
  },
  onUnload: function () {
    page = 1;
    hasmore = null;
  },
})
