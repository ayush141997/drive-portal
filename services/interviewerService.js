const users = require('../models/users').Users
const userRoles = require('../models/user_roles').User_roles
const interviewerDrive = require('../models/interviewer_drive').Interviewer_drive
const interviewerRole = require('../models/interviewer_role').Interviewer_role
const Roles = require('../models/roles').Roles
const CandIntMappingModel = require('../models/can_interviewer').Can_interviewer
const Statuses = require('../models/status').Status
const Sequelize = require('../database/mysql').Sequelize
const Op = Sequelize.Op;
const emitCandActivity = require('../algorithm').emitCandidatesActivity
const addInterviewerInAlgo = require('../algorithm').distInterviewers
const getInterviewById = require('../algorithm').getInterviewerById
let map = new Map()
let status = new Map()

class interviewerService {

    async submitFeedback(ciid, data, status) {
        // console.log('called')
        let current_datetime = new Date()
        let currentDate = `${current_datetime.getFullYear()}-${(current_datetime.getMonth() + 1)}-${current_datetime.getDate()}`
        let currentTime = `${current_datetime.getHours()}:${current_datetime.getMinutes()}:${current_datetime.getSeconds()}`
        let statusId = await Statuses.findOne({
            where: {
                status_name: status
            },
            attributes: ['id']
        })
        let updated = await CandIntMappingModel.update({
            status_id: statusId.get('id'),
            feedback: JSON.stringify(data),
            modified_at: `${currentDate} ${currentTime}`
        }, {
                where: {
                    id: ciid
                }
            })
        if (updated) {
            let response = await CandIntMappingModel.findOne({
                where: {
                    id: ciid
                },
                attributes: ['id', 'can_id', 'interviewer_id', 'status_id', 'round', 'feedback', 'role_id']
            })
            let updatedCandidate = response.get()
            if (map.size == 0) {
                let roles = await Roles.findAll()

                for (let index = 0; index < roles.length; index++) {
                    if (!map.has(roles[index].get('id'))) {
                        map.set(roles[index].get('id'), roles[index].get('role_name'));
                    }
                }

            }
            updatedCandidate.status = status
            updatedCandidate.role = map.get(response.get('role_id'))
            emitCandActivity(updatedCandidate)
        }
    }

    async addInterviewer(data) {
        let userRole = await userRoles.findOne({
            where: {
                role_name: "Interviewer"
            },
            attributes: ['id']
        })
        let userRoleId = userRole.get('id')
        let current_datetime = new Date()
        let currentDate = `${current_datetime.getFullYear()}-${(current_datetime.getMonth() + 1)}-${current_datetime.getDate()}`
        let currentTime = `${current_datetime.getHours()}:${current_datetime.getMinutes()}:${current_datetime.getSeconds()}`

        let user = await users.findOrCreate({
            where: {
                email: data['email']
            },
            defaults: {
                user_name: data['name'],
                role_id: userRoleId,
                profile: data['profile'],
                created_by: data['userId'],
                modified_by: data['userId'],
                created_at: `${currentDate} ${currentTime}`,
                modified_at: `${currentDate} ${currentTime}`
            }
        })

        let userId = user[0].get('id')

        let rounds = ''

        for (let index = 0; index < data['rounds'].length; index++) {
            if (index == data['rounds'].length - 1) {
                rounds += `${data['rounds'][index]}`
            } else {
                rounds += `${data['rounds'][index]},`
            }
        }

        let interDrive = await interviewerDrive.create({
            interviewer_id: userId,
            drive_id: data['driveId'],
            myoe: data['exp'],
            round: rounds,
            created_by: data['userId'],
            modified_by: data['userId'],
            created_at: `${currentDate} ${currentTime}`,
            modified_at: `${currentDate} ${currentTime}`
        })

        let interDriveId = interDrive.get('id')

        let interRoleData = []

        data['role'].forEach(role => {
            Roles.findOne({
                where: {
                    role_name: role
                }
            }).then(async (roleModel) => {
                let roleId = roleModel.get('id')
                let roleData = {
                    interviewer_id: userId,
                    role_id: roleId,
                    interviewer_drive_id: interDriveId,
                    created_by: data['userId'],
                    modified_by: data['userId'],
                    created_at: `${currentDate} ${currentTime}`,
                    modified_at: `${currentDate} ${currentTime}`
                }
                interRoleData.push(roleData)
                if (interRoleData.length == data['role'].length) {
                    // console.log(interRoleData)
                    interviewerRole.bulkCreate(interRoleData)
                    let interviewerAlgo = await getInterviewById(userId)
                    addInterviewerInAlgo(interviewerAlgo)
                }
            })
        })
    }


    async getResultsByIid(iid, driveId) {
        console.log("inside API ")

        let data = await CandIntMappingModel.findAll({
            where: {
                interviewer_id: iid,
                drive_id: driveId,
                feedback: {
                    [Op.ne]: null
                }
            },
            attributes: ['round', 'feedback', 'can_id']
        })

        //data.forEach( ) \
        console.log("Hiiiiiii",data)
        if (!(data && data.length == 0)) {
            let feedbacks = []
            for (let index = 0; index < data.length; index++) {
                let record = {
                    canId: data[index].get('can_id'),
                    round: data[index].get('round'),
                    feedback: data[index].get('feedback')
                }
                feedbacks.push(record)
            }
            return {
                status: true,
                interviews: feedbacks
            }
        }
        return {
            status: false
        }
    }


    async getOverallStatus(driveId) {
        if (status.size == 0) {
            let statuses = await Statuses.findAll()

            for (let index = 0; index < statuses.length; index++) {
                if (!status.has(statuses[index].get('id'))) {
                    status.set(statuses[index].get('id'), statuses[index].get('status_name'));
                }
            }
        }
        if (map.size == 0) {
            let roles = await Roles.findAll()

            for (let index = 0; index < roles.length; index++) {
                if (!map.has(roles[index].get('id'))) {
                    map.set(roles[index].get('id'), roles[index].get('role_name'));
                }
            }
        }
        let res = await CandIntMappingModel.findAll({
            where: {
                drive_id: driveId,
                feedback: {
                    [Op.ne]: null
                }
            },
            attributes: ['id', 'can_id', 'interviewer_id', 'status_id', 'round', 'feedback', 'role_id']
        })
        if (res) {
            let overallStatuses = res.map(e => {
                let overallStatus = e.get()
                overallStatus.status = status.get(e.get('status_id'))
                overallStatus.role = map.get(e.get('role_id'))
                return overallStatus
            })
            return {
                status: true,
                data: overallStatuses
            }
        }
        return {
            status: false
        }
    }
}

module.exports = new interviewerService()