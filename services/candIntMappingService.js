let candidates = require('../candidate.json')
let interviewers = require('../interviewers.json')
let Drives = require('../models/drive').Drive
let InterDrive = require('../models/interviewer_drive').Interviewer_drive
let Users = require('../models/users').Users
let InterRoles = require('../models/interviewer_role').Interviewer_role
let Candidates = require('../models/candidates').Candidates
let Roles = require('../models/roles').Roles
let CandIntMappingModel = require('../models/can_interviewer').Can_interviewer


const candIntMapping = async (cid, iid, round, driveId) => {
    // console.log("In canIntMapping==> Drive ID:=>" ,driveId)
    let candidate = await getCandidate(cid)
    let interviewer = await getInterviewer(iid)
    let current_datetime = new Date()
    let currentDate = `${current_datetime.getFullYear()}-${(current_datetime.getMonth() + 1)}-${current_datetime.getDate()}`
    let currentTime = `${current_datetime.getHours()}:${current_datetime.getMinutes()}:${current_datetime.getSeconds()}`

    let CandIntMapping = await CandIntMappingModel.create({
        can_id: cid,
        interviewer_id: iid,
        status_id: 1,
        round: round,
        created_at: `${currentDate} ${currentTime}`,
        modified_at: `${currentDate} ${currentTime}`,
        role_id: candidate['applied_role_id'],
        drive_id: driveId
    })

    return {
        candidate: candidate,
        interviewer: interviewer,
        round: round,
        canIntId: CandIntMapping.get('id')
    }
}

async function getInterviewer(uid) {
    let res = {}
    let drive = await Drives.findOne({
        where: { status: 'Started' },
        attributes: ['id']
    })
    let driveId = drive.get('id')
    let user = await Users.findOne({
        where: {
            id: uid
        },
        attributes: ['user_name', 'email', 'profile']
    })

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
        if (index == interRole.length) {
            roles += `${roleName.get('role_name')}`
        } else {
            roles += `${roleName.get('role_name')},`
        }
    }

    if (user && interDrive) {
        res = {
            id: uid,
            name: user.get('user_name'),
            email: user.get('email'),
            designation: user.get('profile'),
            expThershold: interDrive.get('myoe'),
            roleNominated: roles,
            rounds: interDrive.get('round')
        }
    }

    return res;
}

/* async function getInterviewer(iid) {
    return interviewers.data.filter(res => (res.id == iid))[0]
} */

async function getCandidate(cid) {
    console.log("getCandidates==> here is CID: ",cid)
    let data = await Candidates.findAll({
        where: {
            id: cid
        }
    })
    if (data) {
        let candidate = data[0].get()
        let role = await Roles.findOne({
            where: {
                id: candidate['applied_role_id']
            },
            attributes: ['role_name']
        })
        candidate.role = role.get('role_name')
        return candidate
    }
}

module.exports = {
    candIntMapping,
    getCandidate,
    getInterviewer
}