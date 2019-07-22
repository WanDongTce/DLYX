const network = require("../../../utils/network.js");
const app = getApp();
var id = '';
var flag = false;


Page({
  data: {
    vidSrc: '',
    imgList: [],
    content: '',
    title: ''
  },
  onLoad: function (options) {
    // console.log(options);
    id = options.myid;
    this.setData({
      title: options.title
    });
  },
  onShow: function () {
    
  },
  saveContent: function (e) {
    var a = e.detail.value.replace(/^\s*|\s*$/, '');
    this.setData({
      content: a
    });
  },
  add_video: function () {
    var that = this
    wx.chooseVideo({
      success: function (res) {
        that.setData({
          vidSrc: res.tempFilePath
        })
      }
    });
  },
  addImg: function () {
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        var a = res.tempFilePaths;
        network.publicUpload(a, function (res) {
          wx.hideLoading();
          var b = that.data.imgList.concat(res.data[0].list);
          that.setData({
            imgList: b
          });
          flag = true;
        });
      }
    });
  },

  delImg: function (e) {
    var that = this;
    var idx = e.currentTarget.dataset.idx;
    var list = that.data.imgList;
    var a = list.slice(0, idx).concat(list.slice(idx + 1));
    that.setData({
      imgList: a
    });
  },
  submit: function () {
    var that = this;
    var list = that.data.imgList;
    // console.log(list);
    var content = that.data.content;
    if (!content) {
      wx.showToast({
        title: '请输入内容',
        image: '../../../images/error.png',
        duration: 1000
      });
    }
    else if (list.length > 0 && !flag) {
      wx.showToast({
        title: '图片上传中,请稍后...',
        image: '../../../images/error.png',
        duration: 1000
      });
    }
    else {
      if (list.length == 0) {
        content = '<p>' + content + '</p>';
      } else {
        content = '<p>' + content + '</p><p>' + '<img src="' + list[0].file_url + '"/>' + '</p>';
      }
      that.submitFn(content);
    }
  },
  submitFn: function (content) {
    network.POST({
      url: 'v15/problem-square/answer-add',
      params: {
        'mobile': app.userInfo.mobile,
        'token': app.userInfo.token,
        'questionid': id,
        'content': content
      },
      success: function (res) {
        // console.log(res);
        wx.hideLoading();
        if (res.data.code == 200) {
          wx.showToast({
            title: '提交成功',
            duration: 1000
          });
          wx.navigateBack({
            delta: 1
          });
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
  }
})