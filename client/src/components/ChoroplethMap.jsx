import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON, Tooltip } from 'react-leaflet';
import API from '../api';
import './ChoroplethMap.css';

const Legend = () => {
  const legendItems = [
    { color: '#800026', label: '> 1,000,000' },
    { color: '#BD0026', label: '500,001 - 1,000,000' },
    { color: '#E31A1C', label: '200,001 - 500,000' },
    { color: '#FC4E2A', label: '100,001 - 200,000' },
    { color: '#FD8D3C', label: '50,001 - 100,000' },
    { color: '#FEB24C', label: '10,001 - 50,000' },
    { color: '#FED976', label: '1 - 10,000' },
    { color: '#FFEDA0', label: '0' },
    { color: '#ccc', label: 'No Data' }
  ];

  return (
    <div className="map-legend">
      <h4>Legend</h4>
      <ul>
        {legendItems.map((item, i) => (
          <li key={i}>
            <span className="legend-color" style={{ background: item.color }}></span>
            {item.label}
          </li>
        ))}
      </ul>
    </div>
  );
};

const ChoroplethMap = ({ year }) => {
  const [geoData, setGeoData] = useState(null);
  const [malariaData, setMalariaData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/africa.geojson')
      .then(res => res.json())
      .then(data => {
        setGeoData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('GeoJSON loading error:', err);
        setError('Failed to load map data');
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!year) return;

    setLoading(true);
    API.get('/map-data', { params: { year } })
      .then(res => {
        if (Array.isArray(res.data)) {
          setMalariaData(res.data);
        } else {
          setMalariaData([]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Map data error:', err);
        setError('Failed to load malaria data');
        setLoading(false);
      });
  }, [year]);

  const getCountryColor = (iso3) => {
    const country = malariaData.find(c => c.country_code?.trim().toUpperCase() === iso3?.trim().toUpperCase());
    if (!country) return '#ccc';

    const cases = country.cases;
    if (cases > 1000000) return '#800026';
    if (cases > 500000) return '#BD0026';
    if (cases > 200000) return '#E31A1C';
    if (cases > 100000) return '#FC4E2A';
    if (cases > 50000) return '#FD8D3C';
    if (cases > 10000) return '#FEB24C';
    if (cases > 0) return '#FED976';
    return '#FFEDA0';
  };

  const onEachCountry = (feature, layer) => {
    const iso3 = feature.properties["ISO3166-1-Alpha-3"];
    const country = malariaData.find(c => c.country_code?.trim().toUpperCase() === iso3?.trim().toUpperCase());
    const name = feature.properties.ADMIN || feature.properties.name || "Unknown";

    layer.setStyle({
      fillColor: getCountryColor(iso3),
      fillOpacity: 0.5,
      color: 'white',
      weight: 1,
    });

    const tooltip = country
      ? `<strong>${name}</strong><br/>Malaria Cases: ${country.cases.toLocaleString()}`
      : `<strong>${name}</strong><br/>No data (ISO3: ${iso3})`;

    layer.bindTooltip(tooltip, { sticky: true });
  };

  return (
    <div className="map-legend-wrapper">
      <div className="map-container">
        <h2 className='map-title'>Malaria Case Intensity by Country ({year})</h2>
        {loading && <p>Loading map and data...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {!loading && !error && geoData && malariaData.length > 0 && (
          <MapContainer center={[1, 20]} zoom={3.5} style={{ height: '500px', width: '100%' }}>
            <TileLayer
              attribution='&copy; OpenStreetMap contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <GeoJSON data={geoData} onEachFeature={onEachCountry} />
          </MapContainer>
        )}
      </div>

      <Legend />
    </div>
  );
};

export default ChoroplethMap;
