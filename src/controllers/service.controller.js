'use strict'

const Service = require('../models/hotel.model');
const Hotel = require('../models/hotel.model');
const {validateData, checkUpdated} = require('../utils/validate');
const { param } = require('../routes/user.routes');

exports.newService = async(req,res)=>{
    try{
        const params = req.body;
        const data = {
            name: params.name,
            description: params.description,
            price: params.price,
            hotel: params.hotel,
        };

        console.log(data)
        const msg = validateData(data);

        if(msg) return res.status(400).send(msg);
        const hotelExist = await Hotel.findOne({_id: data.name});
        if(!hotelExist) return res.send({message:'Hotel not found'});
        
        const serviceExist = await Service.findOne({name: data.name});
        if(!serviceExist){
            const service = new Service(data);
            await service.save();
            return res.send({message: 'Service saved successfully ', service});

        }else return res.status(400).send({message: 'Service already exist'});

    }catch(err){
        console.log(err);
        return err;
    }
}

exports.updateService = async (req,res)=>{
    try{
        const params = req.body;
        const serviceId = req.params._id;

        const data ={
            name: params.name,
            description: params.description,
            price: params.price,
        };

        const check = await checkUpdated(data);
        if(check === false) return res.status(400).send({message: 'Data not recived'});
        const msg = validateData(data);
        if(!msg){
            const serviceExist = await Service.findOne({_id: serviceId});
            if(!serviceExist) return res.status(400).send({message: 'Service not found'});

            let nameUse = await Service.findOne({name: data.name});
            if(nameUse && serviceExist.name != data.name)return res.status(400).send({message: 'Service already exist'});

            const serviceUpdate = await Service.findOneAndUpdate({_id: serviceId},data,{new:true});
            return res.send({message: 'Service updated', serviceUpdate})
        }else return res.status(400).send({message: 'Empty params'})
    }catch(err){
    console.log(err)
    return err;
    }
    
}

exports.deleteService = async (req,res)=>{
    try{
        const serviceId = req.params._id;
        const serviceExist = await Service.findOne({_id: serviceId});
        if(!serviceExist) return res.status(400).send({message: 'Service not found'});

        const serviceDelete = await Service.findOneAndDelete({_id: serviceId});
        return res.send({message: 'Service deleted', serviceDelete});
    }catch(err){
        console.log(err)
        return err;
    }
}

exports.getService = async (req,res)=>{
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

exports.getServices = async(req,res)=>{
    try{
        const services = await Service.find();
        return res.send({message: 'Services found', services})
    }catch(err){
        console.log(err)
        return err;
    }
}