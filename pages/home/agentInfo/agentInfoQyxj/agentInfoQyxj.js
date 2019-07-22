var network = require("../../../../utils/network.js");
var app = getApp();
Page({
  data: {
    info: {},
    power: '',
    currentCity: '',
    currentArea: '',
    currentSchool: '',
    cityList: [],
    areaList: [],
    schoolList: [],
    memberDetail: {},

    dlxm: '',
    dljb: '',
    dlqy: '',
    ssdl: '',
    zcsj: '',
  },
  onLoad: function () {
    // var that=this;
    // that.getcityList()
    var that = this;
    that.setData({
      power: app.userInfo.agentlev,
      info: app.userInfo
    });
    var daliType = app.userInfo.agentlev;   
    if (daliType < 4) {
      switch (Number(daliType)) {
        case 1: 
          network.tokenExp(function () {
            that.getcityList();
          });         
          
          break;
        case 2:
          network.tokenExp(function () {
            that.getareaList('');
          });
          break;
        case 3:
          network.tokenExp(function () {
            that.getschoolList('');
          });
          break;
      };
          
    } else {
      wx.showToast({
        title: '敬请期待',
        image: '../../../../images/expect.png',
        duration: 1000
      });
    }
  },
  
  aniDown1: function (info) {
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    });
    this.animation = animation;
    animation.translateY(-100).step();
    this.setData({
      animationDown1: animation.export(),
      currentCity: info.addressid
    });
    setTimeout(function () {
      animation.translateY(0).step();
      this.setData({
        animationDown1: animation.export()
      })
    }.bind(this), 200);
  },
  hideAniDown1: function () {
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "ease-out",
      delay: 0
    });
    this.animation = animation;
    animation.translateY(0).step();
    this.setData({
      animationDown1: animation.export()
    });
    setTimeout(function () {
      animation.translateY(-100).step();
      this.setData({
        animationDown1: animation.export(),
        currentCity: ''
      });
    }.bind(this), 200);
  },
  aniDown2: function (info) {
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    });
    this.animation = animation;
    animation.translateY(-100).step();
    this.setData({
      animationDown2: animation.export(),
      currentArea: info.addressid
    });
    setTimeout(function () {
      animation.translateY(0).step();
      this.setData({
        animationDown2: animation.export()
      })
    }.bind(this), 200);
  },
  hideAniDown2: function () {
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "ease-out",
      delay: 0
    });
    this.animation = animation;
    animation.translateY(0).step();
    this.setData({
      animationDown2: animation.export()
    });
    setTimeout(function () {
      animation.translateY(-100).step();
      this.setData({
        animationDown2: animation.export(),
        currentArea: ''
      });
    }.bind(this), 200);
  },
  showItem: function (e) {
    
    
    var info = e.target.dataset;
    // console.log(info)
    // this.requstFn(params, params.dailiType);
    switch (Number(info.dailitype)) {
      case 2:
        if (this.data.currentCity == info.addressid) {
          this.hideAniDown1();         
        } else {
          this.aniDown1(info);         
        }
        this.getareaList(info.addressid)
        break;
      case 3:
        if (this.data.currentArea == info.addressid) {
          this.hideAniDown2();         
        } else {
          this.aniDown2(info);          
        }
        this.getschoolList(info.addressid)
        break;
    }
    
    
    

  },
  getcityList: function (e) {
    var that = this;
    network.POST({
      url: 'v15/agent/city-list',
      params: {
        "mobile": app.userInfo.mobile,
        "token": app.userInfo.token,
      },
      success: function (res) {
        // console.log(res)
        wx.hideLoading();
        if (res.data.code == 200) {
          var a = res.data.data[0].list;          
          that.setData({
            cityList: a,           
          });
        } else {
          wx.showToast({
            title: res.data.message,
            image: '../../../../images/error.png',
            duration: 1000
          });
        }
      },
      fail: function () {
        wx.hideLoading();
        wx.showToast({
          title: '服务器错误',
          image: '../../../../images/home/error.png',
          duration: 1000
        })
      }
    });

  },
  getareaList: function (cityid) {
    var that = this;
    network.POST({
      url: 'v15/agent/district-list',
      params: {
        "mobile": app.userInfo.mobile,
        "token": app.userInfo.token,
        "city_id": cityid
      },
      success: function (res) {
        // console.log(res)
        wx.hideLoading();
        if (res.data.code == 200) {
          var a = res.data.data[0].list;
          that.setData({
            areaList: a,
          });
        } else {
          wx.showToast({
            title: res.data.message,
            image: '../../../../images/error.png',
            duration: 1000
          });
        }
      },
      fail: function () {
        wx.hideLoading();
        wx.showToast({
          title: '服务器错误',
          image: '../../../../images/home/error.png',
          duration: 1000
        })
      }
    });
  },
  getschoolList: function (districtid) {
    var that = this;
    network.POST({
      url: 'v15/agent/school-list',
      params: {
        "mobile": app.userInfo.mobile,
        "token": app.userInfo.token,
        "district_id": districtid
      },
      success: function (res) {
        // console.log(res)
        wx.hideLoading();
        if (res.data.code == 200) {
          var a = res.data.data[0].list;
          that.setData({
            schoolList: a,
          });
        } else {
          wx.showToast({
            title: res.data.message,
            image: '../../../../images/error.png',
            duration: 1000
          });
        }
      },
      fail: function () {
        wx.hideLoading();
        wx.showToast({
          title: '服务器错误',
          image: '../../../../images/home/error.png',
          duration: 1000
        })
      }
    });
  },
  showDialog: function () {
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    });
    this.animation = animation;
    animation.translateY(300).step();
    this.setData({
      animationData: animation.export(),
      isShowDialog: true
    });
    setTimeout(function () {
      animation.translateY(0).step();
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200);

  },
  hideDialog: function () {
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    });
    this.animation = animation;
    animation.translateY(300).step();
    this.setData({
      animationData: animation.export()
    });
    setTimeout(function () {
      animation.translateY(0).step();
      this.setData({
        animationData: animation.export(),
        isShowDialog: false,
        memberDetail: {}
      });
    }.bind(this), 200);
  },
  name_dialog: function (e) {
    this.showDialog();
    this.setData({
      dlxm: e.currentTarget.dataset.dlxm,
      dljb: e.currentTarget.dataset.dljb,
      dlqy: e.currentTarget.dataset.dlqy,
      ssdl: e.currentTarget.dataset.ssdl,
      zcsj: e.currentTarget.dataset.zcsj,
    })
  },
  showStudent: function (e) {
    // var data = e.target.dataset;
    // wx.navigateTo({
    //   url: '/pages/home/directAgency/directAgencyXydlSchool/directAgencyXydlSchool?agentsId=' + data.agentsid + '&page=1&rows=20&search=' + ''
    // })
    wx.navigateTo({
      url: '/pages/home/directAgency/directAgencyXydlSchool/directAgencyXydlSchool?schoolid=' + e.target.dataset.schoolid + '&schoolname=' + e.target.dataset.schoolname + '&mytype=' + 2,
    })
  }
})