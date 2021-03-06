'use strict'

const Room =require('../models/room.model');
const User = require('../models/user.model');
const Hotel = require('../models/hotel.model');
const {validateData, updateRoom}=require('../utils/validate');

exports.newRoom = async(req,res)=>{
    try{
        const hotel = req.params.id;
        const params = req.body;
        const data = {
            name: params.name,
            description: params.description,
            price: params.price,
            available: true,
            dateAvailable: params.dateAvailable,
            hotel: params.hotel,
        };
        const msg = validateData(data);
        if(!msg){
            let hotelExist = await Hotel.findOne({_id: params.hotel})
            if(!hotelExist) return res.status(400).send({message: 'Hotel not found'});



            const room = new Room(data);
            await room.save();
            return res.send({message: 'Room saved successfully', room});
        }else return res.status(400).send(msg);
    }catch(err){
        console.log(err)
        return err;
    }
}

exports.updateRoom = async(req,res)=>{
    try{
        const params = req.body;
        const roomId = req.params.id;


        const roomUpdate = await Room.findOneAndUpdate({_id: roomId}, params,{new:true}).lean()
        if(!roomUpdate) return res.send({message: 'Room not found'});
        return res.send({message: 'Room updated successfully', roomUpdate});
    }catch(err){
        console.log(err)
        return err;
    }
}

exports.deleteRoom = async(req,res)=>{
    try{
        const roomId = req.params.id;
        const deleteRoom = await Room.findOneAndDelete({_id: roomId});
        if(!deleteRoom) return res.status(500).send({message: 'Room not found'});
        return res.send({message: 'Room deleted successfully', deleteRoom});
    }catch(err){
        console.log(err)
        return err;
    }
}

exports.getRoom = async (req,res)=>{
    try{
        const roomId = req.params.id;
        const room = await Room.findOne({_id: roomId}).lean()
        if(!room) return res.status(404).send({message: 'Room not found'});
        return res.send({message: 'Room found', room});
    }catch(err){
        console.log(err)
        return err;
    }
}

exports.getRooms = async (req,res)=>{
    try{
        const rooms = await Room.find().populate('hotel');
        return res.send({rooms})
    }catch(err){
        console.log(err)
        return err;
    }
}

exports.roomByHotel = async (req,res)=>{
    try{
        const hotelId = req.params.id;
        const hotelExist = await Hotel.findOne({_id: hotelId});
        if(!hotelExist) return res.send({message: 'Hotel not found'});
        const rooms = await Room.find({hotel: hotelId}).lean();
        return res.send({hotel: hotelExist.name, rooms: rooms});
    }catch(err){
        console.log(err)
        return err;
    }
}

exports.roomByName = async (req,res)=>{
    try{
        const params = req.body;
        const room = await Room.find({name:{$regex:params.name,$options: 'i'}});
        if(!room)return res.send({message: 'Room not found'})
        return res.send({message: 'Your room', room})
    }catch(err){
        console.log(err)
        return err;
    }
}

exports.roomsAvailable = async (req,res)=>{
    try{
        const hotelId = req.params.idHotel;
        const userId = req.user.sub;

        const rooms = await Room.find({hotel: hotelId, available: true}).lean()
        return res.send({message: 'Rooms Availables', rooms})
        
    }catch(err){
        console.log(err)
        return err;
    }
}

exports.roomsNotAvailables = async (req,res)=>{
    try{
        const rooms = await Room.find({state: true});
        return res.send({message: 'Rooms Not Availables', rooms})
    }catch(err){
        console.log(err)
        return err;
    }
}