// pages/user/inforModify/addbankcard/addbankcard.js
var network = require("../../../../utils/network.js")
var app = getApp();
Page({
  data: {
    xfmc_show: '',
    xfmc_name:'',
  },
  
  onLoad: function (options) {
    var that = this
    
  },
  inputEvent: function (e) {
    this.setData({
      xfmc_show: e.detail.value
    })
    if (e.detail.value=='') return;
    var xfmc_show = this.data.xfmc_show;
    var xfmc = xfmc_show.replace(/\s*/g, "");
    if (xfmc.length% 4 == 0) {
      xfmc_show += " ";
    }
    xfmc_show = xfmc_show.substring(0, 23);
    this.setData({
      xfmc_show: xfmc_show
    })
  },
  inputName:function(e){
    this.setData({
      xfmc_name: e.detail.value.replace(/^\s*|\s*$/, '')
    })
  },
  //点击添加提交表单
  bindFormSubmit: function (e) {
    
    var xfmc_show = e.detail.value.xfmc_show;
    xfmc_show = xfmc_show.replace(/\s+/g, "");//去掉空格

    var that = this;
    var myReg = /^([1-9]{1})(\d{15,18})$/
    var myRegName = /^[\u4E00-\u9FA5A-Za-z]+$/
    
    if (xfmc_show.length == 0) {     
      wx.showToast({
        title: '请输入银行卡号',
        image: '../../../../images/error.png',
        duration: 1000
      })
      return false
    }
    else if (!myReg.test(xfmc_show)) {
      wx.showToast({
        title: '银行卡号不合法',
        image: '../../../../images/error.png',
        duration: 1000
      })
      return false
    }
    else if(that.data.xfmc_name.length==0){
      wx.showToast({
        title: '姓名不能为空',
        image: '../../../../images/error.png',
        duration: 1000
      })
      return false
    }
    else if (!myRegName.test(that.data.xfmc_name)) {
      wx.showToast({
        title: '姓名不合法',
        image: '../../../../images/error.png',
        duration: 1000
      })
      return false
    }
    else {
      //提交
      network.POST({
        url: 'v15/bank-card/add',
        params: {
          'mobile': app.userInfo.mobile,
          'token': app.userInfo.token,
          'bank_number': xfmc_show,
          'bank_username': that.data.xfmc_name,
        },
        success: function (res) {
          wx.hideLoading();
          console.log(res)          
          if (res.data.code == 200) {
            wx.showToast({
              title: '添加成功',
              icon: 'success',
              duration: 1000
            })
            wx.navigateBack({
            })
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
      })     

    }

  },
})