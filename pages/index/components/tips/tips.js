// pages/index/component/tips.js
Component({
  options: {
    styleIsolation: 'shared'
  },
  /**
   * 组件的属性列表
   */
  properties: {
    tipsText: {
      type: String,
      value: '温馨提示'
    },
    showImage: {
      type: Boolean,
      value: true
    },
    image: {
      type: String,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    defaultImg: 'https://raw.githubusercontent.com/Airmole/ShellBox/master/images/nothing.png'
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
