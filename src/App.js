import "./App.css";
import { Routes, Route } from "react-router-dom";
import Selector from "./components/VideoStreamPlayer/selector";
import Master from "./components/VideoStreamPlayer/master";
import Viewer from "./components/VideoStreamPlayer/viewer";
import CompareRecoder from "./components/Tmp_Recorder/recorder_compare";
import DetectionRecoder from "./components/Tmp_Recorder/recorder_detection";
import Recorder from "./components/Tmp_Recorder/recorder_integrated";
import TestRecorder from "./components/Tmp_Recorder/testRecorder";

function App() {
    return (
        <div className="App">
            <Routes>
                <Route path="/" element={<Selector />}></Route>
                <Route path="/master/:channelName" element={<Master />}></Route>
                <Route path="/viewer/:channelName" element={<Viewer />}></Route>
                <Route path="/comparerecorder" element={<CompareRecoder />}></Route>
                <Route path="/detectionrecorder" element={<DetectionRecoder />}></Route>
                <Route path="/recorder" element={<Recorder />}></Route>
                <Route path="/testrecorder" element={<TestRecorder />}></Route>
            </Routes>
        </div>
    );
}

export default App;
