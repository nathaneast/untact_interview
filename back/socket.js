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
//

const sttResults = [];
let currentQuestionIndex = 0;

let streamingLimit = 20000;
let recognizeStream = null;
let restartCounter = 0;
let audioInput = [];
let lastAudioInput = [];
let resultEndTime = 0; // STT 마지막 인식 시간
let isFinalEndTime = 0;
let finalRequestEndTime = 0; // 재시작될때 마지막 stt 시간
let newStream = true;
let bridgingOffset = 0;
let isDetectFirstSentence = true;
// let lastTranscriptWasFinal = false;

// class Question {
//   constructor(time, text) {
//     this.time = time;
//     this.text = text;
//   }
// }

module.exports = (io) => {
  io.on('connection', function (client) {
    console.log('소켓 서버단 커넥트');

    client.on('join', function (data) {
      console.log(data);
      client.emit('messages', '소켓 서버-클라 연결 성공');
    });
    client.on('startGoogleCloudStream', function (data) {
      console.log('startGoogleCloudStream 받음', data);
      startRecoding();
      startStream(client);
      // markingTimeStamp();
    });
    client.on('detectFirstSentence', function (data) {
      isDetectFirstSentence = true;
      if (!sttResults[currentQuestionIndex]) {
        sttResults[currentQuestionIndex] = '';
      }
      currentQuestionIndex++;
      console.log(sttResults, 'sttResults')
    });
  });
};

// function markingTimeStamp() {
//   // let question;
//   // if (currentQuestionIndex) {
//   //   question = new Question(currentRecTime / 1000);
//   // } else {
//   //   question = new Question(0);
//   // }
//   const question = new Question(currentRecTime);
//   timeStamps.push(question);
// }

function restartStream(client) {
  console.log('restartStream');
  
  // STT 인식 끝내기
  if (recognizeStream) {
    recognizeStream.end();
    recognizeStream.removeListener('data', speechCallback);
    recognizeStream = null;
  }
  if (resultEndTime > 0) {
    // STT 마무리 시간 저장
    finalRequestEndTime = isFinalEndTime;
  }
  resultEndTime = 0; // 문장마다 끝나는 시간 체크 초기화

  // 마지막 오디오에 저장
  lastAudioInput = [];
  lastAudioInput = audioInput;

  restartCounter++;

  // if (!lastTranscriptWasFinal) {
  //   process.stdout.write('\n');
  // }
  console.log('레코딩 재시작', `${streamingLimit * restartCounter}`);
  // process.stdout.write(
  //   chalk.yellow(`${streamingLimit * restartCounter}: RESTARTING REQUEST\n`)
  // );

  newStream = true;

  // 1번 실행 반복
  startStream(client);
}

// 2번 실행
function speechCallback (stream, client) {
console.log('speechCallback');
// Convert API result end time from seconds + nanoseconds to milliseconds
resultEndTime =
  stream.results[0].resultEndTime.seconds * 1000 +
  Math.round(stream.results[0].resultEndTime.nanos / 1000000);

// Calculate correct time based on offset from audio sent twice
 const currentRecTime =
  resultEndTime - bridgingOffset + streamingLimit * restartCounter;

// process.stdout.clearLine();
// process.stdout.cursorTo(0);

if (isDetectFirstSentence) {
  client.emit('timeStamp', '');
  isDetectFirstSentence = false;
  console.log('첫 문장 감지', isDetectFirstSentence);
}

const transcript = stream.results[0].alternatives[0].transcript;
if (stream.results[0] && stream.results[0].alternatives[0]) {
  console.log('transcript', `${currentRecTime} ${transcript}`);
  client.emit('speechRealTime', transcript);
  // client.emit('speechRealTimeData', stream);
}

if (stream.results[0].isFinal) {
  // process.stdout.write(chalk.green(`${stdoutText}\n`));
  console.log('문장 완성',`${currentRecTime} ${transcript}`);
  client.emit('speechResult', transcript);

  sttResults[currentQuestionIndex] = sttResults[currentQuestionIndex]
    ? `${sttResults[currentQuestionIndex]} ${transcript}`
    : transcript;

  console.log(sttResults, currentQuestionIndex, 'sttResults');

  //  `${sttResults[currentQuestionIndex].text ? 
  //   sttResults[currentQuestionIndex].text : ''} ${transcript}`
  // console.log(sttResults);
  isFinalEndTime = resultEndTime; // 문장 완료 후 끝나는 시간 저장
  // lastTranscriptWasFinal = true;
} else {
  // Make sure transcript does not exceed console character length
  // if (stdoutText.length > process.stdout.columns) {
  //   stdoutText =
  //     stdoutText.substring(0, process.stdout.columns - 4) + '...';
  // }
  // process.stdout.write(chalk.red(`${stdoutText}`));
  // lastTranscriptWasFinal = false;
  }
};

function startStream(client) {
  console.log('startStream');
  // Clear current audioInput
  audioInput = [];
  // Initiate (Reinitiate) a recognize stream
  recognizeStream = speechClient
    .streamingRecognize(request)
    .on('error', (err) => {
      if (err.code === 11) {
        // restartStream();
      } else {
        console.error('API request error ' + err);
      }
    })
    .on('data', (stream) => speechCallback(stream, client));

  // Restart stream when streamingLimit expires
  // 2-1번
  setTimeout(() => restartStream(client), streamingLimit);
}

// 리레코딩 newSteram true되면 이전 미완성 문장 가져오는 로직
const audioInputStreamTransform = new Writable({
    write(chunk, encoding, next) {
      if (newStream && lastAudioInput.length !== 0) {
        // Approximate math to calculate time of chunks
        const chunkTime = streamingLimit / lastAudioInput.length;
        if (chunkTime !== 0) {
          if (bridgingOffset < 0) {
            bridgingOffset = 0;
          }
          if (bridgingOffset > finalRequestEndTime) {
            bridgingOffset = finalRequestEndTime;
          }
          const chunksFromMS = Math.floor(
            (finalRequestEndTime - bridgingOffset) / chunkTime
          );
          bridgingOffset = Math.floor(
            (lastAudioInput.length - chunksFromMS) * chunkTime
          );

          recognizeStream.write(lastAudioInput[lastAudioInput.length - 1]);

          // for (let i = chunksFromMS; i < lastAudioInput.length; i++) {
          //   recognizeStream.write(lastAudioInput[i]);
          // }
        }
        newStream = false;
      }

      audioInput.push(chunk);

      if (recognizeStream) {
        recognizeStream.write(chunk);
      }

      next();
    },

    final() {
      if (recognizeStream) {
        recognizeStream.end();
      }
    },
  });

function startRecoding() {
  console.log('startRecoding');
  recorder
    .record({
      sampleRateHertz: sampleRateHertz,
      threshold: 0, // Silence threshold
      silence: 1000,
      keepSilence: true,
      recordProgram: 'rec', // Try also "arecord" or "sox"
    })
    .stream()
    .on('error', (err) => {
      console.error('Audio recording error ' + err);
    })
    .pipe(audioInputStreamTransform); // 0-1번
}
