// pages/home/finance/financeDetails/financeDetails.js
var network = require("../../../../utils/network.js")
var app = getApp();
var page = 1;
var hasmore = null;
Page({
  data: {
    date: app.currentdate,
    date2: app.currentdate,
    // incometype: [
    //   { name: 1, id: 1 },
    //   { name: 2, id: 2 },
    //   { name: 3, id: 3 },
    //   { name: 4, id: 4 },
    //   { name: 5, id: 5 },
    // ],
    // inputrefereeinput:'',
    // incometypeid:'',
    open: false,//显示sidebar
  },
  onLoad: function (options) {
    var that=this;
    that.setData({
      currentdate: app.currentdate
    })
    network.tokenExp(function () {
      that.getListLjsy(false)
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
  incometype: function (e) {
    // console.log(e.currentTarget.dataset.incometypeid)
    this.setData({
      incometypeid: e.currentTarget.dataset.incometypeid
    })
  },
  // 输入推荐人
  bindinput:function(e){
    this.setData({
      inputrefereeinput: e.detail.value
    })
  },
  // 点击重置
  reset:function(){
    var that=this;
    that.setData({
      date: app.currentdate,
      date2: app.currentdate,
      incometypeid:0,
      inputrefereeinput:'',
    })
  },
  sure: function () {
    var that = this;
    if (that.data.incometypeid == 0 || that.data.incometypeid == '') {
      wx.showToast({
        title: '请选择收益类型',
        image: '../../../../images/error.png',
        duration: 1000
      })
    }
    else if (that.data.inputrefereeinput.length==0) {
      wx.showToast({
        title: '请输入推荐人',
        image: '../../../../images/error.png',
        duration: 1000
      })
    }else{
      //提交
      this.setData({ open: false })
      
    }
  },
  tz_withdrawDetail:function(e){
    wx:wx.navigateTo({
      url: '/pages/home/finance/financeDetails/withdrawDetail/withdrawDetail',
    })
  },
  tz_incomeDetail: function (e) {
    wx: wx.navigateTo({
      url: '/pages/home/finance/financeDetails/incomeDetail/incomeDetail',
    })
  },
})
