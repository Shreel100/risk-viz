import React from 'react'
import Papa from 'papaparse'
import { useEffect, useState} from 'react'
import Data from '../data.csv'
import {Line} from 'react-chartjs-2'
import {
    Chart as ChartJS,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement 
}from 'chart.js'
import './Chart.css'
import NavBar from '../NavBar'

ChartJS.register(
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement
)

export default function Chart() {

    const [data, setData] = useState([]);
    const [asset, setAsset] = useState([])
    const [selectedAsset, setSelectedAsset] = useState('');
    const [businessCategory, setBusinessCategory] = useState([])
    const [selectedBusinessCategory, setSelectedBusinessCategory] = useState('');
    const [selectedLocation, setSelectedLocation] = useState('');
    const [chartData, setChartData] = useState([])
    const [yearData, setYearData] = useState([])
    const [keysArray, setKeysArray] = useState([])
    const [valuesArray, setValuesArray] = useState([])
    
    const plotdata = {
        labels: valuesArray ,
        datasets: [
          {
            label: "Risk Factor",
            data: keysArray,
            fill: false,
            borderColor: "rgb(75, 192, 192)",
            tension: 0.1,
          },
        ],
      };

      const options = {
        plugins: {
          legend: true,
          tooltip: {
            enabled: true,
          },
        },
        scales: {
          y: {
            min: 0,
            max: 1,
          },
        },
        interaction: {
          intersect: true,
          mode: 'nearest',
        },
        callbacks: {
          label: (tooltipItem) => {
            const { index, datasetIndex } = tooltipItem;
            const assetName = data[index]['Asset Name'];
            const riskRating = data[index]['Risk Rating'];
            const riskFactors = data[index]['Risk Factors'];
            const year = data[index]['Year'];
      
            return `Asset Name: ${assetName} \nRisk Rating: ${riskRating} \nRisk Factors: ${riskFactors} \nYear: ${year}`;
          },
        },
      };
      

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
        const Assets_array = [...new Set(data.map((row) => row['Asset Name']))];
        setAsset(Assets_array)
      },[data])

      useEffect(() => {
        const Business_Category_array = [...new Set(data.map((row) => row['Business Category']))];
        setBusinessCategory(Business_Category_array)
      },[data])

      useEffect(() => {
        if (selectedAsset || selectedBusinessCategory || selectedLocation) {
          const filteredRiskRating = data.filter((row) => {
            return (selectedAsset ? row['Asset Name'] === selectedAsset : true) && (selectedBusinessCategory ? row['Business Category'] === selectedBusinessCategory : true);
          }).map((row) => row['Risk Rating']);
          setChartData(filteredRiskRating);
          const filteredYear = data.filter((row) => {
            return (selectedAsset ? row['Asset Name'] === selectedAsset : true) && (selectedBusinessCategory ? row['Business Category'] === selectedBusinessCategory : true);
          }).map((row) => row['Year']);
          setYearData(filteredYear);
        }
      }, [data, selectedAsset, selectedBusinessCategory]);
      
      

      useEffect(() => {
        const keyValuePairs = chartData.map((value, index) => {
          return { [value]: yearData[index] };
        });
      
        // Sort the key-value pairs in ascending order based on the value
        keyValuePairs.sort((a, b) => Object.values(a)[0] - Object.values(b)[0]);
      
        // Create separate arrays for keys and values
        const keysArray = keyValuePairs.map((pair) => Object.keys(pair)[0]);
        const valuesArray = keyValuePairs.map((pair) => Object.values(pair)[0]);
      
        setKeysArray(keysArray);
        setValuesArray(valuesArray);
      }, [chartData, yearData]);

      const handleAssetChange = (event) => {
        setSelectedAsset(event.target.value);
        setSelectedBusinessCategory(''); 
      };
      
      const handleBusinessChange = (event) => {
        setSelectedBusinessCategory(event.target.value);
        setSelectedAsset(''); 
      };   

  return (
    <div classname='chart'>
      <NavBar />
      <div className='dropdowns'>
      <div className='dropdown_asset'>
        <label htmlFor="Asset-select">Select an Asset : </label>
        <select id="Asset-select" value={selectedAsset} onChange={handleAssetChange}>
        <option value="">Select an Asset</option>
        {asset.map((name) => (
          <option key={name} value={name}>
            {name}
          </option>
        ))}
      </select>
    </div>
    <div className='dropdown_business'>
        <label htmlFor="Asset-select">Select a Business Category: </label>
        <select id="Asset-select" value={selectedBusinessCategory} onChange={handleBusinessChange}>
        <option value="">Select an Business Category</option>
        {businessCategory.map((name) => (
          <option key={name} value={name}>
            {name}
          </option>
        ))}
      </select>
    </div>
      </div>
          <Line className='graph' options={options} data={plotdata} />
    </div>
  )
}
