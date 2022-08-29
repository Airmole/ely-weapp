// pages/rank/index.js
import * as echarts from '../../echarts/echarts.min'
const rankConfig = require('./rankGraphConfig')
const app = getApp()
import QR from '../../utils/qrcode'
import Poster from '../../weapp-canvas/poster/poster'
const posterConfig = require('./posterConfig')
const utils = require('../../utils/util')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    dateString: '',
    userRank: { lazyLoad: true },
    timeLine: { lazyLoad: true },
    pieGraph: { lazyLoad: true },
    wordcloud: '',
    loaded: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.initalDate(options)
  },

  initalDate(options) {
    let date = options.date ? options.date : '';
    if (date == '') {
      var day = new Date();
      day.setTime(day.getTime() - 24 * 60 * 60 * 1000);
      date = day.getFullYear() + "" + ((day.getMonth() < 10 ? ('0' + (day.getMonth() + 1)) : (day.getMonth()) + 1)) + "" + ((day.getDate() < 10 ? ('0' + (day.getDate())) : (day.getDate())));
    }
    const dateString = date.substr(0, 4) + '-' + date.substr(4, 2) + '-' + date.substr(6, 2)
    this.setData({ dateString: dateString, wordcloud: `https://yili.airmole.cn/static/images/${date}.png` })

    this.getUserRankData(date)
  },

  dateChange(e) {
    const dateString = e.detail.value
    const date = dateString.replace(/-/g, '')
    this.setData({ dateString: dateString, wordcloud: `https://yili.airmole.cn/static/images/${date}.png` })
    this.getUserRankData(date)
  },


  getUserRankData(date = '') {
    var _this = this
    wx.request({
      url: `${app.globalData.yiliApiDomain}/static/json/${date}.json`,
      success(res) {
        if (res.statusCode == '200') {
          _this.setData({ loaded: true })
          _this.setRankGraphData(res.data)
        } else {
          _this.setData({ loaded: false })
        }
      }
    })
  },


  setRankGraphData(userRank) {
    this.userrankComponent.init((canvas, width, height, dpr) => {
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height,
        devicePixelRatio: dpr // new
      });
      setOption(chart, userRank.user_rank, 'user')
      this.chart = chart
      return chart;
    });
    this.timelineComponent.init((canvas, width, height, dpr) => {
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height,
        devicePixelRatio: dpr // new
      });
      setOption(chart, userRank.timeline, 'time')
      this.chart = chart;
      return chart;
    });
    this.pieGraphComponent.init((canvas, width, height, dpr) => {
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height,
        devicePixelRatio: dpr // new
      });
      setOption(chart, userRank.pie, 'pie')
      this.chart = chart;
      return chart;
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    // 获取组件
    this.userrankComponent = this.selectComponent('#userRank')
    this.timelineComponent = this.selectComponent('#timeLine')
    this.pieGraphComponent = this.selectComponent('#pieGraph')
  },

  download() {
    if (!this.data.loaded) {
      wx.showToast({
        icon: 'error',
        title: '暂无数据生成'
      })
      return
    }

    const date = this.data.dateString.replace(/-/g, '')
    const content = `https://yili.airmole.cn/#/?date=${date}`
    QR.api.draw(content, 'qrcode', 100, 100, this, this.canvasDraw)
    console.log(content)
  },
  canvasDraw() {
    var _this = this
    const nowDatetime = utils.getNowTimeDateString()

    wx.canvasToTempFilePath({
      canvasId: 'qrcode',
      success: function (res) {
        let qrcodePath = res.tempFilePath
        let rankPoster = posterConfig.posterConfig.rankConfig

        const userRankCanvas = _this.selectComponent('#userRank')
        const timeLineCanvas = _this.selectComponent('#timeLine')
        const pieGraphCanvas = _this.selectComponent('#pieGraph')
        userRankCanvas.canvasToTempFilePath({
          success: res => {
            const userrankPath = res.tempFilePath
            timeLineCanvas.canvasToTempFilePath({
              success: res => {
                const timelinePath = res.tempFilePath
                pieGraphCanvas.canvasToTempFilePath({
                  success: res => {
                    const piegraphPath = res.tempFilePath
                    rankPoster.texts[0].text = _this.data.dateString
                    rankPoster.texts[2].text = rankPoster.texts[2].text + _this.data.dateString.replace(/-/g, '')
                    rankPoster.texts[3].text = nowDatetime + rankPoster.texts[3].text
                    rankPoster.images[0].url = userrankPath
                    rankPoster.images[1].url = piegraphPath
                    rankPoster.images[2].url = timelinePath
                    rankPoster.images[3].url = _this.data.wordcloud
                    rankPoster.images[4].url = qrcodePath
                    _this.setData({ posterConfig: rankPoster }, () => {
                      Poster.create(true);
                    });
                  }
                });
              }
            });
          }
        });
      },
      fail: function (res) {
        console.log(res);
      }
    });
  },
  onPosterSuccess(e) {
    const { detail } = e;
    wx.previewImage({
      current: detail,
      urls: [detail]
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    const dateString = this.data.dateString
    const date = dateString.replace(/-/g, '')
    return {
      path: `pages/rank/index?date=${date}`,
      title: `直播间${dateString}弹幕统计`,
    }
  }
})
function setOption(chart, option, type) {
  if (type == 'user') {
    let userRank = rankConfig.userRank
    let labels = []
    for (let s of option.label.slice(0, 20).reverse()) {
      let nickname = s
      if (s.length >= 8) {
        nickname = s.substr(0, 5) + '...'
      }
      labels.push(nickname)
    }
    userRank.yAxis.data = labels
    userRank.series[0].data = option.value.slice(0, 20).reverse()
    chart.setOption(userRank, option);
  }
  if (type == 'time') {
    let timeLine = rankConfig.timeLine
    const moriningLabel = option.label.slice(0, 12)
    const eveningLabel = option.label.slice(12, 23)
    timeLine.xAxis.data = eveningLabel.concat(moriningLabel)
    const morningData = option.value.slice(0, 12)
    const eveningData = option.value.slice(12, 23)
    timeLine.series[0].data = eveningData.concat(morningData)
    chart.setOption(timeLine, option);
  }

  if (type == 'pie') {
    let pieGraph = rankConfig.pieGraph
    pieGraph.series[0].data = option
    chart.setOption(pieGraph, option);
  }
}
