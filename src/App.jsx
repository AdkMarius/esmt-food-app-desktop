import { Routes, Route } from "react-router-dom";
import { DynamicItem, Sidebar, dummyData } from "./components";
import "./App.css";

function App() {
  return (
    <div id="main">
      <Sidebar>
        <Routes>
          <Route path="/" element={<DynamicItem page="./pages/login.jsx" />} />
        </Routes>
      </Sidebar>
    </div>
  );
}

export default App;