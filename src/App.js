import './App.css';
import PaletteMaker from "./canvas/paletteMaker"
import NavBar from './canvas/navbar';

function App() {
  return (
    <div className="App">
      <NavBar />
      <PaletteMaker />
      <div style={{ marginBottom: "500px" }}></div>
    </div>
  );
}

export default App;
