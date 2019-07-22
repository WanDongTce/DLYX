// pages/home/finance/allIncreaseAgentChart/allIncreaseAgentChart.js
const network = require("../../../../utils/network.js");
const app = getApp();

var date = new Date();
var curtYear = date.getFullYear();
var curtMonth = date.getMonth();
var curtMonthStr = curtMonth < 9 ? '0' + (curtMonth + 1) : curtMonth + 1;
var ctx = null;
var tempAngle = -90;
var currentAngle = null;
var sAngle = null;
var eAngle = null;
var x, y, r;
var total = '';
var imgW = null, imgH = null;
var percentTotal = 800;
Page({
    data: {
        tabIndex: 1,
        listData: [],
        startDate: curtYear - 2 + '-' + curtMonthStr,
        endDate: curtYear + 5 + '-' + curtMonthStr,
        dateStr: curtYear + '-' + curtMonthStr,
        
        width: app.systemInfo.windowWidth,
        height: app.systemInfo.windowHeight * .5,
        chartData: [],
        curtYear: curtYear,
        curtMonth: curtMonth + 1
    },
    onLoad: function (options) {
        ctx = wx.createCanvasContext('canvas');
        x = this.data.width / 2;
        y = this.data.height / 2;
        r = this.data.width / 8;
        imgW = r;
        imgH = r * 1.5;
    },
    onShow: function () {
        var that = this;
        network.tokenExp(function () {
          that.getChartData();
        });
    },
        
    pickerChange: function (e) {
        var a = e.detail.value;
        curtYear = a.split('-')[0];
        curtMonth = parseInt(a.split('-')[1]) - 1;
        curtMonthStr = a.split('-')[1];

        this.setData({
            dateStr: a
        });
        this.getList();
    },
    
    getChartData: function () {
        var that = this;
        var datestr = that.data.curtYear
        network.POST({
            url: 'v15/agent-info/agent-chart',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
                "year": datestr
            },
            success: function (res) {
                console.log(res);
                wx.hideLoading();
                if (res.data.code == 200) {
                    var b = res.data.data[0];
                    that.setData({
                        chartData: b
                    });

                    total = parseFloat(b.all_sum);
                    var a = b.list;

                    for (var i = 0; i < a.length; i++) {
                        if (i > 0) {
                            tempAngle += currentAngle;
                        }
                        var p = (parseFloat(a[i].num) / total * 100).toFixed(2) + '%';
                        currentAngle = parseFloat(a[i].num) / total * 360;
                        sAngle = tempAngle * Math.PI / 180;
                        eAngle = currentAngle * Math.PI / 180 + sAngle;

                        that.drawChart(a[i].color, p);
                    }
                } else {
                    wx.showToast({
                        title: res.data.message,
                        image: '../../../../images/error.png',
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
        });
    },
    drawChart: function (c, p) {
        ctx.beginPath();
        ctx.setLineWidth(r * 2);
        ctx.arc(x, y, r, sAngle, eAngle);
        ctx.setStrokeStyle('rgb(' + c.r + ',' + c.g + ',' + c.b + ')');
        ctx.stroke();
        ctx.draw(true);

        ctx.beginPath();
        ctx.setFontSize(10);
        ctx.setFillStyle('rgb(' + c.R + ',' + c.G + ',' + c.B + ')');
        ctx.setTextAlign('center');
        var textAngle = currentAngle / 2 + tempAngle;
        var tx = x + Math.cos(textAngle * Math.PI / 180) * (r * 2 + 20);
        var ty = y + Math.sin(textAngle * Math.PI / 180) * (r * 2 + 20);
        ctx.fillText(p, tx, ty);
        ctx.fill();
        ctx.draw(true);
    },
    modDate(e) {
        var that = this;
        var flag = e.currentTarget.dataset.flag;
        var a = that.data.curtYear;
        
        // console.log(a,b);
        if (flag == 1) {
            
                that.setData({
                    curtYear: a - 1,
                    
                });
            
        } else if (flag == 2) {
            
                that.setData({
                    curtYear: a + 1,
                })
            
        }
        that.clearCanvas();
        that.getChartData();
    },
    clearCanvas() {
        var that = this;
        tempAngle = -90;
        currentAngle = null;
        sAngle = null;
        eAngle = null;
        ctx.draw(false);
    },
    onUnload() {
        tempAngle = -90;
        currentAngle = null;
        ctx = null;
        sAngle = null;
        eAngle = null;
        total = '';
    }
})