// pages/user/choice_step2/choice_step2.js
var network = require("../../../utils/network.js")
var app = getApp();

var optionid = '';


Page({

  /**
   * 页面的初始数据
   */
  data: {
      list:[],
  },
    selectClick: function (event) {
        // console.log(event)
        optionid = event.currentTarget.dataset.optionid;
        // console.log(optionid) .currentTarget.dataset.optionid
        for (var i = 0; i < this.data.list.length; i++) {
            if (event.currentTarget.id == i) {
                this.data.list[i].checked = 1
            }
            else {
                this.data.list[i].checked = 0
            }
        }
        this.setData(this.data)
        this.setData({
            list: this.data.list,
        })
    },
    getList:function(){
        var that=this;
        network.POST({
            url: 'v15/login/lev-list',
            params: {
                
            },
            success: function (res) {
                // console.log(res);
                wx.hideLoading();
                if (res.data.code == 200) {
                    var a = res.data.data[0].list;  
                    // console.log(a)
                    for (var i = 0; i < a.length; i++) {
                        a[i].checked = 0;
                    }                 
                    that.setData({
                        list: a,
                    });
                    // console.log(that.data.list)
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
        })
    },
    clicknext: function () {
        var that = this;
        // console.log(optionid)
        if (optionid == '') {
            wx.showToast({
                title: "请选择代理类型",
                icon: 'none',
                duration: 1000
            });
        }
        else {
            // console.log(optionid)
            network.POST({
                url: 'v15/user-info/update-agent',
                params: {
                    "mobile": app.userInfo.mobile,
                    "token": app.userInfo.token,
                    "agentlev": optionid,
                    
                },
                success: function (res) {
                    // console.log(res);
                    wx.hideLoading();
                    if (res.data.code == 200) {
                        
                        app.userInfo.agentlev = optionid;
                        app.userInfo = app.userInfo
                        // console.log(app.userInfo)

                        
                        wx.setStorage({
                            key: 'userInfo',
                            data: app.userInfo
                        });
                        

                        wx.navigateTo({
                            url: '/pages/user/choice_step1/choice_step1'
                        })
                        
                    } else {
                        wx.showToast({
                            title: res.data.message,
                            icon: 'none',
                            duration: 1000
                        });
                    }
                },
                fail: function () {
                    wx.hideLoading();
                    wx.showToast({
                        title: '服务器异常',
                        icon: 'none',
                        duration: 1000
                    })
                }
            });
        }

    },
  onLoad: function (options) {
     
      this.getList();
  },

})