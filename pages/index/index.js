// index.js
// 获取应用实例
const app = getApp()
const util = require('../../utils/util.js')
import QR from '../../utils/qrcode'
import Poster from '../../weapp-canvas/poster/poster'
const posterConfig = require('./posterConfig')

Page({
  data: {
    pageCur: 'index',
    tabCur: 'home',
    videoOrderby: 'pubdate',
    videoTid: '0',
    videoKeyword: '',
    bilibliWeappId: '',
    bilibliWeappVideoPath: '',
    posterConfig: {},
    tabs: [
      { label: '主页', value: 'home', icon: 'homefill' },
      { label: '动态', value: 'dynamic', icon: 'favorfill' },
      { label: '投稿', value: 'video', icon: 'videofill' },
      { label: '合集', value: 'series', icon: 'tagfill' }
    ],
    title: '欢迎使用',
    bgImage: 'http://i2.hdslb.com/bfs/space/bd4068984046ee454902da0c13b331dbe626ee82.jpg',
    uperInfo: {},
    uperCardInfo: {},
    topGuard: {},
    charge: {},
    videos: {},
    series: {}
  },
  onLoad() {
    console.log('主播的UID为：', app.globalData.uid)
    const uid = app.globalData.uid
    this.getHomePageData(uid)
    this.setData({
      bilibliWeappId: app.globalData.bilibliWeappId,
      bilibliWeappVideoPath: app.globalData.bilibliWeappVideoPath
    })
  },
  getHomePageData(uid) {
    this.getUperUserinfo(uid)
    this.getUperCardInfo(uid)
    this.getUperChargeData(uid)
    this.getUperVideoList(uid)
    this.getUperSeriesList(uid)
  },
  getUperUserinfo(uid) {
    var _this = this
    wx.request({
      url: `${app.globalData.apiDomain}/x/space/acc/info?mid=${uid}&jsonp=jsonp`,
      success(res) {
        _this.setData({
          title: res.data.data.name,
          bgImage: res.data.data.top_photo,
          uperInfo: res.data.data
        })
        // console.log(res.data.data.live_room)
        if (res.data.data.live_room) {
          _this.getLiveroomTopGuard(res.data.data.live_room.roomid, app.globalData.uid)
        }
      }
    })
  },
  getUperCardInfo(mid) {
    var _this = this
    wx.request({
      url: `${app.globalData.apiDomain}/x/web-interface/card?mid=${mid}`,
      success(res) {
        _this.setData({ uperCardInfo: res.data.data })
      }
    })
  },
  getLiveroomInitData(roomid) {
    var _this = this
    wx.request({
      url: `${app.globalData.liveApiDomain}/room/v1/Room/room_init?id=${roomid}`,
      success(res) {
        const roomUid = res.data.data ? res.data.data.uid : ''
        _this.getLiveroomTopGuard(roomid, roomUid)
      }
    })
  },
  getUperChargeData(uid) {
    var _this = this
    wx.request({
      url: `${app.globalData.apiDomain}/x/ugcpay-rank/elec/month/up?up_mid=${uid}`,
      success(res) {
        _this.setData({ charge: res.data.data })
      }
    })
  },
  getLiveroomTopGuard(roomid, ruid) {
    var _this = this
    wx.request({
      url: `${app.globalData.liveApiDomain}/xlive/app-room/v2/guardTab/topList?page=1&page_size=29&ruid=${ruid}&roomid=${roomid}`,
      success(res) {
        let topGuard = res.data.data
        topGuard.top3.forEach((element, index) => {
          topGuard.top3[index].medal_info = _this.formatMedalColor(element.medal_info)
        })
        topGuard.list.forEach((element, index) => {
          topGuard.list[index].medal_info = _this.formatMedalColor(element.medal_info)
        })
        topGuard.list = topGuard.list.splice(0, 10)
        topGuard.top3.splice(1, 1, ...topGuard.top3.splice(0, 1, topGuard.top3[1]));
        // console.log('直播UID为', topGuard)
        _this.setData({ topGuard: topGuard })
      }
    })
  },
  getUperVideoList(uid, page = 1, pagesize = 25, orderby = 'pubdate', tid = 0, keyword = '') {
    var _this = this
    wx.request({
      url: `${app.globalData.apiDomain}/x/space/arc/search?pn=${page}&ps=${pagesize}&order=${orderby}&jsonp=jsonp&mid=${uid}&tid=${tid}&keyword=${keyword}`,
      success(res) {
        if (page <= 1) {
          _this.setData({ videos: res.data.data })
        } else {
          let videos = _this.data.videos
          videos.list.vlist = videos.list.vlist.concat(res.data.data.list.vlist)
          videos.list.tlist = res.data.data.list.tlist
          videos.page = res.data.data.page
          _this.setData({ videos: videos })
        }
      }
    })
  },
  getUperSeriesList(uid, page = 1, pagesize = 10) {
    var _this = this
    wx.request({
      url: `${app.globalData.apiDomain}/x/polymer/space/seasons_series_list?mid=${uid}&page_num=${page}&page_size=${pagesize}`,
      success(res) {
        res.data.data.items_lists.series_list.forEach((serie, key) => {
          serie.archives.forEach((element, index) => {
            res.data.data.items_lists.series_list[key].archives[index].create_at = util.formatTimestampToDate(element.ctime)
            res.data.data.items_lists.series_list[key].archives[index].time_length = util.formatSecondsToDateString(element.duration)
          });
        });
        _this.setData({ series: res.data.data })
      }
    })
  },
  getSpaceDynamicList(uid = '', offset = '') {
    var _this = this
    wx.request({
      url: `${app.globalData.apiDomain}/x/polymer/web-dynamic/v1/feed/space?offset=${offset}&host_mid=${uid}&timezone_offset=-480`,
      success(res) {
        res.data.data.items.forEach((element, index) => {
          if (element.type == 'DYNAMIC_TYPE_LIVE_RCMD') {
            res.data.data.items[index].modules.module_dynamic.major.live_rcmd.json = JSON.parse(element.modules.module_dynamic.major.live_rcmd.content)
          }
        });
        if (!offset) {
          _this.setData({ dynamic: res.data.data })
        } else {
          let dynamic = _this.data.dynamic
          dynamic.items = dynamic.items.concat(res.data.data.items)
          dynamic.offset = res.data.data.offset
          _this.setData({ dynamic: dynamic })
        }
      }
    })
  },
  formatMedalColor(medal_info) {
    medal_info.start_color = util.formatNumberColor(medal_info.medal_color_start)
    medal_info.end_color = util.formatNumberColor(medal_info.medal_color_end)
    medal_info.border_color = util.formatNumberColor(medal_info.medal_color_border)
    return medal_info
  },
  preview(e) {
    const image = e.currentTarget.dataset.image
    wx.previewImage({ urls: image })
  },
  go2video() {
    this.setData({ tabCur: 'video' })
  },
  tabSelect(e) {
    const tab = e.currentTarget.dataset.id
    const uid = app.globalData.uid
    if (tab == 'home') {
      this.getHomePageData(uid)
    }
    if (tab == 'dynamic') {
      this.getSpaceDynamicList(uid)
    }
    this.setData({ tabCur: tab })
  },
  videoTidChanged(e) {
    const tid = e.detail
    const uid = app.globalData.uid
    const videoContent = this.selectComponent('#video-content')
    videoContent.setData({ videoTid: tid })
    this.getUperVideoList(uid, 1, this.data.videos.page.ps, this.data.videoOrderby, tid)
    this.setData({ videoTid: tid })
  },
  orderbyChanged(e) {
    const orderby = e.detail
    const uid = app.globalData.uid
    const videoContent = this.selectComponent('#video-content')
    videoContent.setData({ videoOrderby: orderby })
    this.getUperVideoList(uid, 1, this.data.videos.page.ps, orderby, this.data.videoTid)
    this.setData({ videoOrderby: orderby })
  },
  onReachBottom() {
    const tabCur = this.data.tabCur
    const uid = app.globalData.uid
    if (tabCur == 'dynamic') {
      this.getSpaceDynamicList(uid, this.data.dynamic.offset)
    }
    if (tabCur == 'video') {
      var page = parseInt(this.data.videos.page.pn) + 1
      if (this.data.videos.page.count <= (this.data.videos.page.pn * this.data.videos.page.ps)) {
        return
      }
      this.getUperVideoList(uid, page, this.data.videos.page.ps, this.data.videoOrderby, this.data.videoTid, this.data.videoKeyword)
    }
  },
  qrcode() {
    const mid = this.data.uperCardInfo.card.mid
    const content = `https://m.bilibili.com/space/${mid}`
    QR.api.draw(content, 'uperQrcode', 100, 100, this, this.canvasDraw);
  },
  canvasDraw() {
    var _this = this
    wx.canvasToTempFilePath({
      canvasId: 'uperQrcode',
      success: function (res) {
        let qrcodePath = res.tempFilePath;
        var qrcodePoster = posterConfig.posterConfig.qrcodeConfig
        console.log(qrcodePoster)
        qrcodePoster.images[0].url = _this.data.uperCardInfo.card.face
        qrcodePoster.images[1].url = qrcodePath
        qrcodePoster.texts[0].text = _this.data.uperCardInfo.card.name
        qrcodePoster.texts[1].text = _this.data.uperCardInfo.card.sign
        qrcodePoster.texts[5].text = _this.data.uperCardInfo.follower.toString()
        qrcodePoster.texts[6].text = _this.data.uperCardInfo.archive_count.toString()
        qrcodePoster.texts[7].text = _this.data.uperCardInfo.like_num.toString()
        qrcodePoster.texts[8].text = 'UID：' + _this.data.uperCardInfo.card.mid.toString()
        _this.setData({ posterConfig: qrcodePoster }, () => {
          Poster.create(true);    // 入参：true为抹掉重新生成
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
  goInfo () {
    wx.showToast({
      icon: 'info',
      title: '嘿嘿嘿',
    })
  }
})
