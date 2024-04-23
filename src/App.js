import logo from "./logo.svg";
import "./App.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCommenting,
  faRobot,
  faCalendar,
  faBookmark,
  faGlobeOceania,
} from "@fortawesome/free-solid-svg-icons";
import Home from "./component/home";
function App() {
  return (
    <>
      <nav>
        <a href="/">
          <FontAwesomeIcon className="menu-icon" icon={faGlobeOceania} />
        </a>
        <a href="#first">
          <FontAwesomeIcon className="menu-icon" icon={faCommenting} />
        </a>
        <a href="#notfound">
          <FontAwesomeIcon className="menu-icon" icon={faRobot} />
        </a>
        <a href="#notfound">
          <FontAwesomeIcon className="menu-icon" icon={faCalendar} />
        </a>
        <a href="#notfound">
          <FontAwesomeIcon className="menu-icon" icon={faBookmark} />
        </a>
      </nav>

      <div class="container">
        <section id="first">
          <h1>Chat</h1>
        </section>

        <section id="notfound">
          <h1>Hello</h1>
        </section>
        <Home />
      </div>
    </>
  );
}

export default App;
