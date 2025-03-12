import "./homepage.scss";
import SearchBar from "../../components/searchBar/SearchBar.jsx";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext.jsx";

function Homepage() {

  const {currentUser} = useContext(AuthContext)

  console.log(currentUser)

  return (
    <>
    <div className="homepage">
      <div className="textContainer">
        <div className="wrapper">
          <h1 className="title">Buy Sell and Rent Your Dream Properties</h1>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit dolor sit 
          amet consectetur adipisicing elit Lorem ipsum dolor sit amet consectetur adipisicing elit</p>
          <SearchBar />
          <div className="boxes">
            <div className="box">
              <h1>16+</h1>
              <h2>Years Experience</h2>
            </div>
            <div className="box">
              <h1>100+</h1>
              <h2>Properties Sold</h2>
            </div>
            <div className="box">
              <h1>50+</h1>
              <h2>Agents</h2>
            </div>
          </div>
        </div>
      </div>
      <div className="imageContainer">
        <img src="/bg.png" alt="" />
      </div>
    </div>
   
    </>
  );
}

export default Homepage;
