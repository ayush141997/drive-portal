const Users = require('../models/users').Users
const InterviewerDrive = require('../models/interviewer_drive').Interviewer_drive
const Drives = require('../models/drive').Drive

class loginService {

    async authenticate(email) {
        let user = await Users.findUserWithRole(email,false)
        console.log('User',user)
        if (user && user.length !== 0) {
            if (user[0].role_name == 'Recruiter') {
                let drive = await Drives.findOne({
                    where: { status: 'Started' },
                    attributes: ['id']
                })
                let driveId = (drive) ? drive.get('id') : 0
                return {
                    status: true,
                    userId: user[0].id,
                    role: user[0].role_name,
                    driveId: driveId
                }
            } else if (user[0].role_name == 'Interviewer') {
                let status = await InterviewerDrive.getRunningDrive(user[0].id)
                if (status && status.length !== 0) {
                    return {
                        status: true,
                        userId: user[0].id,
                        role: user[0].role_name,
                        driveId: status[0].id
                    }
                }
                return {
                    status: false,
                    message: 'No running drives'
                }
            }

        }
        else {
            return {
                status: false
            }
        }
    }

}

module.exports = new loginService()

