
const posterConfig = {
  qrcodeConfig: {
    width: 1200,
    height: 1200,
    backgroundColor: '#fff',
    debug: false,
    blocks: [
      {
        width: 1200,
        height: 400,
        x: 0,
        y: 830,
        backgroundColor: '#eee'
      },
    ],
    texts: [
      // up昵称
      {
        x: 600,
        y: 440,
        baseLine: 'middle',
        textAlign: 'center',
        text: '',
        fontSize: 64,
        color: '#000',
      },
      // up签名
      {
        x: 600,
        y: 520,
        baseLine: 'middle',
        textAlign: 'center',
        text: '',
        fontSize: 48,
        color: '#333',
      },
      {
        x: 600,
        y: 750,
        baseLine: 'middle',
        textAlign: 'center',
        text: '关注',
        fontSize: 48,
        color: '#888',
      }, {
        x: 300,
        y: 750,
        baseLine: 'middle',
        textAlign: 'center',
        text: '投稿',
        fontSize: 48,
        color: '#888',
      }, {
        x: 900,
        y: 750,
        baseLine: 'middle',
        textAlign: 'center',
        text: '获赞',
        fontSize: 48,
        color: '#888',
      },
      {
        x: 600,
        y: 650,
        baseLine: 'middle',
        textAlign: 'center',
        text: '',
        fontSize: 72,
        color: '#000',
      }, {
        x: 300,
        y: 650,
        baseLine: 'middle',
        textAlign: 'center',
        text: '',
        fontSize: 72,
        color: '#000',
      }, {
        x: 900,
        y: 650,
        baseLine: 'middle',
        textAlign: 'center',
        text: '',
        fontSize: 72,
        color: '#000',
      }, {
        x: 400,
        y: 930,
        baseLine: 'middle',
        textAlign: 'left',
        text: '',
        fontSize: 52,
        color: '#000',
        zIndex: 999
      },{
        x: 400,
        y: 1040,
        baseLine: 'middle',
        textAlign: 'left',
        text: '长按保存图片',
        fontSize: 52,
        color: '#000',
        zIndex: 999
      },{
        x: 400,
        y: 1150,
        baseLine: 'middle',
        textAlign: 'left',
        text: '扫描识别二维码查看UP主',
        fontSize: 52,
        color: '#000',
        zIndex: 999
      },
    ],
    images: [
      // 头像
      {
        width: 300,
        height: 300,
        x: 450,
        y: 80,
        borderRadius: 300,
        borderWidth: 1,
        borderColor: '#eee',
        url: '',
      },
      // 二维码
      {
        width: 300,
        height: 300,
        x: 30,
        y: 880,
        url: '',
      }
    ]
  }
}

module.exports = {
  posterConfig
}
