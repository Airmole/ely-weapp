// index.js
// 获取应用实例
const app = getApp()
const util = require('../../utils/util.js')

Page({
  data: {
    pageCur: 'index',
    tabCur: 'home',
    tabs: [
      { label: '主页', value: 'home', icon: 'homefill' },
      { label: '动态', value: 'dynamic', icon: 'favorfill' },
      { label: '投稿', value: 'video', icon: 'videofill' }
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
          // _this.getLiveroomInitData(res.data.data.live_room.roomid)
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
  getUperVideoList(uid, page = 1, pagesize = 25, orderby = 'pubdate') {
    var _this = this
    wx.request({
      url: `${app.globalData.apiDomain}/x/space/arc/search?pn=${page}&ps=${pagesize}&order=${orderby}&jsonp=jsonp&mid=${uid}`,
      success(res) {
        _this.setData({ videos: res.data.data })
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
  onReachBottom () {
    const tabCur = this.data.tabCur
    const uid = app.globalData.uid
    console.log(tabCur, '滚了滚了')
    if (tabCur == 'dynamic') {
      this.getSpaceDynamicList(uid, this.data.dynamic.offset)
    }
  }
})