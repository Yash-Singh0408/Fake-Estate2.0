import "./layout.scss";
import Navbar from "./components/navbar/Navbar.jsx";
import Homepage from "./pages/homePage/Homepage.jsx";

function App() {
  return (
    <div className="layout">
      <div className="nav">
        <Navbar />
      </div>
      <div className="content">
        <Homepage />
      </div>
    </div>
  );
}

export default App;
