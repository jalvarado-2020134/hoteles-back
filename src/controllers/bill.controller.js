'use strict'

const {validateData} = require('../utils/validate');
const User = require('../models/user.model');
const Hotel = require('../models/hotel.model');
const Reservation = require('../models/reservation.model');
const Room = require('../models/room.model');
const Bill = require('../models/bill.model');

exports.createBill = async (req,res)=>{
    try{
        const hotelId = req.params.idHotel
        const reservationId = req.params.idReservation
        const userId = req.user.sub 

        const checkReservationHotel = await Reservation.findOne({_id: reservationId, hotel: hotelId}).populate('hotel').populate('room').lean();
        if(checkReservationHotel == null || checkReservationHotel.hotel._id != hotelId){
            return res.status(400).send({message: 'You cant see this reservation'});
        }else{
            if(checkReservationHotel.state == 'Canceled'){
                await User.findOneAndUpdate({_id: checkReservationHotel.user},{$unset:{currentReservation: 1}},{new:true}).lean();
                await Room.findOneAndUpdate({_id: checkReservationHotel.room._id},{available: true, dateAvailable: 'Available'},{new:true}).lean();
                await Reservation.findOneAndUpdate({_id: reservationId},{state: 'Canceled and billed'},{new:true}).lean()
                return res.send({message: 'Reservation canceled billed'});
            }

            if(checkReservationHotel.state == 'Billed'){
                return res.status(400).send({message: 'Reservation already billed'});
            }

            if(checkReservationHotel.state == 'Canceled and Billed'){
                return res.status(400).send({message: 'Reservation canceled and billed'});
            }

            await Room.findOneAndUpdate({_id: checkReservationHotel.room._id},{available: true, dateAvailable: 'Available'},{new:true}).lean();
            await Reservation.findOneAndUpdate({_id: reservationId},{state: 'Billed'},{new:true}).lean()

            let data ={
                user: checkReservationHotel.user,
                hotel: checkReservationHotel.hotel._id,
                total: checkReservationHotel.totalPrice,
                reservation: reservationId
            }

            const bill = new Bill(data);
            console.log(bill);
            await bill.save();

            await User.findOneAndUpdate({_id: checkReservationHotel.user},{$unset:{currentReservation: 1},$push:{bill: bill._id}},{new:true}).lean();
            return res.send({message: 'Reservations billed'});
        }
    }catch(err){
        console.log(err)
        return err;
    }
}

exports.getBills = async(req,res)=>{
    try{
        const userId = req.user.sub
        const hotelId = req.params.idHotel

        const bills = await Bill.find({hotel: hotelId})
        .populate('user')
        .populate({path: 'reservation', populate:{path: 'room'}}).lean()

        for(let i = 0; i < bills.length; i++){
            delete bills[i].user.reservations
            delete bills[i].user.password
            delete bills[i].user.history
            delete bills[i].user.bill
            delete bills[i].user.role

            bills[i].reservation.startDate = new Date(bills[i].reservation.startDate).toISOString().split("T")[0];
            bills[i].reservation.endDate = new Date(bills[i].reservation.endDate).toISOString().split("T")[0];
        }

        return res.send({message: 'Bills', bills});
    }catch(err){
        console.log(err)
        return err;
    }
}

exports.getBill = async(req,res)=>{
    try{
        const userId = req.user.sub
        const hotelId = req.params.idHotel
        const billId = req.params.idBill

        const bill = await Bill.find({_id: billId, hotel: hotelId})
        .populate('user')
        .populate({path: 'reservation', populate:{path: 'room'}}).lean()

            delete bill[i].user.reservations
            delete bill[i].user.password
            delete bill[i].user.history
            delete bill[i].user.bill
            delete bill[i].user.role

            bill[i].reservation.startDate = new Date(bill[i].reservation.startDate).toISOString().split("T")[0];
            bill[i].reservation.endDate = new Date(bill[i].reservation.endDate).toISOString().split("T")[0];
        

        return res.send({message: 'Bill', bills});
    }catch(err){
        console.log(err)
        return err;
    }
}