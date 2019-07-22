// pages/user/help/help_neiqian/help_neiqian.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mysrc: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.setData({
    //   mysrc: app.userData.helpDetail + options.id
    // })
    // console.log(this.data.mysrc)
    if (options.id==1){
      this.setData({
        mysrc: 'http://218.25.54.35:9999/helps/login.html'
      })
    }
    else if (options.id == 2) {
      this.setData({
        mysrc: 'http://218.25.54.35:9999/helps/agentInfo.html'
      })
    }
    else if (options.id == 3) {
      this.setData({
        mysrc: 'http://218.25.54.35:9999/helps/direcAgent.html'
      })
    }
    else if (options.id == 4) {
      this.setData({
        mysrc: 'http://218.25.54.35:9999/helps/direcMember.html'
      })
    }
    else if (options.id == 5) {
      this.setData({
        mysrc: 'http://218.25.54.35:9999/helps/finance.html'
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})