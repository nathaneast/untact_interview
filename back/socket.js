const stt = require('./stt');

module.exports = (io) => {
  io.on('connection', function (client) {
    console.log('소켓 서버단 커넥트');

    client.on('join', function (data) {
      console.log(data);
      client.emit('messages', '소켓 서버-클라 연결 성공');
    });

    client.on('startGoogleCloudStream', function (data) {
      console.log('startGoogleCloudStream 받음', data);
      stt.startRecoding();
      stt.startStream();
    });
  });
};
