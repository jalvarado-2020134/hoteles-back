'use strict'

const TypeEvent = require('../models/typeEvent.model');
const {validateData} = require('../utils/validate');

exports.newTypeEvent = async (req,res)=>{
    try{
        const params = req.body;
        const data = {
            name: params.name
        };
        console.log(data)
        const msg = validateData(data);
        if(msg) return res.status(400).send(msg);

        const checkType = await TypeEvent.findOne({name: params.name});
        if(!checkType){
            const typeEvent = new TypeEvent(data);
            await typeEvent.save();
            return res.send({message: 'TypeEvent saved successfully', typeEvent});
        }else return res.status(400).send({message: 'TypeEvent already exist'});
    }catch(err){
        console.log(err)
        return err;
    }
}

exports.getTypes = async (req,res)=>{
    try{
        const typeEvent = await TypeEvent.find();
        return res.send({message: 'TypeEvents', typeEvent})
    }catch(err){
        console.log(err)
        return err;
    }
}

exports.getType = async (req,res)=>{
    try{
        const typeEventId = req.params.id
        const typeEvent = await TypeEvent.findOne({_id: typeEventId});
        return res.send({message: 'TypeEvent', typeEvent})
    }catch(err){
        console.log(err)
        return err;
    }
}