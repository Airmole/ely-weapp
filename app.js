// app.js
App({
  onLaunch() {
    this.initalColorBar()
  },
  globalData: {
    apiDomain: 'https://lib.airmole.cn/bilibili',
    liveApiDomain: 'https://lib.airmole.cn/bililive',
    uid: '373782549',
  },
  initalColorBar() {
    wx.getSystemInfo({
      success: e => {
        this.globalData.StatusBar = e.statusBarHeight;
        let custom = wx.getMenuButtonBoundingClientRect();
        this.globalData.Custom = custom;  
        this.globalData.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
      }
    })
  }
})
