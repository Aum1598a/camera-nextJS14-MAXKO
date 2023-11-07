'use client'
import React, { useState, useRef } from 'react';
import Webcam from 'react-webcam';

const App = () => {
  const webcamRef = useRef<Webcam | null>(null);
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [isCameraOn, setIsCameraOn] = useState(true);

  const handleCapture = () => {
    const screenshot = webcamRef.current?.getScreenshot();
    if (screenshot) {
      setScreenshot(screenshot);
    }
  };

  const toggleCamera = () => {
    setIsCameraOn((prevIsCameraOn) => !prevIsCameraOn);
  };

  const capture = () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    console.log(imageSrc);
    // You can do something with the captured image here.
  };


  return (
    <div>
      <h1>react-webcam</h1>

      {isCameraOn ? (
        <Webcam ref={webcamRef} />
      ) : (
        <p >Camera is turned off</p>
      )}
      <div>
        <button className='button-33' onClick={toggleCamera}>
          {isCameraOn ? 'Turn Off Camera' : 'Turn On Camera'}
        </button>
      </div>
      <div>
        <h2>Screenshot</h2>
        {isCameraOn && (
          <div>
            <button className='button-33' onClick={handleCapture}>Capture</button>
            {screenshot && <img src={screenshot} alt="Captured" />}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
