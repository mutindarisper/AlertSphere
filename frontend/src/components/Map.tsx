import React, { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css'; // Import Mapbox styles

mapboxgl.accessToken = 'pk.eyJ1IjoibXV0aW5kYXJpc3BlciIsImEiOiJjbTV2Z203NTUwMXk1Mmlxemwzd2UxaWZ3In0.z-h0QqdCCzTUT2C9xEpQfQ'; // Replace with your actual token

const MapboxMap: React.FC = () => {
    const mapContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Initialize the map
        const map = new mapboxgl.Map({
            container: mapContainerRef.current!, // Container ID
            style: 'mapbox://styles/mapbox/streets-v11', // Map style
            center: [-74.5, 40], // Starting position [lng, lat]
            zoom: 9, // Starting zoom
        });

        // Cleanup on component unmount
        return () => map.remove();
    }, []);

    return (
        <div className="w-full h-full" ref={mapContainerRef} /> // Tailwind utility classes
    );
};

export default MapboxMap;
