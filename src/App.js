import "./App.css";
import { Routes, Route } from "react-router-dom";
import Login from "./components/Auth/login";
import Register from "./components/Auth/register";
import Master from "./components/VideoStreamPlayer/master";
import Viewer from "./components/VideoStreamPlayer/viewer";
import ModeSelector from "./components/modeSelector";
import Home from "./components/home";
import Clip from "./components/Clips";
import 'bootstrap/dist/css/bootstrap.min.css';

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
                <Route path="/clip" element={<Clip />}></Route>
            </Routes>
        </div>
    );
}

export default App;
