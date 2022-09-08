// pages/guard/index.js
const app = getApp()
const util = require('../../utils/util.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isLoading: true,
    uperName: '',
    roomid: '',
    uid: '',
    bgHeader: 'https://dev-cdn.cardcat.cn/images/f28b64c9811b4496656c374772a47a26.jpeg',
    bgFooter: 'https://gd-filems.dancf.com/mcm79j/mcm79j/51560/7205d009-dc18-4c7f-8573-58500fa4df3e1785978.jpg',
    fillImage: 'https://gd-filems.dancf.com/mcm79j/mcm79j/51560/9121e0b2-6f93-4300-ae22-07aa750658b91762508.jpg',
    top3icon: [
      'https://gd-filems.dancf.com/mcm79j/mcm79j/51560/0b3e0fbf-4b1f-4fc3-9f23-0ab0f8ca1c581825958.png',
      'https://gd-filems.dancf.com/mcm79j/mcm79j/51560/fb9fb171-ab5c-4ef1-bdf1-353e9731350c1828424.png',
      'https://gd-filems.dancf.com/mcm79j/mcm79j/51560/e5746913-9689-47a6-a1d7-a946d55081ec1855413.png'
    ],
    guardLevelIcons: [
      '',
      'https://i0.hdslb.com/bfs/live/1d16bf0fcc3b1b768d1179d60f1fdbabe6ab4489.png',
      'https://i0.hdslb.com/bfs/live/98a201c14a64e860a758f089144dcf3f42e7038c.png',
      'https://i0.hdslb.com/bfs/live/143f5ec3003b4080d1b5f817a9efdca46d631945.png'
    ],
    guards: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options)
    const uperName = options.nickname ?? ''
    const roomid = options.roomid ?? ''
    const uid = options.uid ?? ''
    if (!roomid || !uid) {
      wx.redirectTo({ url: '../index/index' })
      return
    }
    this.setData({ uperName: uperName, roomid: roomid, uid: uid })
    this.getLiveroomTopGuard(roomid, uid)
  },
  /**
  * 生命周期函数--监听页面初次渲染完成
  */
  onReady: function () {
    var that = this
    setTimeout(function () {
      that.setData({ isLoading: false });
    }, 1000);
  },
  getLiveroomTopGuard(roomid, ruid, page = 1, pagesize = 29) {
    var _this = this
    wx.request({
      url: `${app.globalData.liveApiDomain}/xlive/app-room/v2/guardTab/topList?page=${page}&page_size=${pagesize}&ruid=${ruid}&roomid=${roomid}`,
      success(res) {
        let guards = res.data.data
        // 第一页，针对top3处理
        if (guards.info.now == 1) {
          guards.top3.forEach((element, index) => {
            guards.top3[index].medal_info = _this.formatMedalColor(element.medal_info)
          })
          guards.data = guards.top3.concat(guards.list)
        }
        guards.list.forEach((element, index) => {
          guards.list[index].medal_info = _this.formatMedalColor(element.medal_info)
        })
        if (guards.info.now > 1) guards.data = _this.data.guards.data.concat(guards.list)
        _this.setData({ guards: guards })
      }
    })
  },
  formatMedalColor(medal_info) {
    medal_info.start_color = util.formatNumberColor(medal_info.medal_color_start)
    medal_info.end_color = util.formatNumberColor(medal_info.medal_color_end)
    medal_info.border_color = util.formatNumberColor(medal_info.medal_color_border)
    return medal_info
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    const currentPage = this.data.guards.info.now
    const totalPage = this.data.guards.info.page
    const nextPage = parseInt(currentPage) + 1
    if (currentPage < totalPage) {
      this.getLiveroomTopGuard(this.data.roomid, this.data.uid, nextPage)
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    const nickname = this.data.uperName
    const roomid = this.data.roomid
    const uid = this.data.uid
    return {
      path: `pages/guard/index?nickname=${nickname}&roomid=${roomid}&uid=${uid}`,
      title: `${nickname}的大航海们`,
    }
  }
})