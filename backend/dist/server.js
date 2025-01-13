//This will be the main server file to handle WebSocket connections and disaster alert endpoints.
// import express from 'express';
const express = require('express');
import WebSocket from 'ws';
import { subscribeToChannel, publishMessage } from './redisPubSub';
import { fetchDisasterData } from './fetchDisasters';
const app = express();
const PORT = 5000;
// WebSocket server
const server = app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
const wss = new WebSocket.Server({ server });
// Fetch disaster data periodically (e.g., every 10 minutes)
setInterval(fetchDisasterData, 600000); // 10 minutes in milliseconds
// Subscribe to Redis channel for real-time alerts
subscribeToChannel('disaster-alerts', (alert) => {
    console.log('Broadcasting alert:', alert);
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(alert));
        }
    });
});
// Optional: Endpoint to fetch cached disasters
app.get('/api/disasters/cached', async (req, res) => {
    const data = await fetchDisasterData();
    res.status(200).json(data);
});
// Endpoint to manually publish an alert
app.post('/api/alert', express.json(), async (req, res) => {
    const alert = req.body;
    const channel = 'disaster-alerts';
    await publishMessage(channel, alert);
    res.status(200).send({ message: 'Alert published' });
});
