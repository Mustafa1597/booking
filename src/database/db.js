import pq from "pg";

const { Pool } = pq;

const pool = new Pool({
    host: "db",
    user: "root",
    password: "root",
    database: "booking",
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

export async function dbUp() {
    const tablesSQL = `
        CREATE TABLE IF NOT EXISTS users (
            id_user INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
            name VARCHAR(45) NOT NULL,
            email VARCHAR(45) UNIQUE NOT NULL
        );

        CREATE TABLE IF NOT EXISTS event (
            id_event INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
            name VARCHAR(45) NOT NULL,
            start_at TIMESTAMP,
            end_at TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS seat (
            id_seat INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
            id_event INT NOT NULL REFERENCES event (id_event),
            row INT NOT NULL,
            col INT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS reservation (
            id_reservation INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
            id_seat INT NOT NULL UNIQUE REFERENCES seat (id_seat),
            id_user INT NOT NULL REFERENCES users (id_user)
        );
    `;

    try {
        await pool.query(tablesSQL);
    } catch (e) {
        throw new Error(`failed to create tables -- ${e.message}`);
    }
}

export async function dbDown() {
    const dropTablesSQL = `
        DROP TABLE IF EXISTS reservation;
        DROP TABLE IF EXISTS seat;
        DROP TABLE IF EXISTS event;
        DROP TABLE IF EXISTS users;
    `;
    await pool.query(dropTablesSQL);
}

export async function dbFill() {
    const insertUserSQL = `
        INSERT INTO users (name, email) VALUES ($1, $2);
    `;
    for (let i = 0; i < 10; i++) {
        pool.query(insertUserSQL, [`user${i}`, `user${i}@test.com`]);
    }

    const insertEventSQL = `
        INSERT INTO event (name, start_at, end_at) VALUES ($1, $2, $3);
    `;
    for (let i = 0; i < 5; i++) {
        pool.query(insertEventSQL, [
            `event${i}`,
            "2025-02-14 10:30:00",
            "2025-02-15 10:30:00",
        ]);
    }

    const getAllEventsSQL = "SELECT * FROM event;";
    const rows = (await pool.query(getAllEventsSQL)).rows;
    const insertSeatSQL = `
        INSERT INTO seat (id_event, row, col) VALUES ($1, $2, $3);
    `;
    rows.forEach((event) => {
        for (let i = 0; i < 10; i++) {
            pool.query(insertSeatSQL, [
                event.id_event,
                Math.floor(Math.random() * 10),
                Math.floor(Math.random() * 10),
            ]);
        }
    });
}

export default pool;
