// pages/series/detail.js
const app = getApp()
const util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sid: '',
    title: '合视频集',
    bilibliWeappId: '',
    bilibliWeappVideoPath: '',
    series: {},
    seriesInfo: {},
    videoOrderby: 'desc',
    videoOrderbyOptions: [
      { label: '默认排序', value: 'desc' },
      { label: '升序排序', value: 'asc' }
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log('sid', options.sid)
    const uid = app.globalData.uid
    const sid = options.sid ? options.sid : ''
    if (!sid) {
      wx.redirectTo({ url: '/pages/index/index' })
    }

    this.setData({
      sid: sid,
      bilibliWeappId: app.globalData.bilibliWeappId,
      bilibliWeappVideoPath: app.globalData.bilibliWeappVideoPath
    })
    this.getSeriesInfo(sid)
    this.getSeriesVideoList(uid, sid)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    const currentPage = this.data.series.page.num
    const pagesize = this.data.series.page.size
    const total = this.data.series.page.total
    if (currentPage * pagesize >= total) return
    const page = currentPage + 1
    this.getSeriesVideoList(app.globalData.uid, this.data.sid, this.data.videoOrderby, page)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },
  getSeriesVideoList(uid = '', sid = '', sort = 'desc', pn = '1', ps = '30') {
    var _this = this
    wx.request({
      url: `${app.globalData.apiDomain}/x/series/archives?mid=${uid}&series_id=${sid}&only_normal=true&sort=${sort}&pn=${pn}&ps=${ps}`,
      success(res) {
        if (pn <= 1) {
          let series = res.data.data
          series.archives.forEach((element, index) => {
            series.archives[index].create_at = util.formatTimestampToDate(element.ctime)
            series.archives[index].time_length = util.formatSecondsToDateString(element.duration)
          });
          _this.setData({ series: series })
        } else {
          let series = _this.data.series
          res.data.data.archives.forEach((element, index) => {
            res.data.data.archives[index].create_at = util.formatTimestampToDate(element.ctime)
            res.data.data.archives[index].time_length = util.formatSecondsToDateString(element.duration)
          });
          series.archives = series.archives.concat(res.data.data.archives)
          series.page = res.data.data.page
          _this.setData({ series: series })
        }
      }
    })
  },
  getSeriesInfo(sid = '') {
    var _this = this
    wx.request({
      url: `${app.globalData.apiDomain}/x/series/series?series_id=${sid}`,
      success(res) {
        _this.setData({ seriesInfo: res.data.data, title: res.data.data.meta.name })
      }
    })
  },
  orderbyChange(e) {
    const orderby = e.detail.value
    this.setData({ videoOrderby: orderby })
    this.getSeriesVideoList(app.globalData.uid, this.data.sid, orderby)
  },
  showModal(e) {
    this.setData({ modalName: e.currentTarget.dataset.target })
  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },
  preview(e) {
    const image = e.currentTarget.dataset.image
    wx.previewImage({ urls: image })
  },
})