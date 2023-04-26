import './App.css';
import MapScreen from './Screen/MapScreen';
import DataTable from './Screen/Table';
import Chart from './Screen/Chart';
import {
  BrowserRouter as Router,
  Route,
  Routes,
}from 'react-router-dom'

function App() {

  return (
      <div>
        <Router>
      <div>
        <Routes>
          <Route exact path="/" element={<MapScreen/>} />
          <Route exact path='/table' element = {<DataTable/>} />
          <Route exact path='/chart' element = {<Chart/>} />
        </Routes>
      </div>
    </Router>
      </div>
  );
}

export default App;