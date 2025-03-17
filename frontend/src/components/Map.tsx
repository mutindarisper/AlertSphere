import React, { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css'; // Import Mapbox styles
import axios from 'axios';
import alert from "../assets/icons/alert.png"; // Assuming this is your custom icon
import fire from "../assets/icons/wildfire.png"
import flood from "../assets/icons/flood.png"
import earthquake from "../assets/icons/earthquake.png"
import volcano from "../assets/icons/volcano.png"
import drought from "../assets/icons/drought.png"

import { style } from 'framer-motion/client';

interface Alert {
  lon: number;
  lat: number;
  title: string;
}

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN; // Replace with your actual token

const MapboxMap: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map>();

  useEffect(() => {
    // Initialize the map
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current!, // Container ID
      style: 'mapbox://styles/mapbox/streets-v11', // Map style
      center: [36.8, -1.26], // Starting position [lng, lat]
      zoom: 2, // Starting zoom
    });

    fetchAlerts(); // Fetch alerts when the map is ready

    // Cleanup on component unmount
    return () => mapRef.current?.remove();
  }, []);

  async function fetchAlerts() {
    const response = await axios.get(
      "https://www.gdacs.org/gdacsapi/api/events/geteventlist/SEARCH?fromDate=2025-01-01&toDate=2025-03-14&alertlevel=&eventlist=EQ;FL;DR;VO;WF&country="
    );
    console.log(response.data);

   
     // Add markers to the map.
     for (const marker of response.data.features) {
        // Create a DOM element for each marker.
        const el = document.createElement('div');
        const width = 50;
        const height = 50;
        el.className = 'marker';
        el.style.backgroundImage = `url(${alert})`;
        // el.style.backgroundImage = marker.properties.eventtype === "EQ" ? `url(${earthquake})` : 
        // marker.properties.eventtype === "FL" ? `url(${flood})` :
        //  marker.properties.eventtype === "DR" ? `url(${drought})` :
        //   marker.properties.eventtype === "VO" ? `url(${volcano})` : marker.properties.eventtype === "WF" ? `url(${fire})` : `url(${alert})`;
        el.style.width = `${width}px`;
        el.style.height = `${height}px`;
        el.style.backgroundSize = "100%";
        el.style.display = "block";
        el.style.border = "none";
        el.style.borderRadius = "50%";
        el.style.cursor = "pointer";

        // el.addEventListener('click', () => {
        //     window.alert(marker.properties.message);
        // });

        console.log(marker.geometry.coordinates)
        // Add markers to the map.
        if (
            Array.isArray(marker.geometry.coordinates) &&
            marker.geometry.coordinates.length === 2 &&
            typeof marker.geometry.coordinates[0] === 'number' &&
            typeof marker.geometry.coordinates[1] === 'number'
          ) {

            // Create a popup with the event details
        const popup = new mapboxgl.Popup({ offset: 25 }) // Offset to position correctly
        .setHTML(`
            <div style="color:black;">
                <h3 style="font-weight:bold; margin-bottom:5px; border-radius:30px; ">${marker.properties.eventtype || "Event"}</h3>
                <p>${marker.properties.htmldescription || "No details available"}</p>
            </div>
        `);
            new mapboxgl.Marker(el)
              .setLngLat(marker.geometry.coordinates as [number, number])
              .setPopup(popup)
              .addTo(mapRef.current!);
          } else {
            console.error('Invalid coordinates:', marker.geometry.coordinates);
          }

            
    }

  }

  return <div className="w-full h-full" ref={mapContainerRef} />; // Tailwind utility classes
};

export default MapboxMap;

