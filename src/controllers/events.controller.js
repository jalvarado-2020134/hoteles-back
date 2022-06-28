'use strict'

const Event = require('../models/event.model');
const { validate } = require('../models/hotel.model');
const Hotel = require('../models/hotel.model');
const { param } = require('../routes/user.routes');
const {validateData, checkUpdated} = require('../utils/validate');

exports.newEvent = async(req,res)=>{
    try{
        const params = req.body;
        const data = {
            name: params.name,
            description: params.description,
            date: params.date,
            hotel: params.hotel
        };

        console.log(data)
        const msg = validateData(data);

        if(msg) return res.status(400).send(msg);

        const hotelExist = await Hotel.findOne({_id: data.hotel});
        if(!hotelExist) return res.send({message: 'Hotel not found'});

        const eventExist = await Event.findOne({$and:[{name: data.name},{hotel:data.hotel}]});
        if(!eventExist){
            const event = new Event(data);
            await event.save();
            return res.send({message: 'Event save', event})
        }else return res.status(400).send({message: 'Event already exist'});
    }catch(err){
        console.log(err)
        return err;
    }
}

exports.updateEvent = async(req,res)=>{
    try{
        const params = req.body;
        const eventId = req.params.id;

        const data ={
            name: params.name,
            description: params.description,
            date: params.date,

        };

        const check = await checkUpdated(data);
        if(check === false) return res.status(400).send({message: 'Data not recived'});

        const msg = validateData(data);
        if(!msg){
            const eventExist = await Event.findOne({_id: eventId});
            if(!eventExist) return res.status(400).send({message: 'Event not found'});

            const hotel = await Hotel.findOne({manager: req.user.sub});
            if(!hotel) return res.send({message: 'Hotel not found'});

            let already = await Event.findOne({$and:[{name:data.name}, {hotel: hotel}]});
            if(already && eventExist.name != data.name) return res.status(400).send({message:'Event already exist'});

            const eventUpdate = await Event.findOneAndUpdate({_id: eventId}, data,{new:true});
            return res.send({message: 'Evente updated', eventUpdate});
        }
    }catch(err){
        console.log(err)
        return err;
    }
}

exports.deleteEvent = async (req,res)=>{
    try{
        const eventId = req.params.id;
        const eventExist = await Event.findOne({_id: eventId});
        if(!eventExist) return res.status(400).send({message: 'Event not found'});

        const deleteEvent = await Event.findOneAndDelete({_id: eventId});
        return res.send({message: 'Event deleted successfully', deleteEvent});
    }catch(err){
        console.log(err)
        return err;
    }
}

exports.getEvent = async(req,res)=>{
    try{
        const eventId = req.params.id
        const event = await Event.findOne({_id: eventId});
        if(!event) return res.send({message: 'Event not found'})
        return res.send({message: 'Event', event})
    }catch(err){
        console.log(err)
        return err;
    }
}