// pages/dynamic/detail.js
const app = getApp()
const util = require('../../utils/util.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    dynamicId: '',
    orderby: '3',
    oderbyOptions: [
      { label: '按热度排序', value: '3' },
      { label: '按时间排序', value: '2' }
    ],
    dynamic: {},
    comments: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const dynamicId = options.dynamic_id ?? ''
    if (!dynamicId) {
      wx.redirectTo({ url: '../index/index' })
      return
    }
    this.setData({ dynamicId: dynamicId })
    this.getDynamicDetail(dynamicId)
  },
  getDynamicDetail(dynamicId) {
    var _this = this
    wx.request({
      url: `${app.globalData.vcApiDomain}/dynamic_svr/v1/dynamic_svr/get_dynamic_detail?dynamic_id=${dynamicId}`,
      success(res) {
        res.data.data.card.card = JSON.parse(res.data.data.card.card)
        res.data.data.card.card.item.upload_time_str = util.formatTimestampToDate(res.data.data.card.card.item.upload_time ? res.data.data.card.card.item.upload_time : res.data.data.card.card.item.timestamp)
        _this.setData({ dynamic: res.data.data.card })
        const oid = res.data.data.card.desc.type == 4 ? _this.data.dynamicId : res.data.data.card.desc.rid
        _this.getDynamicComment(_this.getCommentTypeNum(res.data.data.card.desc.type), oid)
      }
    })
  },
  getDynamicComment(type, oid, mode = 3, next = 0, pagesize = 20) {
    var _this = this
    wx.request({
      url: `${app.globalData.apiDomain}/x/v2/reply/main?type=${type}&oid=${oid}&mode=${mode}&next=${next}&ps=${pagesize}`,
      success(res) {
        if (res.data.code == -404) return
        if (res.data.data.cursor.is_begin) {
          _this.setData({ comments: res.data.data })
        } else {
          let comments = _this.data.comments
          if (res.data.data.replies) {
            comments.replies = comments.replies.concat(res.data.data.replies)
          }
          comments.cursor = res.data.data.cursor
          _this.setData({ comments: comments })
        }
      }
    })
  },
  orderbyChange (e) {
    const orderby = e.currentTarget.dataset.value
    this.setData({ orderby: orderby })
    const oid = this.data.dynamic.desc.type == 4 ? this.data.dynamicId : this.data.dynamic.desc.rid
    this.getDynamicComment(this.getCommentTypeNum(this.data.dynamic.desc.type), oid, orderby)
  },
  getCommentTypeNum(type) {
    switch (type) {
      case 2:
        return 11
        case 4:
          return 17
      default:
        return 11
    }
  },
  
  preview(e) {
    const image = e.currentTarget.dataset.image
    wx.previewImage({ urls: image })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    if (this.data.comments.cursor.is_end) return
    const oid = this.data.dynamic.desc.type == 4 ? this.data.dynamicId : this.data.dynamic.desc.rid
    this.getDynamicComment(this.getCommentTypeNum(this.data.dynamic.desc.type), oid, this.data.orderby, this.data.comments.cursor.next)
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    const nickname = this.data.dynamic.card.user.name || this.data.dynamic.card.user.uname
    const dynamicId = this.data.dynamicId
    return {
      path: `pages/dynamic/detail?dynamic_id=${dynamicId}`,
      title: `${nickname}的动态`,
    }
  }
})