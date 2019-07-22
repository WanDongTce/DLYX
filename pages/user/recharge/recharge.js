// pages/user/recharge/recharge.js
var network = require("../../../utils/network.js")
var QR = require("../../../utils/qrcode.js");
var app = getApp();
var password = '';


Page({
    data: {
        payinfo: '',
        payType: null, //0微信
        showPwd: false
    },
    onLoad: function (options) {
        // console.log(options)
        this.passwordDialog = this.selectComponent("#passwordDialog");
        
        this.payinfo();
        this.payorder();
    },
    //充值主页
    payinfo:function(){
        var that = this;
        network.POST({
            url: 'v15/renewal/index',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
            },
            success: function (res) {
                wx.hideLoading();
                if (res.data.code == 200) {
                    that.setData({
                        payinfo:res.data.data[0].item
                    })
                    
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
    //充值生成订单借口
    payorder: function () {
        var that = this;
        network.POST({
            url: 'v15/renewal/create-order',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
            },
            success: function (res) {
                wx.hideLoading();
                if (res.data.code == 200) {
                    that.setData({
                        order_sn: res.data.data[0].item.order_sn,
                        price_all: res.data.data[0].item.price_all,
                    })

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
    checkPayMethod(e) {
        var that = this;
        var a = e.currentTarget.dataset.type;
        
        that.setData({
            payType: a
        });        
    },
    pay() {
        var that = this;
        if (that.data.payType === null) {
            wx.showToast({
                // title: "请选择支付方式",
                // image: '../../../images/error.png',
                
                    title: '暂未开通',
                    image: '../../../images/error.png',
                    duration: 1000
                
            })
        } else {
            var a = parseInt(that.data.payType);
            switch (a) {
                case 0:
                    // that.setData({
                    //     showPwd: true
                    // });
                    // break;
                    that.wxPay();
                    break;
                // case 2:
                //     that.wxPay();
                //     break;
            }
        }
    },
    hidePwdDialog() {
        this.setData({
            showPwd: false
        });
    },
    getPwd(e) {
        // console.log(e);
        var that = this;
        password = e.detail;
        that.setData({
            showPwd: false
        });
        that.accountPay();
    },
    // accountPay() {
    //     var that = this;
    //     network.POST({
    //         url: 'v15/pay-dl/order',
    //         params: {
    //             "mobile": app.userInfo.mobile,
    //             "token": app.userInfo.token,
    //             "idsn": that.data.order_sn,
    //             // "password": md5.hexMD5(password)
    //         },
    //         success: function (res) {
    //             // console.log(res);
    //             wx.hideLoading();
    //             if (res.data.code == 200) {
    //                 wx.showToast({
    //                     title: '支付成功',
    //                     success: function () {
    //                         wx.switchTab({
    //                             url: '/pages/home/home',
    //                         });
    //                     }
    //                 })
    //             } else {
    //                 wx.showToast({
    //                     title: res.data.message
    //                 });
    //             }
    //         },
    //         fail: function () {
    //             wx.hideLoading();
    //             wx.showToast({
    //                 title: '服务器异常',
    //                 icon: 'none',
    //                 duration: 1000
    //             })
    //         }
    //     });
    // },
    wxPay() {
        wx.showToast({
            title: '暂未开通',
            image: '../../../images/error.png',
            duration: 1000
        })
        // console.log('111')
        // wx.login({
        //     success: function (reslogin) {
        //         console.log(reslogin.code);
        //         // code = res.code;
        //     }
        // })       
        // var that = this;
        // network.POST({
        //     url: 'v15/pay-dl/order',
        //     params: {
        //         "mobile": app.userInfo.mobile,
        //         "token": app.userInfo.token,
        //         "idsn": that.data.order_sn,
        //     },
        //     success: function (res) {
        //         console.log(res);
        //         wx.hideLoading();
        //         if (res.data.code == 200) {
        //             var a=res.data.data[0].info
                    
        //             wx.requestPayment({
        //                 'timeStamp': (a.timestamp).toString(),
        //                 'nonceStr': a.noncestr,
        //                 'package': a.package,
        //                 'signType': 'MD5',
        //                 'paySign': a.sign,
        //                 'success': function (resnew) {
        //                     console.log(resnew)
        //                 },
        //                 'fail': function (resnew) {
        //                     console.log(resnew)
        //                 },
        //                 'complete': function (resnew) { 
        //                     console.log(resnew)
        //                 }
        //             })

        //             // wx.showToast({
        //             //     title: '支付成功',
        //             //     success: function () {
        //             //         wx.switchTab({
        //             //             url: '/pages/home/home',
        //             //         });
        //             //     }
        //             // })
        //         } else {
        //             wx.showToast({
        //                 title: res.data.message
        //             });
        //         }
        //     },
        //     fail: function () {
        //         wx.hideLoading();
        //         wx.showToast({
        //             title: '服务器异常',
        //             icon: 'none',
        //             duration: 1000
        //         })
        //     }
        // });
        
    },
    onUnload() {
        password = '';
    }

})