const interviewers = require('../interviewers.json')
const Drives = require('../models/drive').Drive
const Users = require('../models/users').Users
const InterDrive = require('../models/interviewer_drive').Interviewer_drive
const InterRoles = require('../models/interviewer_role').Interviewer_role
const Roles = require('../models/roles').Roles
const getInterviewById = require('../algorithm').getInterviewerById

class dashboardService {

    async getDashData(uid, driveId) {
        let res = {}
        let drive = await Drives.findOne({
            where: {
                id: driveId
            },
            attributes: ['date', 'location']
        })

        let user = await Users.findOne({
            where: {
                id: uid
            },
            attributes: ['user_name', 'email', 'profile', 'role_id']
        })
        if(user.get('role_id') == 2){
            let interDrive = await InterDrive.findOne({
                where: {
                    interviewer_id: uid,
                    drive_id: driveId
                },
                attributes: ['id', 'myoe', 'round']
            })
            let interRole = await InterRoles.findAll({
                where: {
                    interviewer_drive_id: interDrive.get('id')
                },
                attributes: ['role_id']
            })
    
            let roles = ''
    
            for (let index = 0; index < interRole.length; index++) {
                let roleName = await Roles.findOne({
                    where: {
                        id: interRole[index].get('role_id')
                    },
                    attributes: ['role_name']
                })
                roles += `${roleName.get('role_name')} `
            }
    
            if (drive && user && interDrive) {
                res = {
                    driveDate: drive.get('date'),
                    driveLocation: drive.get('location'),
                    interviewer: {
                        name: user.get('user_name'),
                        email: user.get('email'),
                        designation: user.get('profile'),
                        expThershold: interDrive.get('myoe'),
                        roleNominated: roles,
                        rounds: interDrive.get('round')
                    }
                }
            }
            
            return {
                status: 200,
                data: res
            }
        }
        return {
            status: 403
        }
    }

    async getInterviewerData(driveId){
        let intersDrive = await InterDrive.findAll({
            where: {
                drive_id: driveId
            },
            attributes: ['interviewer_id']
        })

        let interviewers = []
        // console.log(intersDrive)
        for (let index = 0; index < intersDrive.length; index++) {
            let iid = intersDrive[index].get('interviewer_id')
            // console.log("Interv Id",iid)
            let res = await getInterviewById(iid)
            interviewers.push(res)
        }
        
        return interviewers
    }
}

module.exports = new dashboardService()