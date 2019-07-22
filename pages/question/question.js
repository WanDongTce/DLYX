var network = require("../../utils/network.js")
var app = getApp();
var page = 1;
var hasmore = null;

Page({

  data: {
    keyword: '',
    list: '',
    count: '',
    fullImgList: [],
    isShowFullImg: false
  },
  onLoad: function (options) {
    this.fullImg = this.selectComponent("#fullImg");
    var that = this;    
    
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
  //搜索框点击完成时触发
  bindconfirm: function (e) {
    this.getList(false);
  },
  getList: function (contaFlag) {
    var that = this;
    network.POST({
      url: 'v15/problem-square/list',
      params: {
        "mobile": app.userInfo.mobile,
        "token": app.userInfo.token,
        "page": page,        
        "search_name": that.data.keyword,
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
            count: res.data.data[0].count            
          });
          hasmore = res.data.data[0].hasmore;
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
  onReachBottom: function () {
    var that = this;
    if (that.data.list.length > 0) {
      if (hasmore) {
        page++;
        that.getList(true);
      } else {
        wx.showToast({
          title: '没有更多了',
          image: '../../images/error.png',
          duration: 1000
        })
      }
    }
  },
  showFullImg(e) {
    // console.log(e);
    this.setData({
      fullImgList: e.currentTarget.dataset.imgs,
      isShowFullImg: true
    });
  },
  hideFullImg() {
    this.setData({
      fullImgList: [],
      isShowFullImg: false
    });
  },
  onUnload: function () {
    page = 1;    
    hasmore = null;
    this.setData({      
      keyword: ''
    });
  },
  tz_detail:function(e){
    wx.navigateTo({
      url: '/pages/question/questionDetail/questionDetail?questionid=' + e.currentTarget.dataset.questionid,
    })
  },
  bangta: function (e) {
    var that = this;
    wx.navigateTo({
      url: '/pages/question/answer/answer?myid=' + e.currentTarget.dataset.myid + '&title=' + e.currentTarget.dataset.title
    })
  },
  findpeople: function (e) {
    var that = this;
    wx.navigateTo({
      url: '/pages/question/questionChoice/questionChoice?questionid=' + e.currentTarget.dataset.questionid + '&nameid=' + this.data.studentid
    })
  },
})