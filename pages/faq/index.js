// pages/faq/index.js
Page({
  data: {
    InputBottom: 0,
    elyAvatar: 'https://i0.hdslb.com/bfs/face/e447c879cf8119c486af3bec69ae21239ccd79c1.jpg@240w_240h_1c_1s.webp',
    myAvatar: 'https://i1.hdslb.com/bfs/face/1d2bf16d6d005d3a4cb0092799ac687d918108a9.jpg@240w_240h_1c_1s.webp',
    aboutName: 'https://upload-images.jianshu.io/upload_images/4697920-2d7dcddcac9d5c4c.png',
    bilogUrl: 'https://github.com/Airmole/bilog',
    elyWeapp: 'https://github.com/Airmole/ely-weapp',
    elyWeb: 'https://yili.airmole.cn'
  },
  preview(e) {
    const image = e.currentTarget.dataset.image
    wx.previewImage({ urls: image })
  },
  copy(e) {
    const content = e.currentTarget.dataset.content
    wx.setClipboardData({
      data: content,
      success: () => {
        wx.hideToast()
        wx.showToast({
          icon: 'none',
          title: '已复制，请打开浏览器粘贴访问',
        })
      }
    })
  },
  InputFocus(e) {
    this.setData({
      InputBottom: e.detail.height
    })
  },
  InputBlur(e) {
    this.setData({
      InputBottom: 0
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      path: `pages/faq/index`,
      title: `伊伊齁甜小程序常见问题(FAQ)`,
    }
  }
})