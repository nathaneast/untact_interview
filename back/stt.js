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
    this.streamingLimit = 180000;
    this.recognizeStream = null;
    this.restartCounter = 0;
    this.audioInput = [];
    this.lastAudioInput = [];
    this.resultEndTime = 0;
    this.isFinalEndTime = 0;
    this.finalRequestEndTime = 0;
    this.newStream = true;
    this.bridgingOffset = 0;
    this.isDetectFirstSentence = true;
    this.isSentenceFinal = false;
    this.isDivideSentence = false;
    this.previousSentenceLength = null;
    this.recording;
    this.reStartTimerId = null;
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
  
  // STT 인식 끝내기
  if (sttInstance.recognizeStream) {
    sttInstance.recognizeStream.end();
    sttInstance.recognizeStream.removeListener('data', speechCallback);
    sttInstance.recognizeStream = null;
  }
  if (sttInstance.resultEndTime > 0) {
    // STT 마무리 시간 저장
    sttInstance.finalRequestEndTime = sttInstance.isFinalEndTime;
  }
  sttInstance.resultEndTime = 0; // 문장마다 끝나는 시간 체크 초기화

  // 마지막 오디오에 저장
  sttInstance.lastAudioInput = [];
  sttInstance.lastAudioInput = sttInstance.audioInput;

  sttInstance.restartCounter++;

  // if (!lastTranscriptWasFinal) {
  //   process.stdout.write('\n');
  // }
  console.log('레코딩 재시작', `${sttInstance.streamingLimit * sttInstance.restartCounter}`);
  // process.stdout.write(
  //   chalk.yellow(`${sttInstance.streamingLimit * sttInstance.restartCounter}: RESTARTING REQUEST\n`)
  // );

  sttInstance.newStream = true;

  // 1번 실행 반복
  startStream(client);
}

// 2번 실행
const speechCallback = (stream, client) => {
console.log('speechCallback');
// Convert API result end time from seconds + nanoseconds to milliseconds
sttInstance.resultEndTime =
  stream.results[0].resultEndTime.seconds * 1000 +
  Math.round(stream.results[0].resultEndTime.nanos / 1000000);

// Calculate correct time based on offset from audio sent twice
 const currentRecTime =
  sttInstance.resultEndTime - sttInstance.bridgingOffset + sttInstance.streamingLimit * sttInstance.restartCounter;

  sttInstance.isSentenceFinal = stream.results[0].isFinal;

// process.stdout.clearLines();
// process.stdout.cursorTo(0);

const transcript = stream.results[0].alternatives[0].transcript;

if (sttInstance.isDetectFirstSentence) {
  console.log('speechCallback 문제의 첫 문장 감지! 현재문제 타임스탬프폼 만듬');
  // 이전 문제 문장이 안끝났으면 현재 문제 타임스탬프 찍으면 안됨
  markingTimeStamp(currentRecTime);
  sttInstance.isDetectFirstSentence = false;
}

if (sttInstance.isDivideSentence) {
  sttInstance.previousSentenceLength = transcript.length;
  sttInstance.isDivideSentence = false;
}

if (stream.results[0] && stream.results[0].alternatives[0]) {
  console.log('transcript', `${currentRecTime} ${transcript}`);
  client.emit('speechRealTime', transcript);
}

if (stream.results[0].isFinal) {
  // process.stdout.write(chalk.green(`${stdoutText}\n`));
  console.log('문장 완성',`${currentRecTime} ${transcript}`);
  client.emit('speechResult', transcript);

  if (sttInstance.previousSentenceLength) {
    console.log('sttInstance.previousSentenceLength true 로직');
    // 이전 문제 문장 타임스탬프 만들기
    sttInstance.timeStamps[
      sttInstance.currentQuestionIndex - 1
    ].text = sttInstance.timeStamps[sttInstance.currentQuestionIndex - 1].text
      ? sttInstance.timeStamps[sttInstance.currentQuestionIndex - 1].text +
        transcript.substring(0, sttInstance.previousSentenceLength)
      : transcript.substring(0, sttInstance.previousSentenceLength);

      //현재 문제 문장 타임스탬프 만들기
      const currentSpeechSentence = transcript.substring(
        sttInstance.previousSentenceLength,
        transcript.length
      );
      console.log(currentSpeechSentence, currentSpeechSentence.length , Boolean(currentSpeechSentence), 'currentSpeechSentence bool');

      if (currentSpeechSentence) {
        console.log(
          currentSpeechSentence,
          'currentSpeechSentence값이 있어서 현재 문제 타임스탬프에 넣기'
        );
        sttInstance.timeStamps[
          sttInstance.currentQuestionIndex
        ].text = transcript.substring(
          sttInstance.previousSentenceLength,
          transcript.length
        );
      } else {
        console.log('이전, (현재) 문장이 빈값이라 현재문제 타임스탬프 지움');
        sttInstance.timeStamps.pop();
        console.log(sttInstance.timeStamps, '지우고나서 타임스탬프 결과');
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
    console.log(sttInstance.timeStamps, '문장 finish 후 타임 스탬프');
    console.log('-------------------------------------------------------');

    sttInstance.previousSentenceLength = null;
  } else {
    console.log('sttInstance.previousSentenceLength false 로직');
    sttInstance.timeStamps[sttInstance.currentQuestionIndex].text = sttInstance
      .timeStamps[sttInstance.currentQuestionIndex].text
      ? sttInstance.timeStamps[sttInstance.currentQuestionIndex].text +
        transcript
      : transcript;
  }
  console.log(
    sttInstance.timeStamps,
    sttInstance.currentQuestionIndex,
    '현재 문제에 추가되는 문장 sttInstance.timeStamps'
  );

  sttInstance.isFinalEndTime = sttInstance.resultEndTime; // 문장 완료 후 끝나는 시간 저장
} 
// else {
  // Make sure transcript does not exceed console character length
  // if (stdoutText.length > process.stdout.columns) {
  //   stdoutText =
  //     stdoutText.substring(0, process.stdout.columns - 4) + '...';
  // }
  // process.stdout.write(chalk.red(`${stdoutText}`));
  // lastTranscriptWasFinal = false;
  // }
};

const startStream = (client) => {
  console.log('startStream');
  // Clear current audioInput
  sttInstance.audioInput = [];
  // Initiate (Reinitiate) a recognize stream
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

  // Restart stream when sttInstance.streamingLimit expires
  // 2-1번
  sttInstance.reStartTimerId = setTimeout(() => reStartStream(client), sttInstance.streamingLimit);
}

const audioProcess = () => new Writable({
  write(chunk, encoding, next) {
    // console.log('audioInputStreamTransform write 안');
    if (sttInstance.newStream && sttInstance.lastAudioInput.length !== 0) {
      // Approximate math to calculate time of chunks
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

        // for (let i = chunksFromMS; i < sttInstance.lastAudioInput.length; i++) {
        //   sttInstance.recognizeStream.write(sttInstance.lastAudioInput[i]);
        // }
      }
      sttInstance.newStream = false;
    }

    sttInstance.audioInput.push(chunk);

    if (sttInstance.recognizeStream) {
      // console.log('audioInputStreamTransform sttInstance.recognizeStream write');
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
  console.log('startRecoding');
  sttInstance.recording = recorder.record({
    sampleRateHertz: sampleRateHertz,
    threshold: 0, // Silence threshold
    silence: 1000,
    keepSilence: true,
    recordProgram: 'rec', // Try also "arecord" or "sox"
  });

  sttInstance.recording
    .stream()
    .on('error', (err) => {
      console.error('Audio sttInstance.recording error ' + err);
    })
    .pipe(audioInputStreamTransform); // 0-1번
}

const checkEmptySTTResult = () => {
  if (!sttInstance.timeStamps[sttInstance.currentQuestionIndex]) {
    console.log('이전 문제 인스턴스 없으니 만들기 checkEmptySTTResult');
    sttInstance.timeStamps[sttInstance.currentQuestionIndex] = new MyAnswer();
  }
}

// 다음 문제 넘어갔는데 이전 문제의 타임스탬프 인스턴스가 안만들어져 있으면
// 기본 인스턴스로 만들어주는 역할 fn
const detectProcess = () => {
  console.log('다음 문제로 넘어갔다, detectProcess');
  checkEmptySTTResult();
  sttInstance.isDetectFirstSentence = true;
  if (!sttInstance.isSentenceFinal) {
    sttInstance.isDivideSentence = true;
  }
  sttInstance.currentQuestionIndex++;
  console.log('다음 문제로 넘어가고 나서 현재 상태');
  console.log(sttInstance.timeStamps, sttInstance.currentQuestionIndex, 'detectFirstSentence timeStamps, index');
  console.log('----------------------------------------------');
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
  timeStamps: () => sttInstance.timeStamps,
  detectProcess: () => detectProcess(),
};
