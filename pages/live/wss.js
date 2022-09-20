const app = getApp()
var socket = null; //全局定义socket对象
var timer = null
import { BrotliDecode } from './decode' // 引入谷歌brotli压缩解码
Page({
  /**
   * 页面的初始数据
   */
  data: {
    roomId: 22387371, // 直播间房间号
    danmus: [],
    windowHeight: 0
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 获取窗口高度
    const windowHeight = app.globalData.windowHeight
    this.setData({ windowHeight: windowHeight })
    // websocket连接
    this.connect(this.data.roomId)
  },
  //创建websocket
  connect(roomId) {
    socket = wx.connectSocket({
      url: 'wss://broadcastlv.chat.bilibili.com/sub',
      success: res => {
        console.info('创建连接成功', res);
      }
    });
    //事件监听
    var _this = this
    socket.onOpen(function () {
      var certification = {
        "uid": 0,
        "roomid": roomId,
        "protover": 3,
        "platform": "web",
        "type": 2,
        "key": ""    //值为空字符串好像也没问题
      }
      const sendData = getCertification(JSON.stringify(certification))
      send(sendData) // 发送
      console.log(JSON.stringify(certification))
      //发送心跳包
      timer = setInterval(function () {
        let buff = new ArrayBuffer(16);
        let i = new DataView(buff);
        i.setUint32(0, 0);    //整个封包
        i.setUint16(4, 16);    //头部
        i.setUint16(6, 1);    //协议版本
        i.setUint32(8, 2);    //操作码,2为心跳包
        i.setUint32(12, 1);    //填1
        send(buff);
      }, 30000); //30秒

      //生成认证数据
      function getCertification(json) {
        let encoder = new TextEncoder();    //编码器
        let jsonView = encoder.encode(json);    //utf-8编码
        let buff = new ArrayBuffer(jsonView.byteLength + 16);    //数据包总长度：16位头部长度+bytes长度
        let view = new DataView(buff);    //新建操作视窗
        view.setUint32(0, jsonView.byteLength + 16);    //整个数据包长度
        view.setUint16(4, 16);    //头部长度
        view.setUint16(6, 1);    //协议版本
        view.setUint32(8, 7);    //类型,7为加入房间认证
        view.setUint32(12, 1);    //填1
        for (let r = 0; r < jsonView.byteLength; r++) {
          view.setUint8(16 + r, jsonView[r]);    //填入数据
        }
        return buff;
      }
      // 发送
      function send(data) {
        socket.send({
          data: data,
          success: res => {
            console.info('客户端发送', res);
          }
        });
      }
    });
    // 连接关闭时
    socket.onClose(function () {
      //当客户端收到服务端发送的关闭连接请求时，触发onclose事件
      console.log("close");
      if (timer != null) {
        clearInterval(timer);    //停止发送心跳包
      }
      wx.redirectTo({ url: './wss' })
    });
    // 链接错误时
    socket.onError(function () {
      console.info('连接报错');
    });
    // 监听 WebSocket 接受到服务器的消息事件
    socket.onMessage(function (e) {
      var data = e.data;
      // console.info('接收到的数据', data);
      handleMessage(data, function (result, _this) {
        //触发事件
        for (let i = 0; i < result.length; i++) {
          let json = JSON.parse(result[i]);
          let danmu = {}
          if (json.Type == 5) danmu = cmdEventHandle(JSON.parse(json.body).cmd, JSON.parse(json.body))
          if (json.Type == 8) danmu = cmdEventHandle('Certify_Success', JSON.parse(json.body))
          if (json.Type == 3) danmu = cmdEventHandle('VIEW', JSON.parse(json.body))
          if (!(danmu && danmu.all && danmu.all != '')) continue
          let danmus = _this.data.danmus
          danmus = danmus.concat(danmu)
          if (danmus.length > 100) danmus = danmus.slice(-100)
          _this.setData({ danmus: danmus })
        }
      }, _this);

      // 事件类型处理
      function cmdEventHandle(cmd, e) {
        let msgText = ''
        let actionText = ''
        let giftText = ''
        let rowText = ''
        // 认证成功
        if (cmd == 'Certify_Success') {
          if (e.code == 0) {
            console.log("Certify_Success");
          }
        }
        // 人气值更新
        if (cmd == 'VIEW') {
          const viewNum = e.toString()
          rowText = '人气值：' + viewNum
          console.log(rowText);
        }
        // 进入直播间或关注直播间事件
        if (cmd == 'INTERACT_WORD') {
          let uname = e.data.uname;
          let timedata = new Date(e.data.timestamp * 1000);
          // let time = timedata.toLocaleDateString() + " " + timedata.toTimeString().split(" ")[0];
          let time = timedata.toTimeString().split(" ")[0];
          if (e.data.msg_type == 2) { //个人推测，不一定准确
            actionText = time + " " + uname + " 关注直播间"
            console.log(actionText);
          } else {
            actionText = time + " " + uname + " 进入直播间"
            console.log(actionText);
          }
          rowText = actionText
        }
        // 弹幕事件
        if (cmd == 'DANMU_MSG') {
          console.log('弹幕信息->', e)
          let uname = e.info[2][1];
          let timedata = new Date(e.info[9].ts * 1000);
          // let time = timedata.toLocaleDateString() + " " + timedata.toTimeString().split(" ")[0];
          let time = timedata.toTimeString().split(" ")[0];
          let text = e.info[1];
          msgText = time + " " + uname + "：" + text
          rowText = msgText
          console.log(msgText);
        }
        //礼物赠送事件
        if (cmd == 'SEND_GIFT') {
          let uname = e.data.uname;
          let gift_num = e.data.num;
          let act = e.data.action;
          let gift_name = e.data.giftName;
          let timedata = new Date(e.data.timestamp * 1000);
          // let time = timedata.toLocaleDateString() + " " + timedata.toTimeString().split(" ")[0];
          let time = timedata.toTimeString().split(" ")[0];
          giftText = time + " " + uname + "：" + act + " " + gift_num + " " + gift_name
          rowText = giftText
          console.log(giftText);
        }
        return {
          msg: msgText,
          action: actionText,
          gift: giftText,
          all: rowText
        }
      }
      // 消息处理
      function handleMessage(blob, call, _this) {
        let buff = blob;    //ArrayBuffer对象
        let decoder = new TextDecoder();    //解码器
        let view = new DataView(buff);    //视图
        let offset = 0;
        let packet = {};
        let result = [];
        while (offset < buff.byteLength) {    //数据提取
          let packetLen = view.getUint32(offset + 0);
          let headLen = view.getUint16(offset + 4);
          let packetVer = view.getUint16(offset + 6);
          let packetType = view.getUint32(offset + 8);
          let num = view.getUint32(12);
          if (packetVer == 3) {    //解压数据
            let brArray = new Uint8Array(buff, offset + headLen, packetLen - headLen);
            let buffFromBr = BrotliDecode(brArray);    //返回Int8Array视图
            let view = new DataView(buffFromBr.buffer);
            let offset_Ver3 = 0;
            while (offset_Ver3 < buffFromBr.byteLength) {    //解压后数据提取
              let packetLen = view.getUint32(offset_Ver3 + 0);
              let headLen = view.getUint16(offset_Ver3 + 4);
              let packetVer = view.getUint16(offset_Ver3 + 6);
              let packetType = view.getUint32(offset_Ver3 + 8);
              let num = view.getUint32(12);
              packet.Len = packetLen;
              packet.HeadLen = headLen;
              packet.Ver = packetVer;
              packet.Type = packetType;
              packet.Num = num;
              let dataArray = new Uint8Array(buffFromBr.buffer, offset_Ver3 + headLen, packetLen - headLen);
              packet.body = decoder.decode(dataArray);    //utf-8格式数据解码，获得字符串
              result.push(JSON.stringify(packet));    //数据打包后传入数组
              offset_Ver3 += packetLen;
            }
          } else {
            packet.Len = packetLen;
            packet.HeadLen = headLen;
            packet.Ver = packetVer;
            packet.Type = packetType;
            packet.Num = num;
            let dataArray = new Uint8Array(buff, offset + headLen, packetLen - headLen);
            if (packetType == 3) {    //获取人气值
              packet.body = (new DataView(buff, offset + headLen, packetLen - headLen)).getUint32(0);    //若入参为dataArray.buffer，会返回整段buff的视图，而不是截取后的视图
            } else {
              packet.body = decoder.decode(dataArray);    //utf-8格式数据解码，获得字符串
            }
            result.push(JSON.stringify(packet));    //数据打包后传入数组
          }
          offset += packetLen;
        }
        call(result, _this);    //数据后续处理
      }
    });
  }
})