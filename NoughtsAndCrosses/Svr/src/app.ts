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

import { Labels, Implementation } from './Game/EFSM'
import { Svr } from './Game/Svr';
import { Coordinate as Point } from './Game/GameTypes';

import { board, MoveResult } from './GameLogic';

const handleP1Move: Implementation.S13 = new Implementation.S13({
    Pos: async (move: Point) => {
        const result = await board.p1(move);
        switch (result) {
            case MoveResult.Win:
                board.clear();
                return new Implementation.S15(
                    // Send losing result to P2
                    [Labels.S15.Lose, [move], new Implementation.S16(
                        // Send winning result to P1
                        [Labels.S16.Win, [move], new Implementation.Terminal()]
                    )]
                );
            case MoveResult.Draw:
                board.clear();
                return new Implementation.S15(
                    [Labels.S15.Draw, [move], new Implementation.S17(
                        [Labels.S17.Draw, [move], new Implementation.Terminal()]
                    )]
                );
            case MoveResult.Continue:
                return new Implementation.S15(
                    [Labels.S15.Update, [move], new Implementation.S18(
                        [Labels.S18.Update, [move], handleP2Move]
                    )]
                )
        }
    }
});

const handleP2Move = new Implementation.S19({
    Pos: async (move: Point) => {
        const result = await board.p1(move);
        switch (result) {
            case MoveResult.Win:
                board.clear();
                return new Implementation.S20(
                    [Labels.S20.Lose, [move], new Implementation.S21(
                        [Labels.S21.Win, [move], new Implementation.Terminal()]
                    )]
                );
            case MoveResult.Draw:
                board.clear();
                return new Implementation.S20(
                    [Labels.S20.Draw, [move], new Implementation.S22(
                        [Labels.S22.Draw, [move], new Implementation.Terminal()]
                    )]
                );
            case MoveResult.Continue:
                return new Implementation.S20(
                    [Labels.S20.Update, [move], new Implementation.S23(
                        [Labels.S23.Update, [move], handleP1Move]
                    )]
                )
        }
    }
});

// ============
// Execute EFSM
// ============

new Svr(wss, handleP1Move, (role, reason) => {
    // Simple cancellation handler
    console.log(`${role} cancelled session because of ${reason}`);
});

const PORT = Number(process.env.PORT) || 8080;
server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`);
});