'use strict'

const User = require('../models/user.model');
const Hotel = require('../models/hotel.model');
const Room = require('../models/room.model');
const Service = require('../models/service.model');
const Reservation = require('../models/reservation.model');
const Validate = require('../utils/validate');
const { validateData } = require('../models/service.model');
const { param } = require('../routes/user.routes');


exports.makeReservation = async (req,res)=>{
    try{
        const user = req.user.sub;
        const params = req.body;
        const hotelId = req.params.id;
        const data ={
            room: params.room,
            service: params.service,
            startDate: params.startDate,
            endDate: params.endDate,
            user: params.user,
            totalPrice: 0,
            state: params.state
        }

        let msg = validateData(data);
        if(!msg){

            const checkRoom = await Room.findOne({_id: data.room});
            if(checkRoom === null || checkRoom.id != hotelId){
                return res.status(400).send({message: 'Reservations cant be add to this room'});
            }else{
                const hotel = await Hotel.findOne({_id: hotelId});
                const checkReservation = await Reservation.findOne({
                    $and:[

                        {room: data.room}
                    ]
                });
                if(checkReservation)return res.send({message: 'Reservation already maked'});
                const reservationAlready = await Reservation.findOne({
                    $and: [
                        {room: data.room},
                        {startDate: data.date},
                        {endDate: params.date},
                    ]
                });
                if(reservationAlready) return res.send({message: 'Reservation exist in this date'});
                const reservation = new Reservation(data);
                await reservation.save();
                return res.send({message: 'Reservation maked successfully', reservation});
            }
        }else{
            return res.status(400).send(msg);
        }
    }catch(err){
        console.log(err)
        return err;
    }
}