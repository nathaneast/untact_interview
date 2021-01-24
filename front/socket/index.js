import socketIoClient from 'socket.io-client';

const socket = socketIoClient.connect('http://localhost:7000');

export default (setSpeech, setSaveSpeech, saveTimeStamp) => {
  socket.on('connect', () => {
    socket.emit('join', '소켓 클라-서버 연결 성공!');
  });
  socket.on('messages', (data) => {
    console.log(data);
  });
  socket.on('speechRealTime', (data) => {
    setSpeech(data);
  });
  socket.on('speechResult', (data) => {
    console.log(data, 'speechResult');
    setSaveSpeech((prev) => prev ? `${prev} ${data}` : data);
    setSpeech('');
  });
  socket.on('timeStampsResult', (data) => {
    console.log(data, 'timeStampsResult');
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
