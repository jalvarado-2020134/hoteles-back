'use strict'

const Event = require('../models/event.model');
const User = require('../models/user.model');
const Hotel = require('../models/hotel.model');
const TypeEvent = require('../models/typeEvent.model');
const { param } = require('../routes/user.routes');
const {validateData, checkUpdated} = require('../utils/validate');

exports.newEvent = async(req,res)=>{
    try{
        const params = req.body;
        const data = {
            name: params.name,
            description: params.description,
            date: params.date,
            typeEvent: params.typeEvent,
            hotel: params.hotel
        };

        console.log(data)
        const msg = validateData(data);

        if(msg) return res.status(400).send(msg);

        const hotelExist = await Hotel.findOne({_id: data.hotel});
        if(!hotelExist) return res.send({message: 'Hotel not found'});

        const checkType = await TypeEvent.findOne({_id: data.typeEvent});
        if(!checkType) return res.send({message: 'TypeEvent not found'});

        const eventExist = await Event.findOne({$and:[{name: data.name},{hotel:data.hotel}]});
        if(!eventExist){
            const event = new Event(data);
            await event.save();
            return res.send({message: 'Event saved successfully', event})
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
            date: params.data,
            typeEvent: params.typeEvent,
        };
        
            const eventExist = await Event.findOne({_id: eventId});
            if(!eventExist) return res.status(400).send({message: 'Event not found'});


            const eventUpdate = await Event.findOneAndUpdate({_id: eventId}, params,{new:true});
            if(!eventUpdate) return res.send({message: 'Event not updated'});
            return res.send({message: 'Event updated successfully', eventUpdate});
        
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
        return res.send({message: 'Event', deleteEvent});
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

exports.getEvents = async (req,res)=>{
    try{
        const events = await Event.find().populate('hotel').populate('typeEvent')
        return res.send({events});
    }catch(err){
        console.log(err)
        return err;
    }
}