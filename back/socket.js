const stt = require('./stt');

module.exports = (io) => {
  io.on('connection',  (client) => {
    console.log('소켓 서버단 커넥트');

    client.on('join', () => {
      client.emit('messages', '소켓 서버-클라 연결 성공');
    });

    client.on('startGoogleCloudStream', () => {
      console.log('startGoogleCloudStream 받음');
      stt.startSTT(client);
    });

    client.on('endGoogleCloudStream', (isFinal) => {
      console.log('endGoogleCloudStream', isFinal);
      stt.endGoogleCloudStream();
      stt.stopRecoding();
      if (isFinal) {
        client.emit('responseTimeStamps', stt.timeStamps());
      }
    });

    client.on('detectFirstSentence', () => { // 다음 문제로 넘어가는것
      console.log('다음 문제로 넘어감 !!! detectFirstSentence emit !');
      stt.detectProcess();
    });
  });
};
