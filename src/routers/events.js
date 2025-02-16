import express from "express";

import {
    getEventSeatsAll,
    getEventsAll,
} from "../database/queries/events/accessors.js";

const eventsRouter = express.Router();

eventsRouter.get("/", async (req, res) => {
    const events = await getEventsAll();
    res.json(events);
});

eventsRouter.get("/:id_event/seats", async (req, res) => {
    try {
        const seats = await getEventSeatsAll(req.params.id_event);
        res.json(seats);
    } catch (e) {
        res.status(400).json({ message: "failed" });
    }
});

export default eventsRouter;
