import pool from "../../db.js";

export async function getReservationsAll() {
    const getReservationsSQL = "SELECT * FROM reservation;";
    const res = await pool.query(getReservationsSQL);

    return res.rows;
}

export async function getReservation(reservationId) {
    const getReservationsSQL =
        "SELECT * FROM reservation WHERE id_reservation = $1;";
    const res = await pool.query(getReservationsSQL, [reservationId]);
    const reservations = res.rows;

    if (reservations.length === 0) {
        return null;
    }

    return reservations[0];
}
