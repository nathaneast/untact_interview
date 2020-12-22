const speech = require('@google-cloud/speech');
const speechClient = new speech.SpeechClient();

const recorder = require('node-record-lpcm16');
const { Writable } = require('stream');


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
    // speechContexts: [{
    //     phrases: ["hoful","shwazil"]
    //    }] // add your own speech context for better recognition
  },
  interimResults: true, // If you want interim results, set this to true
};

let streamingLimit = 10000;
let recognizeStream = null;
let restartCounter = 0;
let audioInput = [];
let lastAudioInput = [];
let resultEndTime = 0; // 끝나는 시간
let isFinalEndTime = 0;
let finalRequestEndTime = 0;
let newStream = true;
let bridgingOffset = 0;
let lastTranscriptWasFinal = false;

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
      startRecognitionStream();
    });
  });
};

// function
function restartStream() {
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

  if (!lastTranscriptWasFinal) {
    process.stdout.write('\n');
  }
  console.log('레코딩 재시작', `${streamingLimit * restartCounter}`);
  // process.stdout.write(
  //   chalk.yellow(`${streamingLimit * restartCounter}: RESTARTING REQUEST\n`)
  // );

  newStream = true;

  // 1번 실행 반복
  startRecognitionStream();
}

// 2번 실행
function speechCallback (stream) {
console.log('speechCallback');
// Convert API result end time from seconds + nanoseconds to milliseconds
resultEndTime =
  stream.results[0].resultEndTime.seconds * 1000 +
  Math.round(stream.results[0].resultEndTime.nanos / 1000000);

// Calculate correct time based on offset from audio sent twice
const correctedTime =
  resultEndTime - bridgingOffset + streamingLimit * restartCounter;

// process.stdout.clearLine();
// process.stdout.cursorTo(0);
if (stream.results[0] && stream.results[0].alternatives[0]) {
  stdoutText = correctedTime + ': ' + stream.results[0].alternatives[0].transcript;
  console.log('transcript', `${correctedTime} ${stream.results[0].alternatives[0].transcript}`);
}

if (stream.results[0].isFinal) {
  // process.stdout.write(chalk.green(`${stdoutText}\n`));

  isFinalEndTime = resultEndTime; // 문장 완료 후 끝나는 시간 저장
  lastTranscriptWasFinal = true;
} else {
  // Make sure transcript does not exceed console character length
  // if (stdoutText.length > process.stdout.columns) {
  //   stdoutText =
  //     stdoutText.substring(0, process.stdout.columns - 4) + '...';
  // }
  // process.stdout.write(chalk.red(`${stdoutText}`));
  lastTranscriptWasFinal = false;
  }
};


function startRecognitionStream() {
  console.log('startRecognitionStream');
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
    .on('data', speechCallback);

  // Restart stream when streamingLimit expires
  // 2-1번
  setTimeout(restartStream, streamingLimit);
}

const audioInputStreamTransform = new Writable({
    write(chunk, encoding, next) {
      console.log('audioInputStreamTransform');
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

          for (let i = chunksFromMS; i < lastAudioInput.length; i++) {
            recognizeStream.write(lastAudioInput[i]);
          }
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

    // function startRecognitionStream(client) {
    //   recognizeStream = speechClient
    //     .streamingRecognize(request)
    //     .on('error', console.error)
    //     .on('data', (data) => {
    //       process.stdout.write(
    //         data.results[0] && data.results[0].alternatives[0]
    //           ? `Transcription: ${data.results[0].alternatives[0].transcript}\n`
    //           : '\n\nReached transcription time limit, press Ctrl+C\n'
    //       );
    //       // client.emit('speechData', data);
          
    //       // if end of utterance, let's restart stream
    //       // this is a small hack. After 65 seconds of silence, the stream will still throw an error for speech length limit
    //       // if (data.results[0] && data.results[0].isFinal) {
    //       //   stopRecognitionStream();
    //       //   startRecognitionStream(client);
    //       //   console.log('restarted stream serverside');
    //       // }
    //     });

    //     recorder
    //     .record({
    //       sampleRateHertz: sampleRateHertz,
    //       threshold: 0, //silence threshold
    //       recordProgram: 'rec', // Try also "arecord" or "sox"
    //       silence: '5.0', //seconds of silence before ending
    //     })
    //     .stream()
    //     .on('error', console.error)
    //     .pipe(recognizeStream);

    // }

    // function stopRecognitionStream() {
    //   if (recognizeStream) {
    //     recognizeStream.end();
    //   }
    //   recognizeStream = null;
    // }
