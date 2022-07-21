'use strict'

const User = require('../models/user.model')
const Hotel = require('../models/hotel.model')
const Room = require('../models/room.model')
const Reservation = require('../models/reservation.model')
const { validateData } = require('../utils/validate');

exports.makeReservation = async (req, res) => {
    try {
        const userId = req.user.sub
        const hotel = req.params.idHotel
        const params = req.body;
        const data = {
            startDate: params.startDate,
            user: req.user.sub,
            endDate: params.endDate,
            hotel: req.params.idHotel,
            room: params.room,
            totalPrice: 0
        }

        const msg = validateData(data);
        if (msg) return res.status(400).send(msg);

        const userExist = await User.findOne({ _id: userId });
        if (!userExist) return res.status(400).send({ message: 'User not found' });

        const checkHotel = await Hotel.findOne({ _id: hotel });
        if (checkHotel == null || checkHotel.id != hotel) return res.status(400).send({ message: 'hotel not found' });

        const checkRoom = await Room.findOne({ _id: data.room, hotel: hotel })
        if (!checkRoom)
            return res.status(400).send({ message: 'Room not found' });
        if (checkRoom.available == false)
            return res.status(400).send({ message: `This room is reserved until ${checkRoom.dateAvailable}` });


        let date1 = new Date(data.startDate)
        let date2 = new Date(data.endDate)
        if (date1 == 'Invalid Date' || date2 == 'Invalid Date') {
            return res.status(400).send({ message: 'Invalid dates' })
        } else {
            let today = new Date().toISOString().split("T")[0]
            today = new Date(today)
            let differenceToday = date1.getTime() - today.getTime()
            if (differenceToday < 0) {
                return res.status(400).send({ message: 'Start Date to low' })
            } else {
                let difference = date2.getTime() - date1.getTime();
                if (difference < 0) {
                    return res.status(400).send({ message: 'End Date had to be higher than Start Date' })
                } else {
                    if (difference == 0) {
                        return res.status(400).send({ message: 'You cant set the same dates' });
                    }
                    let totalDays = Math.ceil(difference / (1000 * 3600 * 24));
                    data.totalPrice = checkRoom.price * totalDays
                    
                    data.state = 'In Progress'

                    const reservation = new Reservation(data)
                    await reservation.save();
                    

                    let getTimesRequested = checkHotel.timesRequest + 1

                    await Hotel.findOneAndUpdate({ _id: hotel }, { timesRequest: getTimesRequested }, { new: true }).lean()
                    await Room.findOneAndUpdate({ _id: data.room, hotel: hotel }, { available: false, dateAvailable: date2.toISOString().split("T")[0] }, { new: true }).lean()
                    await User.findOneAndUpdate({ _id: req.user.sub }, { currentReservation: reservation._id, $push: { reservation: reservation._id, history: hotel } }, { new: true }).lean();

                    return res.send({ message: 'Reservation maked', reservation })
                }
            }
        }







    } catch (err) {
        console.log(err)
        return err;
    }
}



exports.getReservations = async (req, res) => {
    try {
        const hotelId = req.params.idHotel;
        const userId = req.user.sub;

        const reservations = await Reservation.find({ hotel: hotelId}).populate('room').populate('user').populate('hotel').lean();
        if (!reservations){
            return res.status(400).send({ message: 'Reservations not found' });
        } else{

        
        for (let i = 0; i < reservations.length; i++) {
            
            

            reservations[i].startDate = new Date(reservations[i].startDate).toISOString().split("T")[0];
            reservations[i].endDate = new Date(reservations[i].endDate).toISOString().split("T")[0];
        }

        return res.send({ message: 'Reservations found', reservations });
    }
    } catch (err) {
        console.log(err)
        return err;
    }
}

exports.reservationsInProgress = async (req, res) => {
    try {
        const hotelId = req.params.idHotel;
        const userId = req.user.sub;

        const reservations = await Reservation.find({ hotel: hotelId, state: 'In Progress' }).populate('user').populate('room').lean();
        if (!reservations) {
            return res.status(400).send({ message: 'Reservations not found' });
        } else {
            for (let i = 0; i < reservations.length; i++) {
                

                reservations[i].startDate = new Date(reservations[i].startDate).toISOString().split("T")[0];
                reservations[i].endDate = new Date(reservations[i].endDate).toISOString().split("T")[0];
            }

            return res.send({ message: 'Reservations in progress', reservations });

        }

    } catch (err) {
        console.log(err)
        return err;
    }
}

exports.reservationsBilled = async (req, res) => {
    try {
        const hotelId = req.params.idHotel;
        const userId = req.user.sub;

        const reservations = await Reservation.find({ hotel: hotelId, state: 'Billed' }).populate('user').populate('room').lean();
        if (!reservations) {
            return res.status(400).send({ message: 'Reservations not found' });
        } else {
            for (let i = 0; i < reservations.length; i++) {
                delete reservations[i].user.password
                delete reservations[i].user.reservations
                delete reservations[i].user.history
                delete reservations[i].user.bill
                delete reservations[i].user.currentReservation
                delete reservations[i].user.role

                reservations[i].startDate = new Date(reservations[i].startDate).toISOString().split("T")[0];
                reservations[i].endDate = new Date(reservations[i].endDate).toISOString().split("T")[0];
            }

            return res.send({ message: 'Reservations billed', reservations });

        }

    } catch (err) {
        consosle.log(err)
        return err;
    }
}

exports.reservationsCancelled = async (req, res) => {
    try {
        const hotelId = req.params.idHotel;
        const userId = req.user.sub;

        const reservations = await Reservation.find({ hotel: hotelId, state: 'Cancelled' }).populate('user').populate('room').lean();
        if (!reservations) {
            return res.status(400).send({ message: 'Reservations not found' });
        } else {
            for (let i = 0; i < reservations.length; i++) {
                
                reservations[i].startDate = new Date(reservations[i].startDate).toISOString().split("T")[0];
                reservations[i].endDate = new Date(reservations[i].endDate).toISOString().split("T")[0];
            }

            return res.send({ message: 'Reservations Cancelled', reservations });

        }

    } catch (err) {
        console.log(err)
        return err;
    }
}

exports.getReservation = async (req, res) => {
    try {
       
        const hotelId = req.params.idHotel;
        const userId = req.params.sub;
        const reservationId = req.params.id;

        const reservation = await Reservation.findOne({_id: reservationId}).populate('user');
        if(!reservation) return res.send({message: 'Reservation not found'});
        reservation.startDate = new Date(reservation.startDate).toISOString().split("T")[0];
        reservation.endDate = new Date(reservation.endDate).toISOString().split("T")[0];
        return res.send({message: 'Reservation found', reservation})
    } catch (err) {
        console.log(err)
        return err;
    }
}

exports.myReservation = async (req, res) => {
    try {
        const userId = req.user.sub

        const checkUser = await User.findOne({_id: userId}).lean()
        if(!checkUser){
            return res.status(400).send({message: 'User not found'});
        }else{
            const myReservation = await Reservation.findOne({_id: checkUser.currentReservation}).populate('hotel').populate('room').lean();
            if(!myReservation){
                return res.status(400).send({message: 'Currently you dont have reservations'});
            }else{
                myReservation.startDate = new Date(myReservation.startDate).toISOString().split("T")[0];
                myReservation.endDate = new Date(myReservation.endDate).toISOString().split("T")[0];

                return res.send({message: 'Your reservation', myReservation})
            }
        }

    } catch (err) {
        console.log(err)
        return err;
    }
}

exports.myReservations = async(req,res)=>{
    try{
        const userId = req.user.sub;
        const reservations = await Reservation.find({user: userId}).lean().populate('room').populate('user')
        if(!reservations)
        return res.status(400).send({message: 'Not found'});
        for(let i = 0; i<reservations.length; i++){
            delete reservations[i].user.password

            reservations[i].startDate = new Date(reservations[i].startDate).toISOString().split("T")[0];
            reservations[i].endDate = new Date(reservations[i].endDate).toISOString().split("T")[0];
        }

        return res.send({message: 'Reservations found', reservations})

    }catch(err){
        console.log(err)
        return err;
    }
}


exports.deleteReservation = async (req, res) => {
    try {
        const hotelId = req.params.idHotel
        const reservationId = req.params.idReservation;
        const userId = req.user.sub

        const checkReservationHotel = await Reservation.findOne({ _id: reservationId, hotel: hotelId }).populate('hotel').populate('room').lean();
        if (checkReservationHotel == null || checkReservationHotel.hotel._id != hotelId) {
            return res.status(400).send({ message: 'You cant see this reservation' });
        } else {
            if (checkReservationHotel.state == 'Cancelled') {
                return res.status(400).send({ message: 'This reservation is already cancelled' });
            } else {
                if (checkReservationHotel.state == 'Cancelled and Billed') {
                    return res.status(400).send({ message: 'Cancelled and billed' });
                } else {
                    await User.findOneAndUpdate({ _id: checkReservationHotel.user }, { $unset: { currentReservation: 1 } }, { new: true }).lean();
                    await Room.findOneAndUpdate({ _id: checkReservationHotel.room._id }, { available: true, dateAvailable: 'Available' }, { new: true }).lean()
                    await Reservation.findOneAndUpdate({ _id: reservationId }, { state: 'Cancelled' }, { new: true }).lean()

                    return res.send({ message: 'Reservation cancelled' });

                }
            }
        }

    } catch (err) {
        console.log(err)
        return err;
    }
}