import React from 'react';
import PropTypes from 'prop-types';

const VideoUpload = ({ text, time, onClick, answerNumber }) => {
  const [videoSrc, setVideoSrc] = useState(null);

  const videoElement = useRef();
  const videoUpload = useRef();

  const onUpload = useCallback(() => {
    videoUpload.current.click();
  }, [videoUpload.current]);

  const onChangeVideo = useCallback((e) => {
    console.log(e.target.files, 'onChangeVideo target files');
    console.log(e, 'onChangeVideo event');
    setVideoSrc(e.target.files[0]);
  }, [setVideoSrc]);

  return (
    <article>
      <input
      type='file'
      name='video'
      hidden
      ref={videoUpload}
      onChange={onChangeVideo}
    />
    <button onClick={onUpload}>영상 업로드</button>
    {videoSrc ? (
      <video 
        controls 
        autoPlay 
        ref={videoElement} 
        src={URL.createObjectURL(videoSrc)}
        width="500px" 
        height="500px" 
      />
    ) : (
      <div>영상을 올려 주세요</div>
    )}
    </article>
  );
}

// VideoUpload.propTypes = {
//   text: PropTypes.string.isRequired,
//   // time: PropTypes.number.isRequired,
//   onClick: PropTypes.func.isRequired,
//   answerNumber: PropTypes.number.isRequired,
// };

// export default VideoUpload;
