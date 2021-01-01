const stt = require('./stt');

module.exports = (io) => {
  io.on('connection',  (client) => {
    console.log('소켓 서버단 커넥트');

    client.on('join', (data) => {
      console.log(data);
      client.emit('messages', '소켓 서버-클라 연결 성공');
    });

    client.on('startGoogleCloudStream', (data) => {
      console.log('startGoogleCloudStream 받음');
      // 클래스 생성
      stt.startSTT(client);
    });

    client.on('endGoogleCloudStream', (data) => {
      console.log('endGoogleCloudStream', data);
      stt.endGoogleCloudStream();
      stt.stopRecoding();
      if (data === 'final') {
        client.emit('responseTimeStamps', stt.timeStamps());
      }
    });

    client.on('detectFirstSentence', (data) => { // 다음 문제 넘어갔다는것
      console.log('detectFirstSentence emit !');
      stt.detectProcess();
    });
  });
};
