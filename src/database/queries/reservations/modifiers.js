import pool from "../../db.js";

export async function makeReservations(seatIds, userId) {
    const makeReservationSQL =
        "INSERT INTO reservation (id_seat, id_user) VALUES ($1, $2);";

    const client = await pool.connect();
    try {
        await client.query("BEGIN");
        for (const seatId of seatIds) {
            try {
                await client.query(makeReservationSQL, [seatId, userId]);
            } catch (e) {
                throw new Error(`already reserved ${seatId}`);
            }
        }
        await client.query("COMMIT");
    } catch (e) {
        await client.query("ROLLBACK");
        throw e;
    } finally {
        client.release();
    }
}

export async function cancelReservation(reservationId) {
    const cancelReservationSQL =
        "DELETE FROM reservation WHERE id_reservation = $1;";
    await pool.query(cancelReservationSQL, [reservationId]);
}
