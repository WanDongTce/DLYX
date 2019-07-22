var network = require("../../../../utils/network.js");
var app = getApp();
Page({
  data: {
    mytype: '',
    info: '',
    price: '',
    createdate: '',
  },
  onLoad: function (options) {
    var that=this;
    that.setData({
      mytype: options.type,
      info: options.info,
      price: options.price,
      createdate: options.createdate,
    })
  },
  onShow: function () {

  },

})