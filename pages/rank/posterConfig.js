
const posterConfig = {
  rankConfig: {
    width: 1000,
    height: 1920,
    backgroundColor: '#0E1B4B',
    debug: false,
    texts: [
      // 日期
      {
        x: 500,
        y: 60,
        baseLine: 'middle',
        textAlign: 'center',
        text: '',
        fontSize: 48,
        color: '#fff',
      },
      {
        x: 500,
        y: 3300,
        baseLine: 'middle',
        textAlign: 'center',
        text: '词云图',
        fontSize: 52,
        color: '#fff',
        zIndex: 999
      },
      {
        x: 280,
        y: 4230,
        baseLine: 'middle',
        textAlign: 'left',
        text: 'https://yili.airmole.cn/#/?date=',
        fontSize: 36,
        color: '#fff'
      },
      {
        x: 280,
        y: 4300,
        baseLine: 'middle',
        textAlign: 'left',
        text: ' 生成 | Airmole.',
        fontSize: 36,
        color: '#fff'
      },
      {
        x: 280,
        y: 4360,
        baseLine: 'middle',
        textAlign: 'left',
        text: '感谢支持.Thanks♪(･ω･)ﾉ',
        fontSize: 36,
        color: '#fff'
      }
    ],
    images: [
      {
        width: 960,
        height: 1500,
        x: 30,
        y: 100,
        url: '',
      },
      {
        width: 960,
        height: 960,
        x: 30,
        y: 1600,
        url: '',
      },
      {
        width: 960,
        height: 700,
        x: 30,
        y: 2500,
        url: '',
      },
      {
        width: 960,
        height: 900,
        x: 30,
        y: 3300,
        url: '',
      },
      {
        width: 200,
        height: 200,
        x: 30,
        y: 4200,
        url: '',
      },
    ]
  }
}

module.exports = {
  posterConfig
}
