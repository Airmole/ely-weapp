// pages/index/components/dynamic-card/dynamic-card.js
const app = getApp()
Component({
  options: {
    styleIsolation: 'apply-shared'
  },
  /**
   * 组件的属性列表
   */
  properties: {
    dynamic: {
      type: Object,
      value: {},
    },
  },
  lifetimes: {
    attached: function () {
      this.setData({
        bilibliWeappId: app.globalData.bilibliWeappId,
        bilibliWeappVideoPath: app.globalData.bilibliWeappVideoPath
      })
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    bilibliWeappId: '',
    bilibliWeappVideoPath: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    preview(e) {
      const image = e.currentTarget.dataset.image
      wx.previewImage({ urls: image })
    },
    openInBrowser(e) {
      let url = e.currentTarget.dataset.url
      if (url.indexOf('http') == -1) url = `http:${url}`
      wx.setClipboardData({
        data: url,
        success: () => {
          wx.hideToast()
          wx.showToast({
            icon: 'none',
            title: '受限于小程序主体，请打开浏览器粘贴访问',
          })
        }
      })
    }
  }
})
