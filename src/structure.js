class Structure {
  static mgc_hash({ pid, sid }) {
    return `boful+pid=${pid};sid=${sid};did=1;fil=;pfg=0;truran`;
  }

  static commReqInfo({ pid, sid }) {
    let req = '';
    req += 'GET / HTTP/1.0\n';
    req += 'Accept: */*\n';
    req += 'User-Agent: BMTPAgent\n';
    req += 'Host: VOD\n';
    req += 'UGT: NETPLAYER\n';
    req += 'WAY:1\n';
    req += 'MTD:1\n';
    req += 'FPT:1\n';
    req += 'CID:4294967295\n';
    req += 'USN:0\n';
    req += 'STL:2\n';
    req += 'DFG:0\n';
    req += 'DPT:0\n';
    req += 'AFG:basic\n';
    req += 'URN:anonymity\n';
    req += 'PWD:vod\n';
    req += 'OS:1\n';
    req += 'ULG:2052\n';
    req += 'HST:VODsocket\n';
    req += 'UIP:192.168.1.1\n';
    req += 'MAC:00-00-00-00-00-00\n';
    req += 'GW:0.0.0.0\n';
    req += `PFG:0\n`;
    req += 'FIL:\n';
    req += 'ST1:\n';
    req += 'ST2:\n';
    req += `PID:${pid}\n`;
    req += `SID:${sid}\n`;
    req += `DID:1\n`;
    req += `MGC:${Structure.mgc_hash({ pid, sid })}\n`;
    req += 'SPL:0\n';
    req += 'SPH:0\n\n';
    return req;
  }

  static commReqSeek({ pos = 0 }) {
    let req = '';
    req += 'GET / HTTP/1.0\n';
    req += 'Accept: */*\n';
    req += 'User-Agent: BMTPAgent\n';
    req += 'Host: VOD\n';
    req += 'UGT:NETPLAYER\n';
    req += 'WAY:1\n';
    req += 'MTD:3\n';
    req += `SPL:${pos & 0xffffffff}\n`;
    req += `SPH:${pos >> 32}\n\n`;
    return req;
  }

  static commReqNop() {
    let req = '';
    req += 'GET / HTTP/1.0\n';
    req += 'Accept: */*\n';
    req += 'User-Agent: BMTPAgent\n';
    req += 'Host: VOD\n';
    req += 'UGT:NETPLAYER\n';
    req += 'WAY:1\n';
    req += 'MTD:2\n\n';
    return req;
  }

  static dataTranferReq({ cid, usn, time }) {
    let req = '';
    req += 'GET / HTTP/1.0\n';
    req += 'Accept: */*\n';
    req += 'User-Agent: BMTPAgent\n';
    req += 'Host: VOD\n';
    req += 'UGT:NETPLAYER\n';
    req += 'WAY:2\n';
    req += 'FPT:1\n';
    req += `CID:${cid}\n`;
    req += `USN:${usn}\n`;
    req += `STT:${time}\n\n`;
    return req;
  }
}

module.exports = Structure;