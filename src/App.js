import logo from "./logo.svg";
import "./App.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCommenting,
  faRobot,
  faCalendar,
  faBookmark,
  faGlobeOceania,
  faBell,
  faPalette,
  faUserCircle
} from "@fortawesome/free-solid-svg-icons";
import Home from "./component/home";
function App() {
  return (
    <>
    <div className="w-full h-16 top-nav">
    <div
         className="flex items-center"
         style={{ flex: "1 1 0", minWidth: "0", marginRight: "15px" }}
       >
         <img
           className="h-12 w-12 flex-none rounded-full bg-gray-50"
           src="https://www.creativefabrica.com/wp-content/uploads/2021/07/05/Chatbot-Logo-Modern-bot-logo-Graphics-14298242-1.jpg"
           alt=""
         />
         <div className="min-w-0 ml-3 text-white">
           <p className="text-sm font-semibold leading-6 text-white-900">
             ColaBot
           </p>
           <p className="text-xs font-semibold leading-6">
             Impact Holding Company
           </p>
         </div>
         </div>
    </div>
      <div class="nav">
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
      </div>
      <div class="nav bottom-menu">
        <a href="#notfound">
          <FontAwesomeIcon className="menu-icon" icon={faBell} />
        </a>
        <a href="#notfound">
          <FontAwesomeIcon className="menu-icon" icon={faPalette} />
        </a>
        <a href="#notfound">
          <FontAwesomeIcon className="menu-icon" icon={faUserCircle} />
        </a>
      </div>

      <div class="container">
        {/* <section id="first">
          <h1>Chat</h1>
        </section>

        <section id="notfound">
          <h1>Hello</h1>
        </section> */}
        <Home />
      </div>
    </>
  );
}

export default App;
