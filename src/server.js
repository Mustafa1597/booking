import { WebSocketServer } from "ws";
import express from "express";

import reservationsRouter from "./routers/reservations.js";
import eventsRouter from "./routers/events.js";
import { dbUp, dbDown, dbFill } from "./database/db.js";

async function setupDB() {
    await dbDown();
    await dbUp();
    dbFill();
}

export const subscriptions = new Set();

async function start() {
    setupDB();

    const app = express();
    app.use(express.json());

    app.use("/events", eventsRouter);
    app.use("/reservations", reservationsRouter);

    const server = app.listen(3000);
    const wss = new WebSocketServer({ server });

    wss.on("connection", (ws, req) => {
        console.log("connecting");
        subscriptions.add(ws);

        ws.on("close", () => {
            subscriptions.delete(ws);
        });
    });
}

start();
