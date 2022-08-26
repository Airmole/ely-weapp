// pages/index/components/series-list/series-list.js
const app = getApp()
Component({
  options: {
    styleIsolation: 'apply-shared'
  },
  /**
   * 组件的属性列表
   */
  properties: {
    series: {
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

  }
})
