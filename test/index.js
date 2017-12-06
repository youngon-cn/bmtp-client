const ProgressBar = require('progress');
const Downloader = require('../src/index');

(async function run() {
  try {
    const down = new Downloader({ pid: 8421, sid: 1 });
    const info = await down.getMediaInfo();
    const { videoname, fileext, filelen } = info;
    const bar = new ProgressBar('下载中 [:bar] :percent', {
      complete: '=',
      incomplete: ' ',
      width: 30,
      total: filelen,
    });
    down.saveToFile(`test/${videoname}${fileext}`);
    console.log(`${videoname}${fileext}`);
    down.dSocket.on('data', (data) => {
      bar.tick(data.length);
    })
  } catch (error) {
    console.log(error);
  }
})();
