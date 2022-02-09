import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown, faArrowUp, faPlay, faPause, faArrowsRotate } from '@fortawesome/free-solid-svg-icons'
import './App.css';

function App() {
  
  const [displayTime, setDisplayTime] = useState(25 * 60);
  const [breakTime, setBreakTime] = useState(5);
  const [sessionTime, setSessionTime] = useState(25);
  const [onBreak, setOnBreak] = useState(false);
  const [timerOn, setTimerOn] = useState(false);
  
  // Create a function to format time the way it is suppose to be displayed on the app;
  const formatTime = (time) => {
    let minutes = Math.floor(time / 60);
    let seconds = time % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
  }
  
  // Create a function to increase and decrease the breakTime and sessionTime variables
  const changeTime = (type, amount) => {
    if (type === "break") {
      if (breakTime + amount >= 1 && breakTime + amount <= 60) {
        setBreakTime(prev => prev + amount);
      }
    } else if (type === "session") {
      if (sessionTime + amount >= 1 && sessionTime + amount <= 60) {
        setSessionTime(prev => prev + amount)
        if (!timerOn) {
          setDisplayTime((sessionTime + amount) * 60);
        }
      }
    }
  }
    
  // Create a useEffect element, which calls a timer function
  let timer;
  useEffect(() => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      if (timerOn) {
        if (displayTime <= 0 && !onBreak) {
          setOnBreak(true);
          setDisplayTime(breakTime * 60);
        } else if (displayTime <= 0 && onBreak) {
          setOnBreak(false);
          setDisplayTime(sessionTime * 60);
        } else {
          setDisplayTime(prev => prev - 1)
        }
      }
      
    }, 1000)

  }, [displayTime, timerOn, timer]);
  
  // Create a play_pause function, which turns the timer on and off
  const playPause = () => {
    clearTimeout(timer)
    setTimerOn(!timerOn)
  }
  
  // Create a reset function, which sets all the states to their default values
  const reset = () => {
    let audio = document.getElementById("beep");
    audio.pause();
    audio.currentTime = 0
    clearTimeout(timer);
    setTimerOn(false);
    setBreakTime(5);
    setSessionTime(25);
    setOnBreak(false);
    setDisplayTime(25 * 60);
  }
  
  // Create a playSound function
  const playSound = () => {
    if (displayTime === 0) {
      let audio = document.getElementById("beep");
      audio.currentTime = 0;
      audio.play();
    }
  }
  
  return (
    <div className="App">
      <h1>Pomodoro Timer</h1>
      <div className="dual-container">
        <div>
          <h3 id="break-label">Break Length</h3>
          <div className="time-sets">
            <i id="break-decrement" className="pad" onClick={() => changeTime("break", -1)}><FontAwesomeIcon icon={faArrowDown} /></i>
            <h3 id="break-length">{breakTime}</h3>
            <i id="break-increment" className="pad" onClick={() => changeTime("break",  1)}><FontAwesomeIcon icon={faArrowUp} /></i>
          </div>
        </div>
        <div>
          <h3 id="session-label">Session Length</h3>
          <div className="time-sets">
            <i id="session-decrement" className="pad" onClick={() => changeTime("session", -1)}><FontAwesomeIcon icon={faArrowDown} /></i>
            <h3 id="session-length">{sessionTime}</h3>
            <i id="session-increment" className="pad"  onClick={() => changeTime("session", 1)}><FontAwesomeIcon icon={faArrowUp} /></i>
          </div>
        </div>
      </div>
      <div id="display-container">
        <div id="timer-label">{onBreak ? "Break" : "Session"}</div>
        <div id="time-left">{formatTime(displayTime)}</div>
      </div>
      
      <div className="control-pad">
        <i id="start_stop" className="pad" onClick={playPause}>
          <FontAwesomeIcon icon={faPlay} />
          <FontAwesomeIcon icon={faPause} />
        </i>
        <i id="reset" className="pad" onClick={reset}><FontAwesomeIcon icon={faArrowsRotate} /></i>
      </div>
      <audio 
        id="beep"
        preload="auto"
        src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"
        controls
        ref={playSound}
      />
    </div>
  );
}

export default App;
