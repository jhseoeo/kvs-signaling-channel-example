import "./App.css";
import { Routes, Route } from "react-router-dom";
import Selector from "./components/VideoStreamPlayer/selector";
import Master from "./components/VideoStreamPlayer/master";
import Viewer from "./components/VideoStreamPlayer/viewer";
import Recoder from "./components/Tmp_Recorder/recorder";

function App() {
    return (
        <div className="App">
            <Routes>
                <Route path="/" element={<Selector />}></Route>
                <Route path="/master/:channelName" element={<Master />}></Route>
                <Route path="/viewer/:channelName" element={<Viewer />}></Route>
                <Route path="/recoder" element={<Recoder />}></Route>
            </Routes>
        </div>
    );
}

export default App;
