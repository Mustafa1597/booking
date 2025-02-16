import pool from "../../db.js";

export async function getEventsAll() {
    const getEventsSQL = "SELECT * FROM event;";
    const res = await pool.query(getEventsSQL);

    return res.rows;
}

export async function getSeatsByIds(seatIds) {
    const getEventsSQL = "SELECT * FROM seat WHERE id_seat = ANY($1);";
    const res = await pool.query(getEventsSQL, [
        seatIds.map((id) => parseInt(id)),
    ]);

    return res.rows;
}

export async function getEventSeatsAll(eventId) {
    const getEventSeatsSQL = `
        SELECT 
            seat.*,
            CASE
                WHEN reservation.id_seat IS NULL THEN false
                ELSE true
            END AS is_reserved
        FROM seat LEFT JOIN reservation ON reservation.id_seat = seat.id_seat
        WHERE id_event = $1;
    `;
    const res = await pool.query(getEventSeatsSQL, [eventId]);

    return res.rows;
}
