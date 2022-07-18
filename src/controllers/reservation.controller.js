'use strict'

const User = require('../models/user.model');
const Hotel = require('../models/hotel.model');
const Room = require('../models/room.model');
const Service = require('../models/service.model');
const Reservation = require('../models/reservation.model');
const { validateData, checkUpdateReservation } = require('../utils/validate');


exports.makeReservation = async (req,res)=>{
    try{
        const userId = req.user.sub;
        const params = req.body;
        const serviceId = req.body.idService;
        const data ={
            room: params.room,
            service: params.service,
            startDate: params.startDate,
            endDate: params.endDate,
            user: params.user,
            totalPrice: params.totalPrice,
            state: params.state,
            hotel: params.hotel
        }

        const msg = validateData(data);
        if(!msg){
            const checkHotel = await Hotel.findOne({_id: data.hotel});
            if(!checkHotel){
                return res.status(400).send({message: 'User not found'});
            }else{
                const checkRoom = await Room.findOne({_id: data.room});
                if(!checkRoom){
                    return res.status(400).send({message: 'Room not found'});
                }else{
                    const reservation = new Reservation(data);
                    const reservationSaved = await reservation.save();
                    await Service.findOneAndUpdate({_id: serviceId},{$push:{services: reservationSaved}})
                    return res.send({message: 'Reservation maked successfully'})
                }
            }
        }

    }catch(err){
        console.log(err)
        return err;
    }
}

exports.getReservation = async(req,res)=>{
    try{
        const reservationId = req.params.id;
        const reservation = await Reservation.findOne({_id: reservationId}).lean().populate('service');
        if(!reservation) return res.status(404).send({message: 'Reservation not found'});
        return res.send({message: 'Your reservations', reservation});

    }catch(err){
        console.log(err)
        return err;
    }
}

exports.getReservations = async (req,res)=>{
    try{
        const hotelId = req.params.idHotel;
        const userId = req.params.sub;

        const check = await Hotel.findOne({_id: hotelId});
        if(!check){
            return res.status(404).send({message: 'Hotel not found'});
        }else{
            const reservations = await Reservations.find({hotel: hotelId}).populate('hotel').lean();
            if(!reservations){
                return res.status(400).send({message: 'Reservations not found'});
            }else{
                return res.send({message: 'Your reservations', reservations})
            }
        }
    }catch(err){
        console.log(err)
        return err;
    }
}

exports.deleteReservation = async(req,res)=>{
    try{
        const hotelId = req.params.idHotel;
        const reservationId = req.params.idReservation;

        const checkHotel = await Hotel.findOne({_id: hotelId});
        if(!checkHotel){
            return res.status(400).send({message: 'Hotel not found'});
        }else{
            const check = await Reservation.findOne({_id: reservationId, hotel: hotelId}).populate('hotel').lean();
            if(check == null || check.hotel._id != hotelId){
                return res.status(400).send({message: 'Reservation can not be deleted'})
            }else{
                const deleteReservation = await Reservation.findOneAndDelete({_id: reservationId, hotel: hotelId}).populate('hotel').lean()
                if(!deleteReservation){
                    return res.status(400).send({message: 'Reservation not found'})
                }else{
                    return res.send({message: 'Reservation deleted successfully', deleteReservation})
                }
            }
        }
    }catch(err){
        console.log(err)
        return err;
    }
}