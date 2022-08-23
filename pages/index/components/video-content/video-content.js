// pages/index/components/video-content/video-content.js
Component({
  options: {
    styleIsolation: 'apply-shared'
  },
  /**
   * 组件的属性列表
   */
  properties: {
    videos: {
      type: Object,
      value: {},
    },
    videoTid: {
      type: [String, Number],
      value: '0',
    },
    videoOrderby: {
      type: String,
      value: 'pubdate',
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    modalName: null,
    videoListStyle: 'card',
    videoOrderbyOptions: [
      { label: '最新发布', value: 'pubdate' },
      { label: '最多播放', value: 'click' },
      { label: '最多收藏', value: 'stow' }
    ],
    videoListStyleOptions: [
      { label: '卡片', value: 'card' },
      { label: '列表', value: 'list' }
    ]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    tidChanged (e) {
      const tid = e.currentTarget.dataset.tid
      this.triggerEvent('tidChanged', tid)
    },
    styleChange (e) {
      const value = e.detail.value
      this.setData({ videoListStyle: value })
    },
    orderbyChange (e) {
      const orderby = e.detail.value
      this.triggerEvent('orderbyChanged', orderby)
    },
    showModal (e) {
      this.setData({ modalName: e.currentTarget.dataset.target })
    },
    hideModal(e) {
      this.setData({
        modalName: null
      })
    },
    catchtap () {}
  }
})
