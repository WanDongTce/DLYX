// pages/question/questionChoice/questionChoice.js
var network = require("../../../utils/network.js")
var app = getApp();
Page({

  
  data: {
    questionid: '',
    list: '',
    page: 1,
    scrollHeight: 1000,
    hidden: false,
    shang: true,

    select_box: true,
    list: '',
    select: '',
    currentItem: '',

    keyword: '',

    checkedList: [],

    

  },
  onLoad: function (options) {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          //  sx_smallbox: res.windowHeight - 150
          scrollHeight: res.windowHeight - res.windowWidth / 750 * 186,
          questionid: options.questionid,
          
        });
      }
    });    
    
    network.tokenExp(function () {
      that.getListFunction();
    }); 
  },
  getListFunction: function () {
    var that = this;
    // console.log(that.data.keyword)
    // console.log(that.data.nianjiid)
    network.POST({
      url: "v15/agent/member-list",
      params: {
        "mobile": app.userInfo.mobile,
        "token": app.userInfo.token,
        "page": 1,
        "type": 1,        
        "search": that.data.keyword,

      },
      success: function (res) {
        // console.log(res)
        wx.hideLoading()
        that.setData({
          shang: true,
          student:res.data.data[0].list
        }) 
        // var tempStudents = that.data.student;
        // if (res.data.code == 200) {
        //   if (tempStudents.length > 0) {
        //     var result = res.data.data[0].list;
        //     for (var i = 0; i < result.length; i++) {
        //       for (var j = 0; j < tempStudents.length; j++) {
        //         if (result[i].studentid == tempStudents[j]) {
        //           result[i].checked = true;
        //         }
        //       }
        //     }
        //     that.setData({
        //       list: result,
        //     })
        //   } 
        //   else {
        //     that.setData({
        //       list: res.data.data[0].list,
        //     })
        //   }
        // }
        that.setData({
          list: res.data.data[0].list,
        })
      },
      fail: function () {
        wx.hideLoading()
        that.setData({
          shang: true,
        });
        wx.showToast({
          title: '服务器异常',
          image: '../../../images/home/error.png',
          duration: 1000
        })
      }
    })
  },
  loadMore: function (event) {
    var shang = this.data.shang
    if (shang == true) {
      var that = this
      var page1 = that.data.page + 1
      shang = false;
      that.setData({
        shang: shang,
      })
      network.POST({
        url: "v15/agent/member-list",
        params: {
          "mobile": app.userInfo.mobile,
          "token": app.userInfo.token,
          "page": page1,
          "type": 1,
          "search": that.data.keyword          
        },
        success: function (resnew) {
          wx.hideToast()
          if (resnew.data.data[0].list.length == 0) {
            that.setData({
              shang: true,
            })
            wx.showToast({
              title: '没有更多了',
              image: '../../../images/error.png',
              duration: 1000
            })
            return false
          }
          else {            
            that.setData({
              list: that.data.list.concat(resnew.data.data[0].list),
              shang: true,
              page: page1,
            });

          }
        },
        fail: function () {
          wx.hideToast()
          that.setData({
            shang: true,
          })
          wx.showToast({
            title: '服务器异常',
            image: '../../../images/home/error.png',
            duration: 1000
          })
        }
      })

    }
  },
  //搜索
  keyword: function (e) {
    this.setData({
      keyword: e.detail.value
    })
  },
  top_imgsearch: function (e) {
    this.setData({
      page: 1,
      select_box: true,
    })
    this.getListFunction();
  },  
  // choice: function (e) {
  //   var index = e.currentTarget.dataset.id;
  //   //console.log(index)
  //   var list = this.data.list;
  //   var temp = list[index];
  //   var stulist = this.data.student;
  //   if ((typeof (temp.checked) == 'undefined') || (temp.checked == false)) { // 第一次选中
  //     if (stulist.length == 5) {
  //       wx.showToast({
  //         title: '不能再多了',
  //         image: '../../../images/home/error.png',
  //       })
  //     } else {
  //       temp.checked = true;
  //       if (stulist.length > 0) {
  //         var j = 0; // 判断里头有没有选中过的学生 0: 没有  1: 有
  //         for (var i = 0; i < stulist.length; i++) {
  //           if (stulist[i] == temp.studentid) {
  //             j = 1;
  //           }
  //         }
  //         if (j == 0) {
  //           stulist.push(temp.studentid);
  //         }
  //       } else {
  //         stulist.push(temp.studentid);
  //       }
  //       this.setData({
  //         stulist: stulist
  //       })
  //     }
  //   } else {
  //     if (temp.checked == true) { // 取消选中
  //       temp.checked = false;
  //       var j = 0; // 设置要删除的数组下标
  //       for (var i = 0; i < stulist.length; i++) {
  //         if (stulist[i] == temp.studentid) {
  //           j = i;
  //         }
  //       }
  //       stulist.splice(j, 1)
  //     } else if (temp.checked == false) {  // 第二次选中
  //       if (stulist.length == 5) {
  //         wx.showToast({
  //           title: '不能再多了',
  //         })
  //       } else {
  //         temp.checked = true;
  //       }

  //     }
  //   }
  //   list[index] = temp;
  //   this.setData({
  //     list: list
  //   })

  // },
  choice: function (e) {
    var index = e.currentTarget.dataset.id;
    var list = this.data.list;
    var clist = this.data.checkedList;

    if (!(list[index].checked)) {
      list[index].checked = true;
      clist.push(list[index].id);
    } else {
      list[index].checked = false;
      for (var i = 0; i < clist.length; i++) {
        if (clist[i] == list[index].id) {
          break;
        }
      }
      clist = clist.slice(0, i).concat(clist.slice(i + 1));
    };
    // console.log(clist);
    this.setData({
      list: list,
      checkedList: clist
    });
  },
  btn_sure: function (e) {
    var that = this;
    if (that.data.checkedList.length == 0) {
      wx.showToast({
        title: '请选择学生',
        image: '../../../images/error.png',
        duration: 1000
      });
    }
    else {
      wx.showModal({
        title: '提示',
        content: '确认此操作吗？',
        success: function (res) {
          if (res.confirm) {
            var obj = {};
            var key = '';
            var arr = that.data.checkedList;
            for (var i = 0; i < arr.length; i++) {
              key = i;
              obj[key] = arr[i];
            }
            // console.log(obj);
            network.POST({
              url: "v15/problem-square/find-answer",
              params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
                "questionid": that.data.questionid,
                "uid": JSON.stringify(obj),

              },
              success: function (res) {
                // console.log(res)
                wx.hideLoading()
                if (res.data.code == 200) {
                  wx.navigateBack({
                  })
                }
                else {
                  wx.showToast({
                    title: res.data.message,
                    image: '../../../images/error.png',
                    duration: 1000
                  });

                }
              },
              fail: function () {
                wx.hideLoading()
                wx.showToast({
                  title: '服务器异常',
                  image: '../../../images/home/error.png',
                  duration: 1000
                })
              }
            })
          }
        }
      });
    }
  },
  // //发送求救
  // seek_help: function () {
  //   var that = this;
  //   // console.log(that.data.stulist)
    
  //   if (that.data.stulist == undefined) {
  //     wx.showModal({
  //       title: '',
  //       content: '还没有选择任何学生',
  //       showCancel: false,
  //       confirmColor: '#ED1B1A',
  //     })
  //   }
  //   else if (that.data.stulist.length < 1) {
  //     wx.showModal({
  //       title: '',
  //       content: '还没有选择任何学生',
  //       showCancel: false,
  //       confirmColor: '#ED1B1A',
  //     })
  //   }
  //   else {
  //     var obj = {};
  //     var key = '';
  //     var arr = that.data.stulist;
  //     for (var i = 0; i < arr.length; i++) {
  //       key = i;
  //       obj[key] = arr[i];
  //     }
  //     wx.showModal({
  //       title: '提示',
  //       content: '是否对所选学生发送此题的求助信息？',
  //       confirmColor: '#ED1B1A',
  //       success: function (res) {
  //         if (res.confirm) {
  //           network.POST({
  //             url: "v15/problem-square/find-answer",
  //             params: {
  //               "mobile": app.userInfo.mobile,
  //               "token": app.userInfo.token,
  //               "page": page,
  //               "questionid": that.data.questionid,
  //               "uid": JSON.stringify(obj),
                
  //             },
  //             success: function (res) {
  //               console.log(res)
  //               wx.hideLoading()
  //               if (res.data.code == 200) {
  //                 wx.navigateBack({
  //                 })
  //               }
  //               else {
  //                 wx.showToast({
  //                   title: res.data.message,
  //                   image: '../../../images/error.png',
  //                   duration: 1000
  //                 });

  //               }
  //             },
  //             fail: function () {
  //               wx.hideLoading()
  //               wx.showToast({
  //                 title: '服务器异常',
  //                 image: '../../../images/home/error.png',
  //                 duration: 1000
  //               })
  //             }
  //           })
  //         } else if (res.cancel) {
  //           //console.log('用户点击取消')
  //         }
  //       }
  //     })

  //   }

  // },
})