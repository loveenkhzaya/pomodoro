import React from "react";
import "./App.css";
import doorSound from "./door.mp3";

const AnimateDigit = ({ animation, digit }) => {
  return (
    <div className={`flipCard ${animation}`}>
      <span>{digit}</span>
    </div>
  );
};

const StaticCard = ({ position, digit }) => {
  return (
    <div className={position}>
      <span>{digit}</span>
    </div>
  );
};

const FlipUnitContainer = ({ digit, shuffle }) => {
  let currentDigit = digit;
  let previousDigit = digit + 1;

  if (currentDigit < 10) {
    currentDigit = "0" + currentDigit;
  }
  if (previousDigit < 10) {
    previousDigit = "0" + previousDigit;
  }

  // shuffle digits
  const digit1 = shuffle ? previousDigit : currentDigit;
  const digit2 = !shuffle ? previousDigit : currentDigit;

  // shuffle animations
  const animation1 = shuffle ? "fold" : "unfold";
  const animation2 = !shuffle ? "fold" : "unfold";

  return (
    <div className="flipUnitContainer">
      {/* curretnDigit */}
      <StaticCard position={"upperCard"} digit={currentDigit} />
      {/* previousDigit */}
      <StaticCard position={"lowerCard"} digit={previousDigit} />

      <AnimateDigit animation={animation1} digit={digit1} />
      <AnimateDigit animation={animation2} digit={digit2} />
    </div>
  );
};
const defaultState = {
  minutes: 25,
  seconds: 0,
  minutesShuffle: true,
  secondsShuffle: true,
  intervalId: 0,
  label: "Session",
  breakLength: 5,
  sessionLength: 25,
  isSession: true,
  isDone: false,
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = defaultState;
    this.play = this.play.bind(this);
    this.setTime = this.setTime.bind(this);
    this.updateTime = this.updateTime.bind(this);
    this.reset = this.reset.bind(this);
  }

  setTime(unit, incremental) {
    const { sessionLength, breakLength, intervalId } = this.state;
    if (intervalId === 0) {
      if (unit === "B") {
        this.setState({
          breakLength:
            breakLength + incremental < 61
              ? breakLength + incremental > 0
                ? breakLength + incremental
                : breakLength
              : breakLength,
        });
      }
      if (unit === "S") {
        this.setState({
          sessionLength:
            sessionLength + incremental < 61
              ? sessionLength + incremental > 0
                ? sessionLength + incremental
                : sessionLength
              : sessionLength,
          minutes:
            sessionLength + incremental < 61
              ? sessionLength + incremental > 0
                ? sessionLength + incremental
                : sessionLength
              : sessionLength,
        });
      }
    }
  }

  play() {
    if (this.state.intervalId === 0) {
      this.setState({
        intervalId: setInterval(() => {
          this.updateTime();
        }, 1000),
      });
    } else {
      clearInterval(this.state.intervalId);
      this.setState({
        intervalId: 0,
      });
    }
  }

  reset() {
    clearInterval(this.state.intervalId);
    this.setState(defaultState);
    const audio = document.getElementById("beep");
    audio.pause();
    audio.currentTime = 0;
  }
  updateTime() {
    if (this.state.isDone) {
      if (this.state.isSession) {
        this.setState({
          isSession: false,
          minutes: this.state.breakLength,
          label: "Break",
          isDone: false,
        });
      } else {
        this.setState({
          isSession: true,
          minutes: this.state.sessionLength,
          label: "Session",
          isDone: false,
        });
      }
    } else {
      if (this.state.seconds > 0) {
        this.setState({
          seconds: this.state.seconds - 1,
          secondsShuffle: !this.state.secondsShuffle ? true : false,
        });
      }
      if (this.state.minutes > 0 && this.state.seconds === 0) {
        this.setState({
          minutes: this.state.minutes - 1,
          minutesShuffle: !this.state.minutesShuffle ? true : false,
          seconds: 59,
        });
      }
      if (this.state.minutes === 0 && this.state.seconds === 0) {
        document.getElementById("beep").play();
        this.setState({
          isDone: true,
        });
      }
    }
  }

  render() {
    const { minutes, minutesShuffle, seconds, secondsShuffle } = this.state;
    return (
      <div className="container">
        <audio id="beep" controls>
          <source src="horse.ogg" type="audio/ogg" />
          <source src={doorSound} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
        <div className={"flipClock"}>
          <div className="label">
            <h1 id="timer-label">{this.state.label}</h1>
            <div id="break-label">
              Break Length
              <div id="break-length">{this.state.breakLength}</div>
              <div>
                <button
                  onClick={() => this.setTime("B", 1)}
                  value={"B"}
                  id="break-increment"
                >
                  +
                </button>
                <button
                  onClick={() => this.setTime("B", -1)}
                  value={"B"}
                  id="break-decrement"
                >
                  -
                </button>
              </div>
            </div>
            <div id="session-label">
              Session Length
              <div id="session-length">{this.state.sessionLength}</div>
              <div>
                <button
                  onClick={() => this.setTime("S", 1)}
                  value={"S"}
                  id="session-increment"
                >
                  +
                </button>
                <button
                  onClick={() => this.setTime("S", -1)}
                  value={"S"}
                  id="session-decrement"
                >
                  -
                </button>
              </div>
            </div>
          </div>
          <div id="time-left">
            {(minutes < 10 ? "0" + minutes : minutes) +
              ":" +
              (seconds < 10 ? "0" + seconds : seconds)}
          </div>
          <FlipUnitContainer shuffle={minutesShuffle} digit={minutes} />
          <FlipUnitContainer shuffle={secondsShuffle} digit={seconds} />
        </div>
        <div className="flipClock">
          <button onClick={this.play} id="start_stop">
            Play
          </button>
          <button onClick={this.play} id="start_stop">
            Stop
          </button>
          <button onClick={this.reset} id="reset">
            Reset
          </button>
        </div>
      </div>
    );
  }
}
export default App;
