const stt = require('./stt');

module.exports = (io) => {
  io.on('connection',  (client) => {
    console.log('소켓 서버단 커넥트');

    client.on('join', () => {
      client.emit('messages', '소켓 서버-클라 연결 성공');
    });

    client.on('startGoogleCloudStream', () => {
      stt.startSTT(client);
    });

    client.on('endGoogleCloudStream', (isFinal) => {
      stt.endGoogleCloudStream();
      stt.stopRecoding();
      if (isFinal) {
        stt.timeStampsResult(client);
      }
    });

    client.on('detectFirstSentence', () => { 
      // 다음 문제로 넘어가서 첫 문장을 말한 시간을 감지하고 타임스탬프를 만듦
      stt.detectFirstSentence();
    });
  });
};
