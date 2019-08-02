const Drives = require('../models/drive').Drive
const Users = require('../models/users').Users

let addDriveData = async (data) => {
    let user = await Users.findUserWithRole(false, data['userId'])
    if (user && user.length !== 0) {
        if (user[0].role_name == 'Recruiter') {
            let current_datetime = new Date()
            let currentDate = `${current_datetime.getFullYear()}-${(current_datetime.getMonth() + 1)}-${current_datetime.getDate()}`
            let currentTime = `${current_datetime.getHours()}:${current_datetime.getMinutes()}:${current_datetime.getSeconds()}`
            let response =  await Drives.create({
                name : data['name'],
                location : data['location'],
                date : data['date'],
                started_by : data['userId'],
                modified_by : data['userId'],
                created_at : `${currentDate} ${currentTime}`,
                modified_at : `${currentDate} ${currentTime}`
            })
            if(response){
                return {
                    status : true,
                    driveId : response.get('id')
                }
            } else {
                return {
                    status : false,
                    message : 'Something went wrong'
                }
            }
        }
        return {
            status: false,
            message: 'Not Authorized'
        }
    } else {
        console.log('entered')
        return {
            status: false,
            message: 'No such user exists'
        }
    }
}

module.exports = {
    addDriveData
}