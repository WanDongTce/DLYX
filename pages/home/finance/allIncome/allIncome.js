var network = require("../../../../utils/network.js")
var app = getApp();
var page = 1;
var hasmore = null;
Page({
  data: {
    tztype: '',
    date: '',
    date2: '',
    // incometype: [
    //   { name: 1, id: 1 },
    //   { name: 2, id: 2 },
    //   { name: 3, id: 3 },
    //   { name: 4, id: 4 },
    //   { name: 5, id: 5 },
    // ],
    // incometypeid: '',
    // inputrefereeinput: '',
    
    open: false,//显示sidebar
  },
  onLoad: function (options) {
    // console.log(options.tztype)
    var that = this;
    that.setData({
      currentdate: app.currentdate,
      tztype:options.tztype
    })
    if (options.tztype==1){
      network.tokenExp(function () {
        that.getListLjsy(false);
      });
      
      wx.setNavigationBarTitle({ title: '全部收益' })
    }
    else if(options.tztype == 2){
      
      network.tokenExp(function () {
        that.getListLjsy(false);
      });
      wx.setNavigationBarTitle({ title: '余额明细' })
    }
    

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
  //   this.setData({
  //     incometypeid: e.currentTarget.dataset.incometypeid
  //   })
  // },
  // 输入推荐人
  // bindinput: function (e) {
  //   this.setData({
  //     inputrefereeinput: e.detail.value
  //   })
  // },
  // 点击重置
  reset: function () {
    var that = this;
    that.setData({
      date: '',
      date2: '',
      // incometypeid: 0,
      // inputrefereeinput: '',
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
      this.getListLjsy(false)
    }
  },
  //累积收益
  getListLjsy: function (contaFlag) {
    var that = this;
    network.POST({
      url: 'v15/agent-info/earnings',
      params: {
        "mobile": app.userInfo.mobile,
        "token": app.userInfo.token,
        "type": that.data.tztype,
        "page": page,       
        "time_begin": that.data.date,
        "time_end": that.data.date2,
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
  tz_detail: function (e) {
    wx: wx.navigateTo({
      url: '/pages/home/finance/allIncomeDetail/allIncomeDetail?type=' + e.currentTarget.dataset.type + '&info=' + e.currentTarget.dataset.info + '&price=' + e.currentTarget.dataset.price + '&createdate=' + e.currentTarget.dataset.createdate
    })
  },
  
  onReachBottom: function () {
    var that = this;
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
  },
  onUnload: function () {
    page = 1;
    hasmore = null;
  },
})
