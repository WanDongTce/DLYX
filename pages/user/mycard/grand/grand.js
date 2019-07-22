var network = require("../../../../utils/network.js")
var app = getApp();




Page({

  data: {
    list:'',
    myid:'',
    tgkid: '',
    search: '',
    regoinId: '',

    page: 1,
    rows: 15,
    
    hidden: false,
    shang: true,
  },

  onLoad: function (options) {
    this.setData({
      tgkid: options.tgkid
    }); 
    var that=this;
    network.tokenExp(function () {
      that.getlistFunction(1, '');
    });   
    
    
  },
  selectClick: function (event) {

    // this.data.model[event.currentTarget.id].selectImage  
    for (var i = 0; i < this.data.list.length; i++) {
      if (event.currentTarget.id == i) {
        this.data.list[i].selectImage = true;
        // console.log(this.data.list[i].studentid)
        this.setData({
          myid: this.data.list[i].id
        })
      }
      else {

        this.data.list[i].selectImage = false
      }
      
    }
    this.setData(this.data)
    // console.log(this.data.myid)
    // this.setData(this.data)

  },
  getlistFunction: function (page, search) {

    var that = this;
    network.POST({
      url: "v15/agent/member-list",
      params: {
        
        "mobile": app.userInfo.mobile,
        "token": app.userInfo.token,
        "page": page,
        "type": 3,
        "search": search,
      },
      success: function (res) {
        wx.hideLoading();
        // console.log(res)
        // if (res.data.status == "S000") {
        //   if (res.data.result.students.length==0){
        //     wx.showToast({
        //       title: '暂无数据',
        //       image: '../../../../images/home/error.png',
        //       duration: 1000
        //     });
        //   }else{
        //     that.setData({
        //       list: res.data.result.students,
        //     })
        //   }
          
        // }
        if (res.data.code == 200) {
          if (res.data.data[0].count==0){
            wx.showToast({
              title: '暂无数据',
              image: '../../../../images/error.png',
              duration: 1000
            });
          }else{
            that.setData({
              list: res.data.data[0].list,
            })
          }
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
          title: '服务器异常',
          image: '../../../../images/error.png',
          duration: 1000
        })
      }
    })
  },
  qr_btn:function(){
    var that=this;
    // console.log(that.data.myid)
    // console.log(that.data.tgkid)
    if (that.data.myid==''){
      wx.showModal({
        title: '提示',
        content: '请选择发放人',
        showCancel: false,
        confirmText: '确定',
        
      })

    }else{
      network.POST({
        url: "v15/card-bag/send-card",
        params: {
          "mobile": app.userInfo.mobile,
          "token": app.userInfo.token, 
          "uid": that.data.myid,
          "cid": that.data.tgkid,       
        },
        success: function (res) {
          wx.hideLoading();
          // console.log(res)
          if (res.data.code == 200) {                        
            wx.showModal({
              title: '提示',
              content: '操作成功',  
              showCancel:false,            
              success: function (res) {
                if (res.confirm) {
                  wx.navigateTo({
                    url: '/pages/user/mycard/mycard',
                  })
                } else if (res.cancel) {
                }
              }
            })
            
          }else{
            wx.showToast({
              title: res.data.msg,
              image: '../../../../images/error.png',
              duration: 1000
            })
          }
        },
        fail: function () {
          wx.hideLoading();
          wx.showToast({
            title: '服务器异常',
            image: '../../../../images/error.png',
            duration: 1000
          })
        }
      })
    }
  },
  //input的内容
  bindKeyInput: function (e) {
    this.setData({
      search: e.detail.value
    })

  },
  //搜索
  bindconfirm: function (e) {
      var that=this;
      that.setData({        
        search: that.data.search,
        list: null,
        page: 1,
      })
      //开始搜索
      that.getlistFunction(that.data.page, that.data.search)
    // }

  },
  onReachBottom: function (event) {
    // console.log('111')
    wx.showToast({
      title: '加载中...',
      duration: 1000,
      icon: 'loading'
    })
    var shang = this.data.shang
    if (shang == true) {
      var that = this
      var page1 = that.data.page + 1
      shang = false;
      that.setData({
        shang: shang,
      })
      // console.log(page1)
          network.POST({
            url: "v15/agent/member-list",
            params: {              
              "mobile": app.userInfo.mobile,
              "token": app.userInfo.token,
              "page": page1,
              "type": 3,
              "search": that.data.search,
            },
            success: function (resnew) {
              // console.log(resnew)
              wx.hideToast()
              if (resnew.data.data[0].hasmore == 0) {
                that.setData({
                  hidden: true,
                  shang: true,

                })
                
                wx.showToast({
                  title: '没有更多了',
                  image: '../../../../images/error.png',
                  duration: 1000
                });
                return false
              }
              else {
                that.setData({
                  hidden: true,
                  list: that.data.list.concat(resnew.data.data[0].list),
                  shang: true,
                  page: page1,
                });
              }
            },
            fail: function () {
              wx.hideToast()
              that.setData({
                hidden: true,
                shang: true,
              })
              wx.showToast({
                title: '服务器异常',
                image: '../../../../images/error.png',
                duration: 1000
              })
            }
          })
        
    
    }
  },
})