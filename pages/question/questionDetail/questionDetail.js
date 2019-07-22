// pages/question/questionDetail/questionDetail.js
var network = require("../../../utils/network.js")
const wxParse = require('../../../wxParse/wxParse.js');
var app = getApp();
var questionid = '';
var page = 1;
var hasmore = '';
Page({
  data: {
    detail: '',
    ansList: [],
    ansContentList: [],
    showEmpty: false,
    userid: app.userInfo.id,
    fullImgList: [],
    isShowFullImg: false
  },
  onLoad: function (options) {
    var that=this;
    questionid = options.questionid;
    network.tokenExp(function () {
      that.getQuesDetail();
    });
    
    that.empty = that.selectComponent("#empty");
    that.addAgre = that.selectComponent("#addAgre");
    that.fullImg = that.selectComponent("#fullImg"); 
  },
  onShow: function () {
    var that = this;
    
    network.tokenExp(function () {
      that.getAnsList(false);
    });
  },
  getQuesDetail: function () {
    var that = this;    
      network.POST({
        url: 'v15/problem-square/detail',
        params: {
          "mobile": app.userInfo.mobile,
          "token": app.userInfo.token,
          "id": questionid
        },
        success: function (res) {
          // console.log(res.data.data[0].item);
          wx.hideLoading();
          if (res.data.code == 200) {
            that.setData({
              detail: res.data.data[0].item
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
  getAnsList: function (flag) {
    var that = this;    
      network.POST({
        url: 'v15/problem-square/answer-list',
        params: {
          "mobile": app.userInfo.mobile,
          "token": app.userInfo.token,
          "questionid": questionid,
          "page": page
        },
        success: function (res) {
          // console.log(res.data.data[0].list);
          wx.hideLoading();
          if (res.data.code == 200) {
            var a = res.data.data[0].list;
            if (flag) {
              a = that.data.ansList.concat(a);
            }

            for (let i = 0; i < a.length; i++) {
              wxParse.wxParse('content' + i, 'html', a[i].content, that);
              if (i === a.length - 1) {
                wxParse.wxParseTemArray("ansContentList", 'content', a.length, that);
              }
            };

            that.setData({
              ansList: a,              
              showEmpty: a.length == 0 ? true : false
            });
            hasmore = res.data.data[0].hasmore;
            // console.log(a);
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
  //点赞
  addAgree: function (e) {
    var that = this;
    // console.log(e.currentTarget.dataset.dianzancomment)
    if (e.currentTarget.dataset.isagree == 1) {
      wx.showToast({
        title: '您已点赞',
        image: '../../../images/error.png',
        duration: 1000
      });
    }
    else {
      
      // network.addAgree(10, e.currentTarget.dataset.commentid);
      network.POST({
        url: 'v14/news/agree-add',
        params: {
          "mobile": app.userInfo.mobile,
          "token": app.userInfo.token,
          "resourcetypeid": 9,
          "resourceid": e.currentTarget.dataset.myid
        },
        success: function (res) {
          wx.hideLoading();
          if (res.data.code == 200) {
            for (var i = 0; i < that.data.ansList.length; i++) {
              if (that.data.ansList[i].id == e.currentTarget.dataset.myid) {
                var ansList2 = that.data.ansList
                ansList2[i].agreenum = Number(parseInt(that.data.ansList[i].agreenum) + 1)
                ansList2[i].isagree = 1;
                that.setData({
                  ansList: ansList2
                })
              }
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
      });
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
  onReachBottom: function () {
    if (this.data.ansList.length > 0) {
      if (hasmore) {
        page++;
        this.getAnsList(true);
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
    hasmore = '';
    this.setData({
      showEmpty: false
    });
  },
  bangta:function(e){
    var that=this;
    wx.navigateTo({
      url: '/pages/question/answer/answer?myid=' + that.data.detail.id + '&title=' + that.data.detail.name
    })
  },
  findpeople: function (e) {
    var that = this;
    wx.navigateTo({
      url: '/pages/question/questionChoice/questionChoice?questionid=' + e.currentTarget.dataset.questionid
    })
  },
})