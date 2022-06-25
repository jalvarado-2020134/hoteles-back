'use strict'

const mongoConfig = require('./configs/mongoConfig');
const app = require('./configs/app');
const port = 3200;

const {findUser, encrypt} = require('./src/utils/validate');
const User = require('./src/models/user.model');

mongoConfig.init();

app.listen(port, async()=>{
    console.log(`Server http running in port ${port}`);

    let data={
        name: 'Josue',
        username: 'Jalvarado',
        email: 'josue@gmail.com',
        password: await encrypt('123'),
        role: 'ADMIN'
    };

    let checkUser = await findUser(data.username);
    if(!checkUser){
        let user = new User(data);
        await user.save();
        console.log('ADMIN registered successfully')
    }
});