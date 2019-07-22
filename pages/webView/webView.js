const network = require("../../utils/network.js");
const app = getApp();

Page({
    data: {
      src: ''
    },
    onLoad: function (options) {
        console.log(options);
        var that = this;
        that.setData({
          newssrc: options.newssrc,
          newsid: options.newsid
        });
        var src = that.data.newssrc + '?id=' + that.data.newsid
        that.setData({
          src: src
        })
        // console.log(that.data.src)
    },      
})