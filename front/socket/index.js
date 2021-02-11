import socketIoClient from 'socket.io-client';
import { backUrl } from '../config';

const socket = socketIoClient(backUrl, {
  transports: ['websocket'],
});

export default (setSpeechRealtime, setAllSpeech, saveTimeStamps) => {
  socket.on('connect', () => {
    socket.emit('join', '소켓 클라-서버 연결 성공!');
  });
  socket.on('messages', (data) => {
    console.log(data);
  });
  socket.on('speechRealTime', (data) => {
    setSpeechRealtime(data);
  });
  socket.on('speechResult', (data) => {
    setAllSpeech((prev) => prev ? `${prev} ${data}` : data);
    setSpeechRealtime('');
  });
  socket.on('timeStampsResult', (data) => {
    saveTimeStamps(data);
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
