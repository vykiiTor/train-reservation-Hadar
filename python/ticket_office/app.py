from httpx import Client
import json


from flask import Flask, request


def create_app():
    app = Flask("ticket_office")

    @app.post("/reserve")
    def reserve():
        payload = request.json
        seat_count = payload["count"]
        train_id = payload["train_id"]

        client = Client()
        train_data = client.get(
            f"http://localhost:8081/data_for_train/" + train_id
        ).json()
        available_seats = (s for s in train_data["seats"].values() if s["coach"] == "A")
        to_reserve = []
        for i in range(seat_count):
            to_reserve.append(next(available_seats))
        booking_reference = client.get("http://localhost:8082/booking_reference").text

        seat_ids = [s["seat_number"] + s["coach"] for s in to_reserve]
        reservation = {
            "train_id": train_id,
            "booking_reference": booking_reference,
            "seats": seat_ids,
        }

        reservation_payload = {
            "train_id": reservation["train_id"],
            "seats": reservation["seats"],
            "booking_reference": reservation["booking_reference"],
        }

        response = client.post(
            "http://localhost:8081/reserve",
            json=reservation_payload,
        )
        assert response.status_code == 200, response.text
        response = response.json()

        return json.dumps(reservation)

    return app
