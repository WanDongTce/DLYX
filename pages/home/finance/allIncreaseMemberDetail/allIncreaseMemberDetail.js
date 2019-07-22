// pages/home/finance/allIncreaseMemberDetail/allIncreaseMemberDetail.js
var network = require("../../../../utils/network.js");
var app = getApp();
Page({
  data: {
    refereename: '',
    username: '',
    createtime: '',
    userschool: '',
    agenttype: '',
  },
  onLoad: function (options) {
    var that=this;
    that.setData({
      refereename: options.refereename,
      username: options.username,
      createtime: options.createtime,
      userschool: options.userschool,
      agenttype: options.agenttype,
    })
  },
  onShow: function () {

  },

})