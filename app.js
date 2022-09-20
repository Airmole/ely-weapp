// app.js
App({
  onLaunch() {
    this.initalColorBar()
  },
  globalData: {
    apiDomain: 'https://lib.airmole.cn/bilibili',
    yiliApiDomain: 'https://yili.airmole.cn',
    liveApiDomain: 'https://lib.airmole.cn/bililive',
    vcApiDomain: 'https://api.vc.bilibili.com',
    liveWssDomain: 'wss://broadcastlv.chat.bilibili.com',
    uid: '373782549',
    bilibliWeappId: 'wx7564fd5313d24844',
    bilibliWeappVideoPath: 'pages/video/video?bvid=',
  },
  initalColorBar() {
    wx.getSystemInfo({
      success: e => {
        this.globalData.StatusBar = e.statusBarHeight;
        let custom = wx.getMenuButtonBoundingClientRect();
        this.globalData.Custom = custom;  
        this.globalData.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
        this.globalData.windowHeight = e.windowHeight
      }
    })
  }
})
