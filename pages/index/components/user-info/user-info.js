// components/user-info.js
Component({
  options: {
    styleIsolation: 'apply-shared'
  },
  /**
   * 组件的属性列表
   */
  properties: {
    uperInfo: {
      type: Object,
      value: {},
    },
    uperCardInfo: {
      type: Object,
      value: {},
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    defaultBg: 'https://i0.hdslb.com/bfs/space/bd4068984046ee454902da0c13b331dbe626ee82.jpg@2560w_400h_100q_1o.webp'
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
