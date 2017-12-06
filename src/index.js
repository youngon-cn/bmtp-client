const fs = require('fs');
const net = require('net');
const crypto = require('crypto');
const EventEmitter = require('events');
const Structure = require('./structure');
const MediaInfoParser = require('./parser');

class BMTP {
  constructor({ pid, sid = 1 }, socketOptions) {
    if (!pid) throw new Error('pid is required!');
    this.socketOptions = {
      host: '202.113.80.83',
      port: 1680,
    };
    this.config = {
      pid,
      sid,
      cid: '',
      usn: '',
      time: '',
      videoname: '',    // 从服务器返回包中获取的视频名称
      fileext: '',      // 从服务器返回包中获取的文件拓展名
      filelen: 0,      // 文件总长度
      filepos: 0,      // 当前文件下载位置
    };
    this.cSocket = new net.Socket();    // 控制流
    this.dSocket = new net.Socket();    // 数据流
    Object.assign(this.socketOptions, socketOptions);
  }

  download() {
    const emitter = new EventEmitter();
    const { config } = this;
    this.dSocket.connect(this.socketOptions, () => {
      const req = Structure.dataTranferReq(config);
      this.dSocket.write(req);
    });
    this.dSocket.on('data', (data) => {
      if (config.filepos !== 0) {
        emitter.emit('data', data);
      }
      config.filepos += data.length;
      if (config.filepos > config.filelen) {
        this.cSocket.destroy();
        this.dSocket.destroy();
        emitter.emit('close');
      }
    });
    this.dSocket.on('error', (err) => {
      emitter.emit('error', err);
    });
    return emitter;
  }

  saveToFile(filepath) {
    if (!filepath) throw new Error('filepath is required!');
    return new Promise(async (resolve, reject) => {
      const fws = fs.createWriteStream(filepath);
      const downloader = this.download();
      downloader.on('data', (data) => {
        fws.write(data);
      });
      downloader.on('close', () => {
        fws.end();
        resolve();
      });
      downloader.on('error', (err) => {
        reject(err);
      });
    });
  }

  getMediaInfo() {
    return new Promise((resolve, reject) => {
      this.cSocket.connect(this.socketOptions, () => {
        const req = Structure.commReqInfo(this.config);
        this.cSocket.write(req);
      });
      this.cSocket.on('data', (data) => {
        const parsedInfo = new MediaInfoParser(data);
        Object.assign(this.config, parsedInfo);
        resolve(parsedInfo);
      });
      this.cSocket.on('error', (err) => {
        reject(err);
      });
    })
  }
}

module.exports = BMTP;