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
      xfmc_show: e.detail.value,
      xfmc: e.detail.value
    })

    //银行卡号格式
    if (e.detail.value == "") { return };
    var account = new String(e.detail.value);
    account = account.substring(0, 22); /*帐号的总数, 包括空格在内 */
    if (account.match(".[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{7}") == null) {
      /* 对照格式 */
      if (account.match(".[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{7}|" + ".[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{7}|" +
        ".[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{7}|" + ".[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{7}") == null) {
        var accountChar;
        var accountNumeric = accountChar = "", i;
        for (i = 0; i < account.length; i++) {
          accountChar = account.substr(i, 1);
          if (!isNaN(accountChar) && (accountChar != " ")) accountNumeric = accountNumeric + accountChar;
        }
        account = "";
        this.setData({
          xfmc_show: account
        })
        for (i = 0; i < accountNumeric.length; i++) {    /* 可将以下空格改为-,效果也不错 */
          if (i == 4) account = account + " "; /* 帐号第四位数后加空格 */
          if (i == 8) account = account + " "; /* 帐号第八位数后加空格 */
          if (i == 12) account = account + " ";/* 帐号第十二位后数后加空格 */
          account = account + accountNumeric.substr(i, 1)
          this.setData({
            xfmc_show: account
          })
        }
      }
    }
    else {
      account = " " + account.substring(1, 5) + " " + account.substring(6, 10) + " " + account.substring(14, 18) + "-" + account.substring(18, 25);
      this.setData({
        xfmc_show: account
      })
    }
    if (account != e.detail.value) {
      e.detail.value = account;
      this.setData({
        xfmc_show: account
      })
    }
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