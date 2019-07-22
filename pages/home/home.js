// pages/home/home.js
var network = require("../../utils/network.js")
var app = getApp();

Page({

	data: {
    availableprice:0,
    m_shouyi_sum: 0,
    m_user_count: 0,
    m_agent_count: 0,
    msgList: '',
    show: false,

    agentinfoshow:'',
    directinfo: '',
	},
	onLoad: function (options) {
    var that=this;    
	},


	onShow: function () {
    var that = this;
    // console.log(app.userInfo.is_renewal)
    if (app.userInfo.agentlev == 0) {
        wx.navigateTo({
            url: '/pages/user/choice_step3/choice_step3'
        });
    }
    if (app.userInfo.is_renewal==2 ) {           
            wx.navigateTo({
                // url: '/pages/user/recharge/recharge'
                url: '/pages/user/rechargeAgreement/rechargeAgreement'
            });
    }
    else{

    
        if (app.userInfo.agentlev < 5) {
        that.setData({
            agentinfoshow: 1
        })
        if (app.userInfo.agentlev ==4 ) {
            that.setData({
            agentinfoshow_num: 4
            })
        }
        }
        else {
        that.setData({
            agentinfoshow: 2
        })
        }
        if (app.userInfo.agentlev == 5) {
        that.setData({
            directinfo: '直属校园加盟商'
        })
        }
        if (app.userInfo.agentlev < 5) {
        that.setData({
            directinfo: '直属校园代理及校园加盟商信息'
        })
        }
        network.tokenExp(function () {
        that.getCaiwuList();
        });
    }
	},
  getCaiwuList:function(){
    var that = this;
    network.POST({
      url: 'v15/agent/index',
      params: {
        "mobile": app.userInfo.mobile,
        "token": app.userInfo.token,
      },
      success: function (res) {
        // console.log(res);
        wx.hideLoading();
        if (res.data.code == 200) {
          var a = res.data.data[0].item
          that.setData({
            availableprice: a.availableprice,
            m_shouyi_sum: a.m_shouyi_sum,
            m_user_count: a.m_user_count,
            m_agent_count: a.m_agent_count,
            msgList: res.data.data[0].newlist
          })
        } else {
          wx.showToast({
            title: res.data.message,
            image: '../../images/error.png',
            duration: 1000
          })
        }
      },
      fail: function () {
        wx.hideLoading();
        wx.showToast({
          title: '服务器异常',
          image: '../../images/error.png',
          duration: 1000
        })
      }
    });
  },
	
	//点击代理信息
	tz_agentInfo: function () {
		if(app.userInfo.agentlev<4){
      wx.navigateTo({
        url: '/pages/home/agentInfo/agentInfoItemSelect/agentInfoItemSelect'
      });	
    }
    else if (app.userInfo.agentlev ==4 ){
      wx.navigateTo({
        url: '/pages/home/agentInfo/agentInfoXyjm/agentInfoXyjm',
      })
    }			
	
},
  //学校代理
  showStudent: function (e) {    
    wx.navigateTo({
      url: '/pages/home/directAgency/directAgencyXydlSchool/directAgencyXydlSchool?schoolid=' + '' + '&schoolname=' + '会员信息' + '&mytype=' + 2,
    })
  },

	//点击直属代理
	tz_directAgency: function () {		
			
				wx.navigateTo({
					url: '/pages/home/directAgency/directAgency',
				})			
		
	},
	//点击直属会员
  tz_directmember: function () {
			// wx.navigateTo({
      //   url: '/pages/home/directAgency/directAgencyXydlSchool/directAgencyXydlSchool?mytype=' + '1' + '&schoolname=' + '直属会员',
			// })
      wx.navigateTo({
        url: '/pages/home/directMember/directMember?mytype=' + '1'
      })
		
	},
	//点击财务报表
	tz_finance: function () {
		if (checkkLogin()) {
			wx.navigateTo({
        url: '/pages/home/finance/finance',
      })
		} else {
			pushLoginController();
		};
	},
  tz_imgDetail:function(e){
    wx.navigateTo({
      url: '/pages/home/neiqian/neiqian?id=' + e.currentTarget.dataset.imgid,
    })
  },
  //点击查看明细
  tz_financeDetails: function () {
    wx.navigateTo({
      url: '/pages/home/finance/allIncome/allIncome?tztype=' + 2,
    })
    
  },
  //点击新增会员
  tz_financeAdd: function () {
    wx.navigateTo({
      url: '/pages/home/finance/financeAdd/financeAdd',
    })
  },
  //点击新增代理
  tz_financeAddAgent: function () {
    //console.log('add')
    wx.getStorage({
      key: 'userinfo',
      success: function (res2) {
        //console.log(res2)
        if (res2.data.dailitype == 1 || res2.data.dailitype == 2 || res2.data.dailitype == 3 || res2.data.dailitype == 4 || res2.data.dailitype == 5) {
          wx.navigateTo({
            url: '/pages/home/finance/financeAddAgent/financeAddAgent',
          })
        }
        else {
          wx.showToast({
            title: '您没有权限',
            image: '../../../images/home/error.png',
            duration: 1000
          });
        }
      },
    })
    // wx.navigateTo({
    //   url: '/pages/home/finance/financeAddAgent/financeAddAgent',
    // })
  },
  // 点击increase
  tz_increase:function(e){
    wx.navigateTo({
      url: '/pages/home/finance/increase/increase?tabarr=' + e.currentTarget.dataset.tabarr,
    })
  },
  //跳转到新闻
  tz_webview: function (e) {
    var newssrc = e.currentTarget.dataset.src;
    if (newssrc.indexOf("?") != -1) {
      newssrc = newssrc.split("?")[0];
    
    }
    wx.navigateTo({
      url: '/pages/webView/webView?newssrc=' + newssrc + '&newsid=' + e.currentTarget.dataset.newsid,
    })
  },
  
})