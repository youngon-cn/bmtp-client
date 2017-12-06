const iconv = require('iconv-lite');

class MediaInfoParser {

  constructor(info) {
    this.cid = '';
    this.usn = '';
    this.filelen = '';
    this.time = '';
    this.videoname = '';
    this.fileext = '';

    let i = 15;
    while (i > 11) {
      this.cid <<= 8;
      this.cid += info[i];
      i--;
    }
    i = 19;
    while (i > 15) {
      this.usn <<= 8;
      this.usn += info[i];
      i--;
    }
    i = 31;
    while (i > 23) {
      this.filelen <<= 8;
      this.filelen += info[i];
      i--;
    }
    this.time = iconv.decode(info.slice(52, 72), 'gb2312').replace(/\u0000/g, '');
    this.videoname = iconv.decode(info.slice(80, 160), 'gb2312').replace(/\u0000/g, '');
    this.fileext = iconv.decode(info.slice(160, 168), 'gb2312').replace(/\u0000/g, '');
  }
}

module.exports = MediaInfoParser;