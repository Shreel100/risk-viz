import React from 'react';
import { useLoadScript, GoogleMap, Marker } from '@react-google-maps/api';
import './Map.css';
import { useState, useEffect } from 'react';
import Data from '../data.csv';
import Papa from 'papaparse';
import '../App.css';
import NavBar from '../NavBar';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedYear } from '../redux/actions';


export default function Map() {

  
  const dispatch = useDispatch();
  const selectedYear = useSelector((state) => state.year);
  const [data, setData] = useState([]);
  const [yearsArray, setYearsArray] = useState([])
  const [locations, setLocations] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(Data);
      const reader = response.body.getReader();
      const result = await reader.read();
      const decoder = new TextDecoder("utf-8");
      const csvData = decoder.decode(result.value);
      const parsedData = Papa.parse(csvData, { 
        header: true, 
        skipEmptyLines: true 
      }).data;
      setData(parsedData);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const years = [...new Set(data.map((row) => row.Year))];
    setYearsArray(years)
  },[data])

  useEffect(() => {
    if (selectedYear) {
      const filteredLocations = data.filter((row) => row.Year === selectedYear)
        .map((row) => ({ lat: parseFloat(row.Lat), lng: parseFloat(row.Long), riskRating: parseFloat(row["Risk Rating"]) }));
      setLocations(filteredLocations);
    }
  }, [data, selectedYear]);

  const handleYearChange = (event) => {
    dispatch(setSelectedYear(event.target.value));
  };

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.React_APP_API_KEY
  });

  const getMarkerColor = (riskRating) => {
    if (riskRating >= 0.75) {
      return 'red';
    } else if (riskRating >= 0.5) {
      return 'orange';
    } else if (riskRating >= 0.25) {
      return 'yellow';
    } else {
      return 'green';
    }
  }    

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div className='header'>
    <div className='header_div'>
    <NavBar />
      <div className='dropdown'>
        <label htmlFor="year-select">Select a year : </label>
        <select id="year-select" value={selectedYear} onChange={handleYearChange}>
        <option value="">Select a year</option>
        {yearsArray.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
    </div>
    </div>

    <GoogleMap zoom={4} center={{ lat: 43.0896, lng: -79.0849 }} mapContainerClassName='map-container'>
      {locations && locations.map((location, index) => {
        const markerColor = getMarkerColor(parseFloat(location['riskRating']));
        return (
          <Marker  
          onClick={(event) => {
            console.log({ lat: event.latLng.lat(), long: event.latLng.lng() });
          }}
          key={index} position={{ lat: parseFloat(location.lat), lng: parseFloat(location.lng) }} 
          icon={{
            path: 'M0-48c-9.8 0-17.7 7.8-17.7 17.4 0 15.5 17.7 30.6 17.7 30.6s17.7-15.4 17.7-30.6c0-9.6-7.9-17.4-17.7-17.4z',
            fillColor: markerColor,
            fillOpacity: 1,
            strokeWeight: 0,
            scale: 0.5}}
          />
        )
        })}
    </GoogleMap>
    </div>
  );
}