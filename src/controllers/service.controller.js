'use strict'

const Service = require('../models/service.model');
const Hotel = require('../models/hotel.model');
const {validateData, checkUpdateService} = require('../utils/validate');
const { param } = require('../routes/user.routes');
const { validate } = require('../models/hotel.model');

exports.newService = async(req,res)=>{
    try{
        const params = req.body;
        const userId = req.user.sub
        const data ={
            hotel: params.hotel,
            name: params.name,
            description: params.description,
            price: params.price
        }

        const msg = validateData(data);
        if(!msg){
            const checkHotel = await Hotel.findOne({_id: data.hotel});
            if(!checkHotel){
                return res.status(404).send({message: 'Hotel not found'});
            }else{
                if(checkHotel.manager != userId){
                    return res.status(404).send({message: 'Services cant be add to this hotel'}).lean()
                    
                }else{
                    const checkService = await Service.findOne({name: data.name, hotel: data.hotel}).lean()
                    if(checkService != null){
                        return res.status(400).send({message: 'Service already exists'});
                    }else{
                        const service = new Service(data);
                        await service.save();
                        return res.send({message: 'Service saved successfully', service});
                    }
                }
            }
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
        const hotelId = req.params.id;
        console.log(hotelId)
        const hotel = await Service.findOne({hotel: hotelId});
        console.log(hotel)

        if(hotel)return res.send({message: 'Services found', hotel});
        return res.send({message: 'Services not found'})
    }catch(err){
        console.log(err)
        return err;
    }
}

exports.getServicesGeneral = async (req,res)=>{
    try{
       const services = await Service.find({});
       if(!services) return res.status(400).send({message: 'Services not found'})
       else return res.send({message: 'Services found', services})
    }catch(err){
        console.log(err)
        return err;
    }
}