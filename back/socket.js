const speech = require('@google-cloud/speech');
const speechClient = new speech.SpeechClient();

const recorder = require('node-record-lpcm16');

module.exports = (io) => {
  io.on('connection', function (client) {
    console.log('소켓 서버단 커넥트');
    let recognizeStream = null;

    client.on('join', function (data) {
      console.log(data);
      client.emit('messages', '소켓 서버-클라 연결 성공');
    });

    client.on('startGoogleCloudStream', function (data) {
      console.log('startGoogleCloudStream 받음', data);
      startRecognitionStream(this, data);
    });


    function startRecognitionStream(client) {
      recognizeStream = speechClient
        .streamingRecognize(request)
        .on('error', console.error)
        .on('data', (data) => {
          process.stdout.write(
            data.results[0] && data.results[0].alternatives[0]
              ? `Transcription: ${data.results[0].alternatives[0].transcript}\n`
              : '\n\nReached transcription time limit, press Ctrl+C\n'
          );
          client.emit('speechData', data);
          
          // if end of utterance, let's restart stream
          // this is a small hack. After 65 seconds of silence, the stream will still throw an error for speech length limit
          if (data.results[0] && data.results[0].isFinal) {
            stopRecognitionStream();
            startRecognitionStream(client);
            console.log('restarted stream serverside');
          }
        });

        recorder
        .record({
          sampleRateHertz: sampleRateHertz,
          threshold: 0, //silence threshold
          recordProgram: 'rec', // Try also "arecord" or "sox"
          silence: '5.0', //seconds of silence before ending
        })
        .stream()
        .on('error', console.error)
        .pipe(recognizeStream);

    }

    function stopRecognitionStream() {
      if (recognizeStream) {
        recognizeStream.end();
      }
      recognizeStream = null;
    }

  });
};

// =========================== GOOGLE CLOUD SETTINGS ================================ //

// The encoding of the audio file, e.g. 'LINEAR16'
// The sample rate of the audio file in hertz, e.g. 16000
// The BCP-47 language code to use, e.g. 'en-US'
const encoding = 'LINEAR16';
const sampleRateHertz = 16000;
const languageCode = 'ko-KR'; //en-US

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
