const app = getApp();
Component({
  /**
   * 组件的一些选项
   */
  options: {
    addGlobalClass: true,
    multipleSlots: true
  },
  /**
   * 组件的对外属性
   */
  properties: {
    date: {
      type: String,
      value: '',
    },
  },

  lifetimes: {
    attached: function () {
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    Custom: app.globalData.Custom,
    dateString: ''
  },
  /**
   * 组件的方法列表
   */
  methods: {
    toHome () {
      wx.navigateBack({
        fail () {
          wx.redirectTo({ url: '/pages/index/index' })
        }
      })
    },
    download () {
      this.triggerEvent('download')
    }
  }
})