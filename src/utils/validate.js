'use strict'

const bcrypt = require('bcrypt-nodejs');
const fs = require('fs')
const User = require('../models/user.model');
const Hotel = require('../models/hotel.model');
const Event = require('../models/event.model')

exports.validateData = (data)=>{
    let keys = Object.keys(data), msg='';

    for(let key of keys){
        if(data[key] !== null && data[key] !== undefined && data[key] !=='')continue;
        msg += `El parámetro ${key} es obligatorio\n`
    }
    return msg.trim();
}

exports.validateExtension = async (ext,filePath)=>{
    try{
        if(ext == 'png'||
        ext == 'jpg' ||
        ext == 'jpeg' ||
        ext == 'gif'){
            return true;
        }else{
            fs.unlinkSync(filePath);
            return false;
        }
        
        
        
    }catch(err){
        console.log(err)
        return err;
    }
}

exports.findUser = async(username)=>{
    try{
        let exist = await User.findOne({username: username}).lean();
        return exist;
    }catch(err){
        console.log(err);
        return err;
    }
}

exports.alreadyUser = async (username)=>{
    try{
     let exist = User.findOne({username:username}).lean()
     return exist;
    }catch(err){
        return err;
    }
 }
 
 exports.encrypt = async (password) => {
     try{
         return bcrypt.hashSync(password);
     }catch(err){
         console.log(err);
         return err;
     }
 }
 
 exports.checkPassword = async (password, hash)=>{
     try{
         return bcrypt.compareSync(password, hash);
     }catch(err){
         console.log(err);
         return err;
     }
 }
 
 exports.checkPermission = async (userId, sub)=>{
     try{
         if(userId != sub){
             return false;
         }else{
             return true;
         }
     }catch(err){
         console.log(err);
         return err;
     }
 }
 
 exports.checkUpdate = async (user)=>{
     if(user.password || Object.entries(user).length === 0 || user.role){
         return false;
     }else{
         return true;
     }
 }
 
 exports.checkUpdateManager = async (user)=>{
     if(user.password || Object.entries(user).length === 0){
         return false;
     }else{
         return true;
     }
 }
 
 
 exports.checkUpdated = async (user)=>{
     try{
         if(user.password || Object.entries(user).length === 0 || user.role ){
             return false;
         }else{
             return true; 
         }
     }catch(err){
         console.log(err); 
         return err; 
     }
 }

 //------Validaciones para Hoteles------------

 exports.alreadyHotel = async ( manager , name)=>{
    try{
     let exist = Hotel.findOne({  manager:manager , name:name}).lean()
     return exist;
    }catch(err){
        return err;
    }
}

exports.alreadyHotelUpdated = async ( name)=>{
    try{
     let exist = Hotel.findOne({ name:name}).lean()
     return exist;
    }catch(err){
        return err;
    }
}

//-----------Services----------

exports.checkUpdateService = async(service)=>{
    if(service.hotel ||
        Object.entries(service).length === 0){
            return false;
        }else{
            return true;
        }
}

//----------Room------------

exports.updateRoom = async(room)=>{
    if( room.hotel ||
        Object.entries(room).length === 0){
          return false;
      }else{
          return true;
      }
}