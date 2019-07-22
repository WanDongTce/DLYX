// pages/home/finance/allIncreaseAgentDetail/allIncreaseAgentDetail.js
var network = require("../../../../utils/network.js");
var app = getApp();
Page({
  data: {
    name:'',
    agenttype: '',
    parentagent: '',
    area: '',
  },
  onLoad: function (options) {
    var that=this;
    that.setData({
      name: options.name,
      agenttype: options.agenttype,
      parentagent: options.parentagent,
      area: options.area,
    })
  },
  onShow: function () {

  },
  
})