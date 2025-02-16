import express from "express";

import { sleep } from "../utils.js";
import { subscriptions } from "../server.js";
import {
    cancelReservation,
    makeReservations,
} from "../database/queries/reservations/modifiers.js";
import {
    getReservation,
    getReservationsAll,
} from "../database/queries/reservations/accessors.js";
import { getSeatsByIds } from "../database/queries/events/accessors.js";

const reservationsRouter = express.Router();

reservationsRouter.get("/", async (req, res) => {
    try {
        const reservations = await getReservationsAll();
        res.json(reservations);
    } catch (e) {
        res.status(400).json({ message: "failed" });
    }
});

reservationsRouter.post("/", async (req, res) => {
    const seatIds = req.body.seatIds;
    const userId = req.body.userId;

    // to mimic network delays
    await sleep(Math.random() * 10);

    const seats = await getSeatsByIds(seatIds);

    // check invalid seat ids
    if (seats.length < seatIds.length) {
        const invalidIds = seatIds.filter(
            (seatId) =>
                seats.findIndex((seat) => seat.id_seat === seatId) === -1,
        );
        res.status(404).json({
            message: `invalid seats ${invalidIds}`,
        });
        return;
    }

    // make sure all seats are part of the same event
    const eventIds = new Set(seats.map((seat) => seat.id_event));
    if (eventIds.size > 1) {
        res.status(400).json({
            message: "seats should be part of the same event",
        });
        return;
    }

    try {
        await makeReservations(seatIds, userId);
        subscriptions.forEach((subscription) => {
            subscription.send(JSON.stringify({ reserved: seatIds }));
        });
        res.status(201).json({ message: "success" });
    } catch (e) {
        res.status(400).json({ message: e.message });
    }
});

reservationsRouter.delete("/:id_reservation", async (req, res) => {
    const reservationId = req.params.id_reservation;
    try {
        const reservation = await getReservation(reservationId);
        if (!reservation) {
            res.status(404).json({ message: "not found" });
            return;
        }

        await cancelReservation(reservationId);
        subscriptions.forEach((subscription) => {
            subscription.send(
                JSON.stringify({ cancelled: reservation.id_seat }),
            );
        });
        res.status(200).json({ message: "reservation cancelled" });
    } catch (e) {
        res.status(400).json({ message: "cancelation failed" });
    }
});

export default reservationsRouter;
