import "./App.css";
import { Routes, Route } from "react-router-dom";
import Login from "./components/Auth/login";
import Register from "./components/Auth/register";
import Master from "./components/VideoStreamPlayer/master";
import Viewer from "./components/VideoStreamPlayer/viewer";
import Recoder from "./components/Tmp_Recorder/recorder";
import ModeSelector from "./components/modeSelector";
import Home from "./components/home";

function App() {
    return (
        <div className="App">
            <Routes>
                <Route path="/" element={<Home />}></Route>
                <Route path="/login" element={<Login />}></Route>
                <Route path="/register" element={<Register />}></Route>
                <Route path="/master/" element={<Master />}></Route>
                <Route path="/viewer/" element={<Viewer />}></Route>
                <Route path="/recorder" element={<Recoder />}></Route>
                <Route path="/modeSelector" element={<ModeSelector />}></Route>
            </Routes>
        </div>
    );
}

export default App;
