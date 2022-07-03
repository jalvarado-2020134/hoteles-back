'use strict'

const User = require('../models/user.model');
const Hotel = require('../models/hotel.model');
const fs = require('fs');
const path = require('path')
const {validateData, alreadyHotel, checkUpdate, validateExtension, alreadyHotelUpdated} = require('../utils/validate');
const { param } = require('../routes/user.routes');

exports.newHotel = async (req,res)=>{
    try{
        const params = req.body;
        const data ={
            name: params.name,
            address: params.address,
            phone: params.phone,
            timesRequest: 0,
            manager: params.manager
        };

        const msg = validateData(data);
        if(!msg){
            let hotelExist = await alreadyHotel(data.manager, data.name);
            if(hotelExist) return res.status(400).send ({message:'Hotel already exists'});
            const check = await User.findOne({_id: data.manager});
            if(check === null || check._id != data.manager)
            return res.send({message: 'User not found'})
            console.log(check);
            const hotelAlready = await Hotel.findOne({$and:[{name:data.name},{manager: data.manager}]});
            if(hotelAlready) return res.send({message: 'Hotel exists'});
            const hotel = new Hotel(data);
            await hotel.save();
            return res.send({message: 'Hotel saved successfully', hotel})
        }else return res.status(400).send(msg);
    }catch(err){
        console.log(err)
        return err;
    }
}

exports.updateHotel = async (req,res)=>{
    try{
         const hotelId = req.params.id;
         const params = req.body;

         const hotelExist = await Hotel.findOne({_id: hotelId});
         if(!hotelExist) return res.send({message: 'Hotel not found'});

         const validateUpdate = await checkUpdate(params);
         if(validateUpdate === false) return res.status(400).send({message: 'Invalid params'});

         const alreadyhotel = await alreadyHotelUpdated(params.name);
         if(alreadyhotel)return res.send({message: 'Hotel already exist'})

         const hotelUpdate = await Hotel.findOneAndUpdate({_id: hotelId}, params,{new:true});
         if(!hotelUpdate) return res.send({message: 'Hotel not updated'});
         return res.send({message: 'Hotel updated successfully', hotelUpdate});
    }catch(err){
        console.log(err)
        return err;
    }
}

exports.deleteHotel = async (req,res)=>{
    try{
        const hotelId = req.params.id;

        const hotelExist = await Hotel.findOne({_id: hotelId});
        if(!hotelExist) return res.send({message: 'Hotel not found'});

        const deleteHotel = await Hotel.findOneAndDelete({_id: hotelId});
        if(!deleteHotel) return res.status(400).send({message: 'Hotel not deleted'});
        return res.send({message: 'Hotel deleted successfully', deleteHotel});
    }catch(err){
        console.log(err)
        return err;
    }
}

exports.getHotel = async(req,res)=>{
    try{
        const hotelId = req.params.id;
        const hotel = await Hotel.findOne({_id: hotelId});
        if(!hotel) return res.send({message: 'Hotel not found'});
        return res.send({message: 'Hotel found', hotel})
    }catch(err){
        console.log(err)
        return err;
    }
}

exports.getHotels = async (req,res)=>{
    try{
        const hotels = await Hotel.find()
        return res.send({message: 'Hotels found', hotels});
    }catch(err){
        console.log(err)
        return err;
    }
}

exports.hotelByName = async(req,res)=>{
    try{
        const params = req.body;
        const data = {
            name: params.name
        };

        const msg = validateData(data);
        if(msg)return res.status(400).send(msg);
        const hotels = await Hotel.find({name:{$regex: params.name, $options: 'i'}}).lean();
        return res.send({message: 'Hotel found', hotels});
    }catch(err){
        console.log(err)
        return err;
    }
}

exports.uploadImage = async (req,res)=>{
    try{
        const hotelId = req.params.id;

        if(!req.files.image || !req.files.image.type) return res.status(400).send({message:'Image not send'});
        const filePath = req.files.image.path;
        const fileSplit = filePath.split('\\');
        const fileName = fileSplit[2];

        const extension = fileName.split('\.');
        const fileExt = extension[1];
        const validExt = await validateExtension(fileExt,filePath);
        if(validExt === false)return res.status(400).send({message: 'Invalid extension'});

        const updateHotel = await Hotel.findOneAndUpdate({_id: hotelId},{image: fileName},{new:true}).lean();
        if(!updateHotel) return res.status(400).send({message: 'Hotel not found'});
        return res.send({message: 'Image added successfully'});
    }catch(err){
        console.log(err)
        return err;
    }
}

exports.getImage = async (req,res)=>{
    try{
        const fileName = req.params.fileName;
        const pathFile = './uploads/hotels' + fileName;

        const image = fs.existsSync(pathFile);
        if(!image)return res.status(404).send({message: 'Image not found'});
        return res.sendFile(path.resolve(pathFile));
    }catch(err){
        console.log(err)
        return err;
    }

}