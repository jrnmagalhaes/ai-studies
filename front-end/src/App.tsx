import { Routes, Route } from "react-router";
import { Home, Login } from "./components/pages";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/Login" element={<Login />} />
    </Routes>
  );
}

export default App;
