import axios from "axios";

const reserveSeat = async (seatIds, userId) => {
    try {
        const response = await axios.post(
            "http://localhost:3000/reservations",
            { seatIds, userId },
        );
        return { status: response.status, userId };
    } catch (error) {
        return { status: error.status, userId };
    }
};

const seatIds = [4, 5, 6]; // seat to reserve
const requests = [];

for (let userId = 1; userId <= 10; userId++) {
    requests.push(reserveSeat(seatIds, userId));
}

Promise.all(requests).then((statuses) => {
    const statusCounter = new Map();
    statuses.forEach((status) => {
        console.log(status.status, status.userId);
        statusCounter.set(status.status, (statusCounter.get(status) || 0) + 1);
    });

    const successCount = statusCounter.get(201) || 0;
    if (successCount > 1) {
        console.log(`Seat was reserved ${statusCounter.get(201)} times`);
    } else if (successCount < 1) {
        console.log("Seat was not reserved");
    } else {
        console.log("Success");
    }
});
