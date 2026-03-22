import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { hubliStores, haversineDistance } from '../data/hubliStores';
import { cultivationStates } from '../data/milletCultivationStates';

// Fix Leaflet's default icon issue in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// A component to dynamically change map view when mode switches
const ChangeView = ({ center, zoom }) => {
  const map = useMap();
  map.setView(center, zoom);
  return null;
};

const MapView = () => {
  const [mode, setMode] = useState('stores'); // 'stores' or 'cultivation'
  const [userLocation, setUserLocation] = useState(null);
  const [stores, setStores] = useState(hubliStores);

  const hubliCenter = [15.3647, 75.1240];
  const indiaCenter = [20.5937, 78.9629];

  useEffect(() => {
    // Try to get user's actual location if mode is stores
    if (mode === 'stores' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
          
          // Sort stores by distance
          const sortedStores = [...hubliStores].map(store => {
            const distance = haversineDistance(latitude, longitude, store.lat, store.lng);
            return { ...store, distance };
          }).sort((a, b) => a.distance - b.distance);
          
          setStores(sortedStores);
        },
        (error) => {
          console.warn("Geolocation denied or unavailable. Using default Hubli center.");
          const sortedStores = [...hubliStores].map(store => {
            const distance = haversineDistance(hubliCenter[0], hubliCenter[1], store.lat, store.lng);
            return { ...store, distance };
          }).sort((a, b) => a.distance - b.distance);
          setStores(sortedStores);
        }
      );
    }
  }, [mode]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
      <div className="text-center max-w-3xl mx-auto mb-10">
        <span className="text-secondary font-bold tracking-widest uppercase text-sm mb-3 block">Geospatial Intelligence</span>
        <h1 className="text-4xl md:text-5xl font-heading font-bold text-primary mb-6">Millet Directory Lens</h1>
        <p className="text-lg text-stone-600">
          Discover local millet stores near you or explore the vast cultivation landscape across India.
        </p>
      </div>

      <div className="flex justify-center mb-10">
        <div className="bg-white rounded-full shadow-sm border border-stone-200 p-1 flex">
          <button 
            onClick={() => setMode('stores')}
            className={`px-8 py-3 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${mode === 'stores' ? 'bg-primary text-white shadow-md' : 'text-stone-500 hover:text-stone-800'}`}
          >
            🏪 Store Locator Hubli
          </button>
          <button 
            onClick={() => setMode('cultivation')}
            className={`px-8 py-3 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${mode === 'cultivation' ? 'bg-secondary text-white shadow-md' : 'text-stone-500 hover:text-stone-800'}`}
          >
            🌾 India Cultivation Map
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
         <div className="lg:col-span-8 bg-white p-2 rounded-3xl shadow-lg border border-stone-100 overflow-hidden h-[600px] z-10 relative">
            <MapContainer 
              center={mode === 'stores' ? hubliCenter : indiaCenter} 
              zoom={mode === 'stores' ? 12 : 5} 
              style={{ height: '100%', width: '100%', borderRadius: '1.25rem' }}
            >
              <ChangeView center={mode === 'stores' ? (userLocation || hubliCenter) : indiaCenter} zoom={mode === 'stores' ? 13 : 5} />
              
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                // A clean, bright tileset from Carto
              />

              {mode === 'stores' && stores.map(store => (
                <Marker key={store.id} position={[store.lat, store.lng]}>
                  <Popup className="custom-popup">
                    <div className="text-center font-sans p-1">
                      <h3 className="font-bold text-primary text-sm mb-1">{store.name}</h3>
                      <p className="text-stone-500 text-xs mb-2">{store.address}</p>
                      {store.distance !== undefined && (
                        <span className="inline-block bg-accent/20 text-accent font-bold px-2 py-0.5 rounded-full text-[10px]">
                          {store.distance.toFixed(1)} km away
                        </span>
                      )}
                    </div>
                  </Popup>
                </Marker>
              ))}

              {mode === 'stores' && userLocation && (
                <CircleMarker 
                  center={userLocation} 
                  pathOptions={{ color: '#E63946', fillColor: '#E63946', fillOpacity: 0.5 }} 
                  radius={8}
                >
                  <Popup>You are here</Popup>
                </CircleMarker>
              )}

              {mode === 'cultivation' && cultivationStates.map(state => (
                <CircleMarker 
                  key={state.name} 
                  center={state.center} 
                  pathOptions={{ 
                    color: state.volume === 'Highest' ? '#D4A017' : '#40916C', 
                    fillColor: state.volume === 'Highest' ? '#D4A017' : '#40916C', 
                    fillOpacity: 0.6 
                  }} 
                  radius={state.volume === 'Highest' ? 24 : state.volume === 'High' ? 18 : 12}
                >
                  <Popup>
                    <div className="font-sans p-2">
                       <h3 className="font-bold text-primary text-base mb-1">{state.name}</h3>
                       <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-sm mb-3 inline-block ${state.volume === 'Highest' ? 'bg-accent/20 text-accent' : 'bg-secondary/20 text-secondary'}`}>
                         {state.volume} Volume
                       </span>
                       <p className="text-stone-600 text-xs mb-3 italic">{state.description}</p>
                       <div className="flex flex-wrap gap-1">
                         {state.millets.map(m => (
                           <span key={m} className="text-[9px] bg-stone-100 border border-stone-200 text-stone-600 px-1.5 py-0.5 rounded">{m}</span>
                         ))}
                       </div>
                    </div>
                  </Popup>
                </CircleMarker>
              ))}
            </MapContainer>
         </div>

         <div className="lg:col-span-4 bg-white rounded-3xl shadow-sm border border-stone-100 p-6 flex flex-col h-[600px] overflow-hidden">
            <h3 className="text-xl font-bold text-stone-800 mb-6 font-heading flex items-center gap-2 pb-4 border-b border-stone-100">
               {mode === 'stores' ? '📍 Nearby Hubli Stores' : '🗺️ State Insights'}
            </h3>
            
            <div className="overflow-y-auto flex-grow pr-2 space-y-4 filter-list">
              {mode === 'stores' ? (
                stores.map((store, idx) => (
                  <div key={store.id} className="p-4 bg-stone-50 rounded-2xl border border-stone-100 hover:border-secondary/30 transition-colors group">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-bold text-stone-800 group-hover:text-primary transition-colors text-sm">{idx + 1}. {store.name}</h4>
                      {store.distance !== undefined && (
                        <span className="text-xs font-bold text-secondary bg-secondary/10 px-2 py-0.5 rounded">
                          {store.distance.toFixed(1)} km
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-stone-500">{store.address}</p>
                  </div>
                ))
              ) : (
                cultivationStates.map(state => (
                  <div key={state.name} className="p-4 bg-stone-50 rounded-2xl border border-stone-100 hover:border-secondary/30 transition-colors group">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-bold text-stone-800 group-hover:text-primary transition-colors">{state.name}</h4>
                      <span className={`w-3 h-3 rounded-full ${state.volume === 'Highest' ? 'bg-accent' : 'bg-secondary'}`}></span>
                    </div>
                    <p className="text-xs text-stone-600 mb-3">{state.description}</p>
                    <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Key Crops</p>
                    <p className="text-xs text-stone-500 font-medium">{state.millets.join(', ')}</p>
                  </div>
                ))
              )}
            </div>
         </div>
      </div>
    </div>
  );
};

export default MapView;
