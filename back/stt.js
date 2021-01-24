const recorder = require('node-record-lpcm16');
const { Writable } = require('stream');

const speech = require('@google-cloud/speech');
const speechClient = new speech.SpeechClient();

// Google STT request
const encoding = 'LINEAR16';
const sampleRateHertz = 16000;
const languageCode = 'ko-KR';

const request = {
  config: {
    encoding: encoding,
    sampleRateHertz: sampleRateHertz,
    languageCode: languageCode,
    profanityFilter: false,
    enableWordTimeOffsets: true,
  },
  interimResults: true,
};

let sttInstance;

class SttProcess {
  constructor() {
    this.timeStamps = [];
    this.currentQuestionIndex = 0;
    this.streamingLimit = 20000;
    this.recognizeStream = null;
    this.restartCounter = 0;
    this.audioInput = [];
    this.lastAudioInput = [];
    this.resultEndTime = 0; // 문장마다 끝나는 시간
    this.finalRequestEndTime = 0;
    this.newStream = true;
    this.bridgingOffset = 0;
    this.previousSentenceLength = null;
    this.recording;
    this.reStartTimerId = null;
    this.isFinalEndTime = 0;
    this.isDetectFirstSentence = true;
    this.isSentenceFinal = false;
    this.isDivideSentence = false;
  }
}

class MyAnswer {
  constructor(time = 0, text = '') {
    this.time = time;
    this.text = text;
  }
}

const markingTimeStamp = (time) => {
  const timeResult = Math.floor(time / 1000) > 0 ? Math.floor(time / 1000) : 1;
  const question = new MyAnswer(timeResult);
  sttInstance.timeStamps[sttInstance.currentQuestionIndex] = question;
}

const reStartStream = (client) => {
  console.log('reStartStream');
  
  if (sttInstance.recognizeStream) {
    sttInstance.recognizeStream.end();
    sttInstance.recognizeStream.removeListener('data', speechCallback);
    sttInstance.recognizeStream = null;
  }

  if (sttInstance.resultEndTime > 0) {
    sttInstance.finalRequestEndTime = sttInstance.isFinalEndTime;
  }
  sttInstance.resultEndTime = 0; // 문장마다 끝나는 시간 초기화

  sttInstance.lastAudioInput = [];
  sttInstance.lastAudioInput = sttInstance.audioInput;

  sttInstance.restartCounter++;

  console.log('레코딩 재시작', `${sttInstance.streamingLimit * sttInstance.restartCounter}`);

  sttInstance.newStream = true;

  startStream(client);
}

const speechCallback = (stream, client) => {
  sttInstance.resultEndTime =
    stream.results[0].resultEndTime.seconds * 1000 +
    Math.round(stream.results[0].resultEndTime.nanos / 1000000);
  
  const currentRecTime = 
    sttInstance.resultEndTime -
    sttInstance.bridgingOffset +
    sttInstance.streamingLimit * sttInstance.restartCounter;

    console.log(sttInstance.resultEndTime, 'sttInstance.resultEndTime');
    console.log(currentRecTime, 'currentRecTime');

  sttInstance.isSentenceFinal = stream.results[0].isFinal;

  const transcript = stream.results[0].alternatives[0].transcript;

  // 문제의 첫 문장을 감지하여 타임스탬프 폼을 만듦
  if (sttInstance.isDetectFirstSentence) {
    console.log('speechCallback 문제의 첫 문장 감지! 현재문제 타임스탬프폼 만듬');
    markingTimeStamp(currentRecTime);
    sttInstance.isDetectFirstSentence = false;
  }

  // stt 문장 완성이 안되었는데 다음 문제로 넘어갈시 이전 문제의 length 저장
  if (sttInstance.isDivideSentence) {
    sttInstance.previousSentenceLength = transcript.length;
    sttInstance.isDivideSentence = false;
  }

  if (stream.results[0] && stream.results[0].alternatives[0]) {
    console.log('transcript', `${currentRecTime} ${transcript}`);
    client.emit('speechRealTime', transcript);
  }

  if (stream.results[0].isFinal) {
    console.log('문장 완성', `${currentRecTime} ${transcript}`);
    client.emit('speechResult', transcript);

    if (sttInstance.previousSentenceLength) {
      const previousSentence = transcript.substring(
        0,
        sttInstance.previousSentenceLength
      );
      const currentSentence = transcript.substring(
        sttInstance.previousSentenceLength,
        transcript.length
      );
      let previousTimeStamp =
      sttInstance.timeStamps[sttInstance.currentQuestionIndex - 1];
      let currentTimeStamp =
      sttInstance.timeStamps[sttInstance.currentQuestionIndex];

      sttInstance.timeStamps[sttInstance.currentQuestionIndex - 1].text = previousTimeStamp.text
        ? previousTimeStamp.text + previousSentence
        : previousSentence;

      if (currentSentence) {
        console.log(
          currentSentence,
          'currentSentence 있어서 현재 문제 타임스탬프에 넣기'
        );
        sttInstance.timeStamps[sttInstance.currentQuestionIndex].text = currentSentence;
      } else {
        console.log('현재 문장이 빈값이라 현재문제 타임스탬프 지움');
        sttInstance.timeStamps.pop();
        sttInstance.isDetectFirstSentence = true;
      }

      console.log('문장완성--------------------------------------------------');
      console.log(
        '이전문장:',
        transcript.substring(0, sttInstance.previousSentenceLength)
      );
      console.log(
        '다음문장:',
        transcript.substring(
          sttInstance.previousSentenceLength,
          transcript.length
        )
      );

      sttInstance.previousSentenceLength = null;
    } else {
      let currentTimeStamp = sttInstance.timeStamps[sttInstance.currentQuestionIndex];
      sttInstance.timeStamps[sttInstance.currentQuestionIndex].text = currentTimeStamp.text 
        ? currentTimeStamp.text + transcript
        : transcript;
      console.log(transcript, '현재 타임스탬프에 추가된 문장');
    }
    
    console.log('-------------------------------------------------------');
    console.log(sttInstance.timeStamps, '문장 finish 후 타임 스탬프');

    sttInstance.isFinalEndTime = sttInstance.resultEndTime; // 문장 완료 후 끝나는 시간 저장

  }
};

const startStream = (client) => {
  console.log('startStream');
  sttInstance.audioInput = [];
  sttInstance.recognizeStream = speechClient
    .streamingRecognize(request)
    .on('error', (err) => {
      if (err.code === 11) {
        // reStartStream();
      } else {
        console.error('API request error ' + err);
      }
    })
    .on('data', (stream) => speechCallback(stream, client));

  // 3분뒤 스트림 재시작
  sttInstance.reStartTimerId = setTimeout(() => reStartStream(client), sttInstance.streamingLimit);
}

const audioProcess = () => new Writable({
  write(chunk, encoding, next) {
    if (sttInstance.newStream && sttInstance.lastAudioInput.length !== 0) {
      const chunkTime = sttInstance.streamingLimit / sttInstance.lastAudioInput.length;
      if (chunkTime !== 0) {
        if (sttInstance.bridgingOffset < 0) {
          sttInstance.bridgingOffset = 0;
        }
        if (sttInstance.bridgingOffset > sttInstance.finalRequestEndTime) {
          sttInstance.bridgingOffset = sttInstance.finalRequestEndTime;
        }
        const chunksFromMS = Math.floor(
          (sttInstance.finalRequestEndTime - sttInstance.bridgingOffset) / chunkTime
        );
        sttInstance.bridgingOffset = Math.floor(
          (sttInstance.lastAudioInput.length - chunksFromMS) * chunkTime
        );

        sttInstance.recognizeStream.write(sttInstance.lastAudioInput[sttInstance.lastAudioInput.length - 1]);
      }
      sttInstance.newStream = false;
    }

    sttInstance.audioInput.push(chunk);

    if (sttInstance.recognizeStream) {
      sttInstance.recognizeStream.write(chunk);
    }
    next();
  },

  final() {
    console.log('audioInputStreamTransform final')
    if (sttInstance.recognizeStream) {
      sttInstance.recognizeStream.end();
    }
  },
});

const startRecoding = (audioInputStreamTransform) => {
  sttInstance.recording = recorder.record({
    sampleRateHertz: sampleRateHertz,
    threshold: 0,
    silence: 1000,
    keepSilence: true,
    recordProgram: 'rec', // Try also "arecord" or "sox"
  });

  sttInstance.recording
    .stream()
    .on('error', (err) => {
      console.error('Audio sttInstance.recording error ' + err);
    })
    .pipe(audioInputStreamTransform);
}

const checkEmptySTTResult = () => {
  if (!sttInstance.timeStamps[sttInstance.currentQuestionIndex]) {
    console.log('이전 문제 인스턴스 없으니 만들기 checkEmptySTTResult');
    sttInstance.timeStamps[sttInstance.currentQuestionIndex] = new MyAnswer();
  }
}

// 다음 문제로 넘어갈시 실행되는 함수
const detectFirstSentence = () => {
  checkEmptySTTResult();
  sttInstance.isDetectFirstSentence = true;
  if (!sttInstance.isSentenceFinal) {
    sttInstance.isDivideSentence = true;
  }
  sttInstance.currentQuestionIndex++;
  console.log('다음 문제로 넘어감');
  console.log(sttInstance.timeStamps, sttInstance.currentQuestionIndex, '다음 문제로 넘어가고나서 상태');
}

const stopRecoding = () => {
  console.log('stopRecoding');
  if (sttInstance && sttInstance.recording) {
    sttInstance.recording.stop();
  }
}

const endGoogleCloudStream = () => {
  console.log('endGoogleCloudStream 스트리밍 끝');
  if (sttInstance && sttInstance.recognizeStream) {
    sttInstance.recognizeStream.end();
    sttInstance.recognizeStream = null;
    clearTimeout(sttInstance.reStartTimerId);
    checkEmptySTTResult();
  }
}

module.exports = {
  startSTT: (client) => {
    const audioInputStreamTransform = audioProcess();
    sttInstance = new SttProcess();
    startRecoding(audioInputStreamTransform);
    startStream(client);
  },
  stopRecoding: () => stopRecoding(),
  endGoogleCloudStream: () => endGoogleCloudStream(),
  getTimeStamps: () => sttInstance.timeStamps,
  detectFirstSentence: () => detectFirstSentence(),
};
