import express from 'express'
import fetch from 'node-fetch'
import morgan from 'morgan'
import { Seat } from './seat'

//cette partie la reste dans app en fait
class Resp{
    private count;
    private trainId;

    constructor(count: any, trainId:any) {
        this.count = count;
        this.trainId = trainId;
    }

    async makeReservation(){
        let response = await fetch('http://localhost:8082/booking_reference');
        const bookingReference = await response.text();
  
        response = await fetch(`http://localhost:8081/data_for_train/${this.trainId}`);
        const train = await response.json();
        const seatsInTrain: Seat[] = Object.values(train.seats);
  
        // sauf ici ca c'est a extraire 
        const availableSeats = seatsInTrain.filter(s => s.coach === 'A').filter(s => !s.booking_reference);
  
        const toReserve = availableSeats.slice(0, this.count);
        const seatIds = toReserve.map(s => `${s.seat_number}${s.coach}`);
        const reservation = {
          booking_reference: bookingReference,
          seats: seatIds,
          train_id: this.trainId,
        };
        
  
        return reservation;
        }
}

export {Resp}