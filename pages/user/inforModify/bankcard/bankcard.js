// pages/user/inforModify/bankcard/bankcard.js
var network = require("../../../../utils/network.js")
var app = getApp();

Page({
  data: {
    list: '',
  },
  onShow: function () {
    var that = this;
    network.tokenExp(function () {
      that.getAddrList();
    });
  },
  getAddrList: function () {
    var that = this;
    network.POST({
      url: 'v15/bank-card/index',
      params: {
        "mobile": app.userInfo.mobile,
        "token": app.userInfo.token
      },
      success: function (res) {
          console.log(res);
        wx.hideLoading();
        if (res.data.code == 200) {
          that.setData({
            list: res.data.data[0].list
          });
          
        } else {
          wx.showToast({
            title: res.data.message,
            image: '../../../../images/error.png',
            duration: 1000
          })
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
  //点击选择默认地址
  selectClick: function (e) {
    var id = e.currentTarget.dataset.id;
    var that = this;

    network.POST({
      url: 'v15/bank-card/default',
      params: {
        "mobile": app.userInfo.mobile,
        "token": app.userInfo.token,
        "id": id
      },
      success: function (res) {
          console.log(res);
        wx.hideLoading();
        if (res.data.code == 200) {
          that.getAddrList();
        } else {
          wx.showToast({
            title: res.data.message,
            image: '../../../../images/error.png',
            duration: 1000
          })
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
  //点击编辑
  catchTapEdit: function (e) {
    // console.log(e.currentTarget.dataset.item);
    wx.setStorageSync('editAddress', e.currentTarget.dataset.item);
    wx.navigateTo({
      url: '/pages/integralMall/editAddress/editAddress'
    });
  },
  //点击删除
  catchTapDel: function (e) {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '是否删除该银行卡？',
      success: function (res) {
        if (res.confirm) {
          // console.log('用户点击确定')
          network.POST({
            url: 'v15/bank-card/del',
            params: {
              "mobile": app.userInfo.mobile,
              "token": app.userInfo.token,
              "id": e.currentTarget.dataset.id
            },
            success: function (res) {
              //   console.log(res);
              wx.hideLoading();
              if (res.data.code == 200) {
                that.getAddrList();
              } else {
                wx.showToast({
                  title: res.data.message,
                  image: '../../../../images/error.png',
                  duration: 1000
                })
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
        } else if (res.cancel) {
          // console.log('用户点击取消')
        }
      }
    })
  },
  useAddr: function (e) {
    // console.log(e);
    wx.setStorageSync('receivingAddress', e.currentTarget.dataset.item);
    wx.navigateTo({
      url: '/pages/integralMall/settlement/settlement'
    });
  }
})