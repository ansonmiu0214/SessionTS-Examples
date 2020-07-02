// =============
// Set up server
// =============

import http from 'http';
import express from 'express';
import WebSocket from 'ws';

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// ==================
// Implement protocol
// ==================

import { Labels, Implementation } from './TwoBuyer/EFSM'
import { S } from './TwoBuyer/S';
import { getQuote } from './Inventory';

const logic: Implementation.Initial = new Implementation.Initial({
    'title': async (title) => {
        const quote = await getQuote(title);
        return new Implementation.S34([
            Labels.S34.quote, [quote], new Implementation.S35([
                Labels.S35.quote, [quote], new Implementation.S36({
                    'buy': () => {
                        console.log('Buyer A decided to buy!');
                        return new Implementation.Terminal();
                    },
                    'cancel': () => {
                        console.log('Buyer A cancelled!');
                        return new Implementation.Terminal();
                    }
                })
            ])
        ])
    }
});

// ============
// Execute EFSM
// ============

new S(wss, logic, (role, reason) => {
    // Simple cancellation handler
    console.log(`${role} cancelled session because of ${reason}`);
});

const PORT = Number(process.env.PORT) || 8080;
server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`);
});