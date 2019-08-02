const app = getApp();
const request_url = app.requestUrl;
var requestHandler = {
  url: null,
  params: {},
  success: function (res) {
    // success
  },
  fail: function () {
	 
  },
}
// GET请求
function GET(requestHandler) {
  requesttools('GET', requestHandler)
}
// POST请求
function POST(requestHandler) {
  requesttools('POST', requestHandler)
}

function requesttools(method, requestHandler) {

  var params = requestHandler.params;
  var url = requestHandler.url; 
  params.app_source_type = app.app_source_type;

  wx.showLoading({
	  title: '加载中',
  });

  wx.request({
    url: request_url + url,
    data: params,
    header: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    method: method,
    success: function (res) {     
        if (res.data.code == "508" || res.data.code == "403") {
            wx.showToast({
            title: res.data.message,
            icon: 'loading',
            duration: 1000
            });
          wx.reLaunch({
            url: '/pages/user/login/login'
            });           
        }         
        
       else {
            
        requestHandler.success(res);
      }
    },
    fail: function () {
      requestHandler.fail();
    },
    complete: function (res) { },
  })
};
function getAllAdress() {
    if (!app.allAddress) {
        POST({
            url: 'v9/address/index',
            params: {},
            success: function (res) {
                //   console.log(res);
                wx.hideLoading();
                if (res.data.code == 200) {
                    app.allAddress = res.data.data;
                } else {
                    wx.showModal({
                        title: '提示',
                        showCancel: false,
                        content: res.data.message
                    });
                }
            },
            fail: function () {
                wx.hideLoading();
                wx.showToast({
                    title: '获取地址失败',
                    image: '../../images/error.png',
                    duration: 1000
                });
            }
        }, true);
    }
}

function getSelectedAdressInfo(arr) {
    var province = app.allAddress;
    var city = province[arr[0]].city;
    var district = city[arr[1]].district;

    return ([
        { id: province[arr[0]].id, name: province[arr[0]].province_name },
        { id: city[arr[1]].id, name: city[arr[1]].city_name },
        { id: district[arr[2]].id, name: district[arr[2]].district_name }
    ]);
}
function modifyPartInfo(name, sex, callback) {
  if (app.userInfo) {
    POST({
      url: 'v15/user-info/update',
      params: {
        "mobile": app.userInfo.mobile,
        "token": app.userInfo.token,
        "nickname": name,
        "sex": sex
      },
      success: function (res) {
        wx.hideLoading();
        callback(res);
      },
      fail: function () {
        wx.hideLoading();
        wx.showToast({
          title: '服务器异常',
          image: '../../../images/error.png',
          duration: 1000
        });
      }
    });
  } else {
    app.toLogin();
  }
};
//点赞
function addAgree(resourcetypeid, id, callback) {
  if (app.userInfo) {
    POST({
      url: 'v14/news/agree-add',
      params: {
        "mobile": app.userInfo.mobile,
        "token": app.userInfo.token,
        "resourcetypeid": resourcetypeid,
        "resourceid": id
      },
      success: function (res) {
        callback && callback(res);
      },
      fail: function () {
      }
    }, true);
  } else {
    app.toLogin();
  }
};
//分享
function share(resourcetypeid, resourceid, callback) {
  if (app.userInfo) {
    POST({
      url: 'v14/news/share-add',
      params: {
        "mobile": app.userInfo.mobile,
        "token": app.userInfo.token,
        "resourcetypeid": resourcetypeid,
        "resourceid": resourceid
      },
      success: function (res) {
        callback && callback(res);
      },
      fail: function () {
        wx.showToast({
          title: '服务器异常',
          image: '../../images/error.png',
          duration: 1000
        })
      }
    }, true);
  } else {
    app.toLogin();
  }
}
function tokenExp(callback) {
  if (app.userInfo) {
    // console.log(app.userInfo)
    callback && callback();
  } else {
    app.toLogin();
  }
};
module.exports = {
  GET: GET,
  POST: POST,
  tokenExp: tokenExp,
  share: share,
  addAgree: addAgree,//点赞
  modifyPartInfo: modifyPartInfo,//我的 修改个人信息
  getAllAdress: getAllAdress,
  getSelectedAdressInfo: getSelectedAdressInfo,
};