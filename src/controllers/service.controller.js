'use strict'

const Service = require('../models/hotel.model');
const Hotel = require('../models/hotel.model');
const {validateData, checkUpdated} = require('../utils/validate');
const { param } = require('../routes/user.routes');
const { validate } = require('../models/hotel.model');

exports.newService = async (req,res)=>{
    try{
        const params = req.body;
        const hotelId = req.hotel.sub;
        let data = {
            hotel: params.hotel,
            name: params.name,
            description: params.description,
            price: params.price
        }

        let msg = validateData(data);
        if(!msg){
            const check = await Hotel.findOne({_id: data.hotel});
            if(!check === null || check.hotel != hotelId){
                return res.status(400).send({message:'Services cant be add to this hotel'});
            }else{
                const service = new Service(data);
                await service.save();
                return res.send({message: 'Service created', service});
            }
        }else{
            return res.status(400).send(msg);
        }
    }catch(err){
        console.log(err)
        return err;
    }
}

exports.updateService = async (req,res)=>{
    try{
        const serviceId = req.params.id;
        const params = req.body;
        const hotel = await Hotel.findOne({_id: req.hotel.sub});
        const check = await Service.findOne({_id: serviceId})
        if(check){
            const checkUpdate = await validate.checkUpdateService(params);
            if(checkUpdate){
                const checkService = await validate.findService(hotel, check._id)
                if(checkService){
                    const updateService = await Service.findOneAndUpdate({_id: serviceId}, params,{new:true});
                    if(updateService){
                        return res.send({message: 'Service updated', updateService});
                    }else{
                        return res.send({message: 'Falied to update'});
                    }
                }else{
                    return res.send({message: 'Service not found'});
                }
            }
        }
    }catch(err){
        console.log(err)
        return err;
    }
}

exports.deleteService = async (req,res)=>{
    try{
        const serviceId = req.params.id;
        const hotel = await Hotel.findOne({_id: req.hotel.sub});
        const check = await Service.findOne({_id: serviceId});
        if(check){
            const checkUser = await validate.findService(hotel, check._id);
            if(checkUser){
                const deleteService = await Service.findOneAndDelete({_id: serviceId});
                await hotel.service.pull(checkUser);
                await hotel.save();
                return res.send({message: 'Service deleted successfully', deleteService});
            }
        }else{
            return res.send({message: 'Service not found'});
        }
    }catch(err){
        console.log(err)
        return err;
    }
}

exports.getService = async(req,res)=>{
    try{
        const serviceId = req.params.id
        const service = await Service.findOne({_id: serviceId});
        if(!service)return res.send({message: 'Service not found'})
        return res.send({message: 'Service found', service});
    }catch(err){
        console.log(err)
        return err;
    }
}
exports.getServices = async (req,res)=>{
    try{
        const hotel = await Hotel.findOne({_id: req.hotel.sub}).populate('Service');
        const services = hotel.Service
        if(services)
        return res.send({message: 'Service found', services});
        return res.send({message: 'Services not found'})
    }catch(err){
        console.log(err)
        return err;
    }
}