import React, { useState, useEffect } from 'react';
import { Dropdown } from 'primereact/dropdown';
import { Chart } from 'primereact/chart';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import './App.css';

const towersData = [
  { label: 'TWR0001', value: 'TWR0001' },
  { label: 'TWR0002', value: 'TWR0002' }
];

const App = () => {
  const [selectedTower, setSelectedTower] = useState(null);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [towerSignalData, setTowerSignalData] = useState([]);
  const [chartData, setChartData] = useState(null);

  const signalProperties = {
    TWR0001: [
      { label: 'Strength', value: 'signalStrength' },
      { label: 'Quality', value: 'signalQuality' },
      { label: 'Frequency', value: 'frequency' }
    ],
    TWR0002: [
      { label: 'Strength', value: 'signalStrength' },
      { label: 'Quality', value: 'signalQuality' },
      { label: 'Frequency', value: 'frequency' }
    ]
  };

  const fetchTowerData = async (towerId) => {
    if (towerId === 'TWR0001') {
      const response = await fetch('/tower1_data.json');
      const data = await response.json();
      setTowerSignalData(data.signalData);
    } else if (towerId === 'TWR0002') {
      const response = await fetch('/tower2_data.json');
      const data = await response.json();
      setTowerSignalData(data.signalData);
    }
  };

  useEffect(() => {
    if (selectedTower) {
      fetchTowerData(selectedTower);
    }
  }, [selectedTower]);

  useEffect(() => {
    if (selectedProperty && towerSignalData.length > 0) {
      const labels = towerSignalData.map((data) => data.timestamp);
      const data = towerSignalData.map((data) => data[selectedProperty]);

      const chartData = {
        labels,
        datasets: [
          {
            label: selectedProperty,
            data,
            fill: false,
            borderColor: '#42A5F5',
            tension: 0.4,
          },
        ],
      };

      setChartData(chartData);
    }
  }, [selectedProperty, towerSignalData]);

  return (
    <div className="App">
      <h1>Signal Tower Dashboard</h1>
      <div className="dropdown-container">
        <Dropdown
          value={selectedTower}
          options={towersData}
          onChange={(e) => setSelectedTower(e.value)}
          placeholder="Select a Tower"
        />
        {selectedTower && (
          <Dropdown
            value={selectedProperty}
            options={signalProperties[selectedTower]}
            onChange={(e) => setSelectedProperty(e.value)}
            placeholder="Select a Signal Property"
          />
        )}
      </div>

      {chartData && (
        <div className="chart-container">
          <Chart type="line" data={chartData} />
        </div>
      )}
    </div>
  );
};

export default App;
