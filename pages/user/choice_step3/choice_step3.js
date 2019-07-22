// pages/user/choice_step3/choice_step3.js
var network = require("../../../utils/network.js")
var app = getApp();
var districtId = '';
var cityId = '';
var provinceId = '';

Page({

  data: {
      showPicker: false,
      address: []
  },
  onLoad: function (options) {
    
      this.addressPicker = this.selectComponent("#addressPicker");
      network.getAllAdress();
  },
    showPicerFn() {
        this.setData({
            showPicker: true
        });
    },
    getAddressInfo(e) {
        // console.log(e.detail)
        var that = this;
        var res = network.getSelectedAdressInfo(e.detail);
        // console.log(res);
        that.setData({
            address: res
        });

        provinceId = res[0].id;
        cityId = res[1].id;
        districtId = res[2].id;

        that.hidePicker();
    },
    hidePicker() {
        this.setData({
            showPicker: false
        });
    },
    
    clicknext:function(){
        // console.log(provinceId)
        var that = this;
        if (that.data.address.length == '') {
            wx.showToast({
                title: "请选择代理地区",
                icon: 'none',
                duration: 1000
            });
        }
        else{
        
           
            network.POST({
                url: 'v15/user-info/update-agent',
                params: {
                    "mobile": app.userInfo.mobile,
                    "token": app.userInfo.token,
                    "province_id": provinceId,
                    "city_id": cityId,
                    "district_id": districtId,

                },
                success: function (res) {
                    // console.log(res);
                    wx.hideLoading();
                    if (res.data.code == 200) {
                        wx.navigateTo({
                            url: '/pages/user/choice_step2/choice_step2',
                        })

                    } else {
                        wx.showToast({
                            title: res.data.message,
                            icon: 'none',
                            duration: 1000
                        });
                    }
                },
                fail: function () {
                    wx.hideLoading();
                    wx.showToast({
                        title: '服务器异常',
                        icon: 'none',
                        duration: 1000
                    })
                }
            });
        }
    }
})