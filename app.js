//app.js
//当前时间 年月日
var date = new Date();
var seperator1 = "-";
var seperator2 = ":";
var month = date.getMonth() + 1;
var strDate = date.getDate();
if (month >= 1 && month <= 9) {
  month = "0" + month;
}
if (strDate >= 0 && strDate <= 9) {
  strDate = "0" + strDate;
}
var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate;
var currentdate2 = date.getFullYear() + seperator1 + month;


App({
  requestUrl: 'http://social.test.54xuebaxue.com/',
    // requestUrl: 'https://social.ajihua888.com/',
//   requestUrl: 'https://social.pp11.cn/',

  // requestUrl: 'http://social.doudou-le.com/',
  app_source_type: 3,
  currentdate: currentdate,
  currentdate2: currentdate2,
  userInfo: null,
  systemInfo: null,
  onLaunch: function () {

  },
  toLogin: function () {
    wx.navigateTo({
      url: '/pages/user/login/login'
    });
  },
  onLaunch: function () {
    // console.log('launch');
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        // console.log(res);
        that.systemInfo = res;
      }
    });
  },
  onShow: function () {
    // var _this = this;
    // wx.getStorage({
    //   key: 'userinfo',  //登录的(小写)
    //   success: function (res) {
    //     if (res.data != null) {
    //       _this.userData.userinfo = res.data;
    //     }
    //   },
    // })
    var that = this;
    that.userInfo = wx.getStorageSync('userInfo');
    // console.log(that.userInfo);
  },
  userData: {
   
    uploadURL: 'https://stu.pp11.cn/agents/user/updateheaderimg',//修改头像地址
    

    //helpDetail:
  },  
})