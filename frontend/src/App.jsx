import { BrowserRouter as Router, Routes, Route, BrowserRouter } from "react-router-dom";
import Register from "./pages/register.jsx";
import SignIn from "./pages/signin.jsx";
import Home from "./pages/home.jsx";

function App(){
  return (
   <BrowserRouter>
    <Routes>
      <Route path="/" element={<Register />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/home" element={<Home />} />
    </Routes>
   </BrowserRouter>
  );
}

export default App;