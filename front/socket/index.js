import socketIoClient from 'socket.io-client';
import { backUrl } from '../config';

const socket = socketIoClient(backUrl, {
  transports: ['websocket'],
});

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
  socket.on('getTimeStamps', (data) => {
    console.log(data, 'getTimeStamps');
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
