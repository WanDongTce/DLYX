const network = require("../../../utils/network.js");
const wxParse = require('../../../wxParse/wxParse.js');
const app = getApp();
var id = '';


Page({
    data: {
        detail: '',
        msg: '',
        id: '',
        isLike: false,
        mycommentnum: '',
        mynum: '',
        myagree: '',
        content: ''
    },
    onLoad: function (options) {
        var that = this;
        id = options.id;
        this.setData({
            id: options.id
        });
        network.tokenExp(function () {
            that.getDetail();
        });
    },
    getDetail: function () {
        var that = this;
        network.POST({
            url: 'v14/news/detail',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
                "id": id
            },
            success: function (res) {
                // console.log(res);
                wx.hideLoading();
                if (res.data.code == 200) {
                    var a = res.data.data[0].item;
                    that.setData({
                        detail: a,
                        myagree: a.isagree,
                        mynum: a.agreenum,
                        mycommentnum: a.commentnum,
                    });
                    // console.log(that.data.myagree);
                    wxParse.wxParse('content', 'html', a.content, that, 0);
                } else {
                    wx.showToast({
                      title: res.data.message,
                      image: '../../../images/error.png',
                      duration: 1000
                    })
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
    inputFn: function (e) {
        this.setData({
            msg: e.detail.value
        });
    },
    submitCommt: function () {
        var that = this;
        var a = that.data.msg;
        if (a) {

            network.POST({
                url: 'v14/news/comments-add',
                params: {
                    "mobile": app.userInfo.mobile,
                    "token": app.userInfo.token,
                    "resourcetypeid": 1,
                    "resourceid": id,
                    "content": a
                },
                success: function (res) {
                    // console.log(res);
                    wx.hideLoading();
                    
                    wx.showToast({
                      title: res.data.message,
                      image: '../../../images/error.png',
                      duration: 1000
                    });
                    if (res.data.code == 200) {
                        that.setData({
                            msg: '',
                            mycommentnum: Number(that.data.mycommentnum) + 1
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

        } else {
            
            wx.showToast({
              title: '请输入内容',
              image: '../../../images/error.png',
              duration: 1000
            });
        }
    },
    toCommt: function (e) {
        wx.navigateTo({
            url: '/pages/news/commentsList/commentsList?typeid=1&id=' + e.currentTarget.dataset.id
        })
    },
    isLike: function () {
        var that = this;
        var a = that.data.myagree;
        if(a == 1){
            wx.showToast({
                image: '../../../images/error.png',
                title: '您已点赞'
            })
        }else{
            
            network.addAgree(1, that.data.id,function(){
              wx.hideLoading()
              that.setData({
                mynum: Number(that.data.mynum) + 1,
                myagree: 1
              });

            });
        }
    },
    onShareAppMessage() {
        var that = this;
        return {
            title: that.data.detail.name,
            path: '/pages/news/newsDetail/newsDetail?id=' + id,
            success: function (res) {
                network.share(1, id,function(){
                  wx.hideLoading()
                });
            }
        };
    }
})