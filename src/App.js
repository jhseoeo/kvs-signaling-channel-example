import "./App.css";
import { Routes, Route } from "react-router-dom";
import Login from "./components/Auth/login";
import Register from "./components/Auth/register";
import Master from "./components/VideoStreamPlayer/master";
import Viewer from "./components/VideoStreamPlayer/viewer";
import ModeSelector from "./components/modeSelector";
import Home from "./components/home";
import Clip from "./components/Clips";
import Recorder from "./components/Tmp_Recorder/recorder";
import { getCookie } from "./lib/cookie";
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
    return (
        <div className="App">
            <Routes>
                <Route path="/" element={<Home />}></Route>
                <Route path="/login" element={<Login />}></Route>
                <Route path="/register" element={<Register />}></Route>
                <Route path="/master/" element={getCookie("access") !== 'undefined' ? <Master/> : <Login/>}/>
                <Route path="/viewer/" element={getCookie("access") !== 'undefined' ? <Viewer/> : <Login/>}/>
                <Route path="/recorder" element={getCookie("access") !== 'undefined' ? <Recorder/> : <Login/>}/>
                <Route path="/modeSelector" element={<ModeSelector />}></Route>
                <Route path="/clip" element={<Clip />}></Route>
            </Routes>
        </div>
    );
}

export default App;
