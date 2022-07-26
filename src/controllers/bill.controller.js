'use strict'

const {validateData,alreadyBill} = require('../utils/validate');
const Reservation = require('../models/reservation.model');
const Bill = require('../models/bill.model');

exports.createBill = async(req,res)=>{
    try{
        const params = req.body;
        const reservation = req.params.id;
        const bills = await Bill.count().lean();
        var options = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'};
        const date = new Date();
        const data ={
            date: date.toLocaleDateString('es-ES', options),
            serial: bills + 1000,
            reservation: req.params.id,
            NIT: params.NIT,
        }

        if(params.NIT == '' || params.NIT == undefined || params.NIT == null){
            data.NIT = 'C/F'
        }

        const msg = validateData(data);
        if(msg) return res.status(400).send(msg);

        let billExist = await alreadyBill(data.reservation);
        if(billExist) return res.status(400).send({message: 'This reservation already has an bill'});

        const checkReservation = await Reservation.findOne({_id: reservation}).populate('hotel').populate('room').populate('service');
        if(checkReservation == null || checkReservation.id != reservation)
        return res.status(400).send({message: 'Reservation not found'});

        data.name = params.name;

        const bill = new Bill(data);
        await bill.save();
        return res.send({message: 'Bill created successfully', bill, checkReservation});
    }catch(err){
        console.log(err)
        return err;
    }
}

exports.getBill = async(req,res)=>{
    try{
        const reservation = req.params.idReservation;

        const checkReservation = await Reservation.findOne({_id: reservation}).populate('hotel').populate('room').populate('service');
        if(checkReservation === null || checkReservation.id != reservation)
        return res.status(400).send({message: 'reservation not found'});

        const bill = await Bill.findOne({reservation: reservation}).lean().populate('reservation').populate('user')

        

        if(!bill) return res.send({message: 'Bill not found'});
        return res.send({message: 'Bill', bill, checkReservation});
    }catch(err){
        console.log(err)
        return err;
    }
}