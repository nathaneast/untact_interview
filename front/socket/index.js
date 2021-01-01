import socketIoClient from 'socket.io-client';

const socket = socketIoClient.connect('http://localhost:7000');

export default (setSpeech, setSaveSpeech, saveTimeStamp) => {
  // setState이벤트 모조리 받기
  socket.on('connect', (data) => {
    console.log('소켓 프론트단 커넥트');
    socket.emit('join', '소켓 클라-서버 연결 성공!');
  });
  socket.on('messages', (data) => {
    console.log(data);
  });
  socket.on('speechRealTime', (data) => {
    console.log(data, 'speechRealTime');
    setSpeech(data);
  });
  socket.on('speechResult', (data) => {
    console.log(data, 'speechResult');
    setSaveSpeech((prev) => prev ? `${prev} ${data}` : data);
    setSpeech('');
  });
  socket.on('responseTimeStamps', (data) => {
    console.log(data, 'responseTimeStamps 클라이언트');
    saveTimeStamp(data);
  });
};

export const socketEmits = {
  startGoogleCloudStream() {
    socket.emit('startGoogleCloudStream', '');
  },
  detectFirstSentence() {
    socket.emit('detectFirstSentence', '');
  },
  endGoogleCloudStream(data) {
    socket.emit('endGoogleCloudStream', data ? data : '');
  },
};
