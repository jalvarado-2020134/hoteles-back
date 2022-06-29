'use strict'

const Service = require('../models/hotel.model');
const Hotel = require('../models/hotel.model');
const {validateData, checkUpdateService} = require('../utils/validate');
const { param } = require('../routes/user.routes');
const { validate } = require('../models/hotel.model');

exports.newService = async(req,res)=>{
    try{
        const params = req.body;
        const data ={
            hotel: params.hotel,
            name: params.name,
            description: params.description,
            price: params.price
        }

        const msg = validateData(data);
        if(msg) return res.status(400).send(msg);

        const checkHotel = await Hotel.findOne({_id: params.hotel});
        if(!checkHotel) return res.status(404).send({message: 'Hotel not found'});

        data.description = params.description;

        const service = new Service(data);
        await service.save();
        return res.send({message: 'Service added successfully', service});
    }catch(err){
        console.log(err)
        return err;
    }
}

exports.updateService = async (req,res)=>{
    try{
        const serviceId = req.params.id;
        const params = req.body;

        const checkUpdate = await checkUpdateService(params);
        if(checkUpdate === false)return res.status(400).send({message: 'Params cannot updated'});

       
        
        const updateService = await Service.findOneAndUpdate({_id: serviceId},params,{new:true}).lean();
        if(!updateService) return res.send({message: 'Service not found'});
        return res.send({message: 'Service update successfully', updateService});
    }catch(err){
        console.log(err)
        return err;
    }
}

exports.deleteService = async (req,res)=>{
    try{
        const serviceId = req.params.id;
        const deleteService = await Service.findOneAndDelete({_id: serviceId}).lean();
        if(!deleteService) return res.status(404).send({message: 'Service not found'});
        return res.send({message: 'Service deleted successfully', deleteService});
    }catch(err){
        console.log(err)
        return err;
    }
}

exports.getService = async (req,res)=>{
    try{
         const serviceId = req.params.id;
         const service = await Service.findOne({_id: serviceId}).lean();
         if(!service) return res.status(404).send({message: 'Service not found'});
         return res.send({message: 'Service found', service});
    }catch(err){
        console.log(err)
        return err;
    }
}

exports.getServices = async (req,res)=>{
    try{
        const hotel = await Hotel.findOne({_id: req.hotel.sub}).populate('Service');
        const services = Hotel.services
        if(services)
        return res.send({message: 'Services found', services});
        return res.send({message: 'Services not found'})
    }catch(err){
        console.log(err)
        return err;
    }
}