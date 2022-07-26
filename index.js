function App() {
  const [displayTime, setDisplayTime] = React.useState(25 * 60);
  const [breakTime, setBreakTime] = React.useState(5); //change this for 5 * 60
  const [sessionTime, setSessionTime] = React.useState(25); //change this for 25 * 60
  const [timerOn, setTimerOn] = React.useState(false);
  const [onBreak, setOnBreak] = React.useState(false);
  const [isZero, setIsZero] = React.useState(false);

  //const [alarm, setAlarm] = React.useState(new Audio("alarm_beep_3.mp3")); change audio tag for this

  const playAlarm = () => {
    /* alarm.currentTime = 0;
    alarm.play();*/
    const alarm = document.getElementById("beep"); //change this
    alarm.currentTime = 0;
    alarm.play();
  };
  const formatTime = (time) => {
    let minutes = Math.floor(time / 60);
    let seconds = time % 60;
    return (
      (minutes < 10 ? "0" + minutes : minutes) +
      ":" +
      (seconds < 10 ? "0" + seconds : seconds)
    );
  };

  const changeTime = (amount, type) => {
    if (type == "break") {
      if (amount < 0 && breakTime > 1) {
        setBreakTime((prev) => prev + amount);
      } else if (amount > 0 && breakTime < 60) {
        setBreakTime((prev) => prev + amount);
      }

      //change this for 60 * 60 and 1 * 60
    } else if (type == "session") {
      if (amount < 0 && sessionTime > 1) {
        setSessionTime((prev) => prev + amount);
      } else if (amount > 0 && sessionTime < 60) {
        setSessionTime((prev) => prev + amount);
      }
      if (!timerOn && sessionTime < 60 && amount > 0) {
        setDisplayTime(sessionTime * 60 + amount * 60); //change this to sessionTime + amount
      } else if (!timerOn && sessionTime > 1 && amount < 0) {
        setDisplayTime(sessionTime * 60 + amount * 60); //change this to sessionTime + amount
      }
    }
  };
  const start = () => {
    let second = 1000;
    let date = new Date().getTime();
    let nextDate = new Date().getTime() + second;
    let onBreakVar = onBreak;
    if (!timerOn) {
      let interval = setInterval(() => {
        if (!isZero) {
          date = new Date().getTime();
          if (date > nextDate) {
            setDisplayTime((prev) => {
              if (prev <= 1) {
                playAlarm();
              }
              if (prev <= 0 && !onBreakVar) {
                onBreakVar = true;
                setOnBreak(true);
                return breakTime * 60;
              } else if (prev <= 0 && onBreakVar) {
                onBreakVar = false;
                setOnBreak(false);
                return sessionTime * 60;
              } else {
                return prev - 1;
              }
            });
            nextDate += second;
          }
        } else {
        }
      }, 30);
      localStorage.clear();
      localStorage.setItem("interval-id", interval);
    }
    if (timerOn) {
      clearInterval(localStorage.getItem("interval-id"));
    }
    setTimerOn(!timerOn);
  };
  const resetTime = () => {
    setTimerOn(false);
    setDisplayTime(25 * 60);
    setBreakTime(5); //change this for 5 *60
    setSessionTime(25); //change this for 25 *60
    const alarm = document.getElementById("beep"); //change this
    alarm.pause(); // and this
    alarm.currentTime = 0; // and this
    clearInterval(localStorage.getItem("interval-id"));
    setOnBreak(false);
  };

  return (
    <div className="container pt-5 text-center">
      <h1 className="pt-5 pb-3" id="title">
        25 + 5 Clock
      </h1>
      <div className="container pt-3 " id="clock">
        <Length
          title={"Break lenght"}
          changeTime={changeTime}
          type={"break"}
          time={breakTime}
          formatTime={formatTime}
        />
        <Length
          title={"Session lenght"}
          changeTime={changeTime}
          type={"session"}
          time={sessionTime}
          formatTime={formatTime}
        />
        <div id="screen">
          <label id="timer-label">
            <h4>{onBreak ? "Break" : "Session"}</h4>
          </label>
          <br />
          <h1 id="time-left">{formatTime(displayTime)}</h1>
        </div>
        <i
          onClick={start}
          className={timerOn ? "fa fa-pause m-1 fa-2x" : "fa fa-play m-1 fa-2x"}
          id="start_stop"
        ></i>
        <i
          onClick={resetTime}
          className="fa fa-arrow-rotate-right m-1 fa-2x"
          id="reset"
        ></i>
      </div>
      <audio src="alarm_beep_3.mp3" id="beep" />{" "}
      {/* change this for alarm state*/}
    </div>
  );
}
function Length({ title, changeTime, type, time, formatTime }) {
  return (
    <label id={`${type}-label`}>
      <h5 className="m-2">{title}</h5>
      <i
        className="fa fa-arrow-down m-2 fa-2x"
        id={`${type}-decrement`}
        onClick={() => changeTime(-1, type) /* change this for -60 */}
      ></i>
      <label id={`${type}-length`}>
        <h3>{time /* change this for formatTime(time) */}</h3>
      </label>
      <i
        className="fa fa-arrow-up m-2 fa-2x"
        id={`${type}-increment`}
        onClick={() => changeTime(1, type) /* change this for 60 */}
      ></i>
    </label>
  );
}
ReactDOM.render(<App />, document.getElementById("root"));
