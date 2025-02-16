# Booking

This is a Node.js, PostgreSQL backend for a booking app.

## Available Features

-   Ability to list available events and seats.
-   Ability to reserve seats and cancel reservations.
-   Real-time availability updates. Users get notified when a seat is reserved or when a reservation is canceled.
-   Concurrency handling: It's guaranteed that a seat will be reserved only to one single user if multiple users are trying to reserve it at the same time.
-   Error handling and proper error messages.

## How To Install

To run the app, you first need to have Docker installed. After cloning the repo, run `docker compose up`, and you're all set.

## API

This app contains four main APIs:

-   `GET /events`: Returns all the available events.
-   `GET /events/:id_event/seats`: Returns the `id_event` event seats along with their current status `is_reserved`.
-   `POST /reservations`: Accepts two parameters, `seatIds` and `userId`: the IDs of the seats to be reserved and the user ID.
-   `DELETE /reservations/:id_reservation`: Cancels the specified reservation.

### Testing Race Conditions Handling

I included a test file to check proper handling for race conditions and double booking prevention.

The script tries to send 10 reservation requests for the same seat from different users concurrently and checks if only one request succeeds.

To run it, make sure the server is up and running, then run `node tests/test_double_booking.js` multiple times and check the results.

NOTE: I reset the DB status each time the app reloads.
