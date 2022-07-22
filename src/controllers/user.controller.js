'use strict'


const User = require('../models/user.model');
const {validateData, encrypt, alreadyUser, checkPassword, checkUpdate, checkPermission, checkUpdateManager, validateExtension} = require('../utils/validate');
const jwt = require('../services/jwt');
const fs = require('fs')
const path = require('path')

exports.login = async(req,res)=>{
    try{
        const params = req.body;
        let data ={
            username: params.username,
            password: params.password
        }

        let msg = validateData(data);

        if(msg) return res.status(400).send(msg);
        let already = await alreadyUser(params.username);
        if(already && await checkPassword(data.password, already.password)){
            let token = await jwt.createToken(already);
            delete already.password;

            return res.send({message: 'Welcome', already, token});
        }else return res.status(401).send({message: 'Invalid credentials'});
    }catch(err){
        console.log(err);
        return res.status(500).send({message: 'Failed'})
    }
}

exports.register = async(req,res)=>{
    try{
        const params = req.body;
        let data={
            name: params.name,
            username: params.username,
            email: params.email,
            password: params.password,
            role: 'CLIENT'
        };

        let msg = validateData(data);

        if(msg) return res.status(400).send(msg);
        let already = await alreadyUser(data.username);
        if(already) return res.status(400).send({message: 'Username already in use'});
        data.surname = params.surname;
        data.phone = params.phone;
        data.password = await encrypt(params.password);

        let user = new User(data);
        await user.save();
        return res.send({message: 'User created successfully',user });
    }catch(err){
        console.log(err);
        return res.status(500).send({message: 'Error saving user', err});
    }
}

exports.update = async(req,res)=>{
    try{
        const userId = req.params.id;
        const params = req.body;

        const permission = await checkPermission(userId, req.user.sub);
        if(permission === false) return res.status(401).send({message:'Your dont have permission to update'});
        const userExist = await User.findOne({_id: userId});
        if(!userExist) return res.send({message: 'User not found'});
        const updateCheck = await checkUpdate(params);
        if(updateCheck === false) return res.status(400).send({message: 'Invalid params'});
        let alreadyuser = await alreadyUser(params.username);
        if(alreadyuser && userExist.username != params.username) return res.send({message: 'Username already in use'});
        const userUpdate = await User.findOneAndUpdate({_id: userId}, params,{new:true}).lean();
        if(userUpdate) return res.send({message: 'User update successfully', userUpdate});
        return res.send({message: 'User not updated'});
    }catch(err){
        console.log(err);
        return res.status(500).send({message: 'Error updating user', err});
    }
}

exports.delete = async(req,res)=>{
    try{
        const userId = req.params.id;
        
        const permission = await checkPermission(userId, req.user.sub);
        if(permission === false) return res.status(403).send({message: 'You dont have permission to delete'});
        const deleteUser = await User.findOneAndDelete({_id: userId});
        if(deleteUser) return res.send({message: 'Your account', deleteUser});
        return res.send({message: 'User not found'});
    }catch(err){
        console.log(err);
        return res.status(500).send({message: 'Error deleting user', err});
    }
}

//Funciones de Admin
exports.newUser = async(req,res)=>{
    try{
        const params = req.body;
        const data = {
            name: params.name,
            username: params.username,
            email: params.email,
            password: params.password,
            role: params.role
        };

        const msg = validateData(data);
        if(msg) return res.status(400).send(msg);
        const userExist = await alreadyUser(params.username);
        if(userExist) return res.send({message: 'Username already in use'});
        if(params.role != 'ADMIN' && params.role != 'CLIENT' && params.role != 'MANAGER') return res.status(400).send({message: 'Invalid role'});

        data.surname = params.surname;
        data.phone = params.phone;
        data.password = await encrypt(params.password);

        const user = new User(data);
        await user.save();
        return res.send({message: 'User saved successfully', user});
    }catch(err){
        console.log(err);
        return res.status(500).send({message: 'Error saving user', err});
    }
}

exports.update_Admin = async(req,res)=>{
    try{
        const userId = req.params.id;
        const params = req.body;

        const userExist = await User.findOne({_id: userId});
        if(!userExist) return res.send({message: 'User not found'});
        if(userExist.role === 'ADMIN') return res.status(400).send({message: 'ADMIN cant be update'});
        const alreadyUsername = await alreadyUser(params.username);
        if(alreadyUsername && userExist.username != alreadyUsername.username) 
        return res.send({message: 'Username already in use'});
        if( params.role != 'ADMIN' && params.role != 'CLIENT' && params.role !='MANAGER') return res.status(400).send({message: 'Invalid role'})
        const userUpdated = await User.findOneAndUpdate({_id: userId}, params,{new:true});
        if(!userUpdated) return res.send({message: 'User not updated'});
        return res.send({message: 'User update successfully',userUpdated});
    }catch(err){
        console.log(err);
        return res.status(500).send({message: 'Error updating user', err})
    }
}

exports.delete_Admin = async(req,res)=>{
    try{
        const userId = req.params.id;

        const userExist = await User.findOne({_id: userId});
        if(!userExist) return res.status(400).send({message: 'User not found'});
        if(userExist.role === 'ADMIN') return res.status(400).send({message: 'ADMIN cant be deleted'});
        const userDeleted = await User.findOneAndDelete({_id: userId});
        if(!userDeleted) return res.status(400).send({message: 'User not deleted'});
        return res.send({message: 'User', userDeleted})
    }catch(err){
        console.log(err);
        return res.status(500).send({message: 'Error deleting user', err});
    }
}

exports.getUser = async(req,res)=>{
    try{
        const userId = req.params.id;

        const user = await User.findOne({_id: userId});
        if(!user) return res.status(400).send({message: 'User not found'})
        else return res.send({message: 'User found', user});
    }catch(err){
        console.log(err)
        return res.status(500).send({message: 'Error getting user', err});
    }
}

exports.getManagers = async(req,res)=>{
    try{
        const usersExist = await User.find({role: 'MANAGER'});
        return res.send({message: 'MANAGERS', usersExist})
    }catch(err){
        console.log(err)
        return err;
    }
}

exports.getUsers = async(req,res)=>{
    try{
        const user = await User.find({});
        if(!user) return res.status(400).send({message: 'Users not found'})
        else return res.send({message: 'Users found', user});
    }catch(err){
        console.log(err)
        return res.status(500).send({message:'Error getting users', err});
    }
}

exports.searchUser = async(req,res)=>{
    try{
        const params = req.body;
        const data ={
            name: params.name
        };

        const msg = validateData(data);
        if(msg) return res.status(400).send(msg);

        const users = await User.find({name:{$regex: params.name, $options: 'i'}}).lean();
        return res.send({message: 'User found', users})
    }catch(err){
        console.log(err)
        return res.status(500).send({message: 'Error searching user', err});
    }
}

exports.myUser = async (req,res)=>{
    try{
        const userId = req.user.sub;
        const user = await User.findOne({_id: userId}).lean();
        delete user.password;
        delete user.__v
        if(!user){
            return res.status(403).send({message: 'User not found'})
        }else{
            return res.send({message: 'Your user', user})
        }
    }catch(err){
        console.log(err)
        return err;
    }
}

exports.uploadImage = async(req,res)=>{
    try{
        const checkImage = await User.findOne({_id: req.user.sub});
        let pathFile = './uploads/users/';

        if(checkImage.image){
            fs.unlinkSync(pathFile + checkImage.image);
        }

        console.log(req.files)

        if(!req.files.image || !req.files.image.type){
            return res.status(400).send({message: 'Image not send'});
        }else{
            const filePath = req.files.image.path;
            const fileSplit = filePath.split('\\');
            const fileName = fileSplit[2];
            const extension = fileName.split('\.');
            const fileExt = extension[1];
            const validExt = await validateExtension(fileExt, filePath);

            if(validExt === false){
                return res.status(400).send({message: 'Invalid extension'});
            }else{
                const updateUser = await User.findOneAndUpdate({_id: req.user.sub},{image: fileName},{new:true});
                if(!updateUser){
                    return res.status(404).send({message: 'User not found'});
                }else{
                    delete updateUser.password;
                    return res.status(200).send({message: 'Image added successfully', updateUser});
                }
            }
        }
    }catch(err){
        console.log(err)
        return err;
    }
}

exports.getImage = async (req,res)=>{
    try{
         const fileName = req.params.fileName;
         const pathFile = './uploads/users/' + fileName;

         const image = fs.existsSync(pathFile);
         if(!image){
            return res.status(404).send({message: 'Image not found'});
         }else{
            return res.sendFile(path.resolve(pathFile));
         }
    }catch(err){
        console.log(err)
        return err;
    }
}