// let candidates = require('./candidate.json')
// let interviewers = require('./interviewers.json')
let Drives = require('./models/drive').Drive
let InterDrive = require('./models/interviewer_drive').Interviewer_drive
let Users = require('./models/users').Users
let InterRoles = require('./models/interviewer_role').Interviewer_role
let Candidates = require('./models/candidates').Candidates
let Roles = require('./models/roles').Roles
const EventEmitter = require('events')
const candIntMappingService = require('./services/candIntMappingService')

let map = new Map()
let interviewerRoundPool = {
    1: [],
    2: [],
    3: [],
    HR: [],
}
let CQ1 = []
let CQ2 = []
let CQ3 = []
let CQHR = []
let driveId
let mapping = []
let started = []
let freeInterviewers = []
class Emitter extends EventEmitter { }
const emitter = new Emitter()
var testemitter = new EventEmitter();
emitter.setMaxListeners(20)
testemitter.setMaxListeners(20)
async function setDriveId() {
    let drive = await Drives.findOne({
        where: { status: 'Started' },
        attributes: ['id']
    })
    if (drive) {
        driveId = drive.get('id')
    } else {
        await setDriveId()
    }
}

setDriveId().then(async () => {
    console.log('SETTING DRIVE ID IN ALGO AS', driveId)
})

let removeCandidate = (cid) => {
    CQ1.forEach((candidate, index) => {
        if (candidate.id === cid) {
            CQ1.splice(index, 1)
        }
    })

    CQ2.forEach((candidate, index) => {
        if (candidate.id === cid) {
            CQ2.splice(index, 1)
        }
    })

    CQ3.forEach((candidate, index) => {
        if (candidate.id === cid) {
            CQ3.splice(index, 1)
        }
    })

    CQHR.forEach((candidate, index) => {
        if (candidate.id === cid) {
            CQHR.splice(index, 1)
        }
    })
}

let distInterviewers = (interviewer) => {
    // console.log("distInter", interviewer)
    freeInterviewers.push(interviewer)
    emitMapping()
    interviewerRoundMap(interviewer)
}

function interviewerRoundMap(interviewer) {
    let rounds = interviewer.rounds.split(',')
    rounds.forEach(round => {
        if (round) {
            interviewerRoundPool[round].push(interviewer.id)
        }
    })
}

async function getInterviewerById(uid) {
    // console.log('called')
    let res = {}

    let user = await Users.findOne({
        where: {
            id: uid
        },
        attributes: ['user_name', 'email', 'profile']
    })

    if (!driveId) {
        await setDriveId()
    }

    let interDrive = await InterDrive.findOne({
        where: {
            interviewer_id: uid,
            drive_id: driveId
        },
        attributes: ['id', 'myoe', 'round']
    })
    // console.log('InterSrive',interDrive)
    let interRole = await InterRoles.findAll({
        where: {
            interviewer_drive_id: interDrive.get('id')
        },
        attributes: ['role_id']
    })

    let roles = ''

    if (map.size == 0) {
        // console.log('hi1')
        let roles = await Roles.findAll()
        // console.log(roles)
        for (let index = 0; index < roles.length; index++) {
            if (!map.has(roles[index].get('id'))) {
                map.set(roles[index].get('id'), roles[index].get('role_name'));
            }
        }

    }
    // console.log(interRole)
    for (let index = 0; index < interRole.length; index++) {
        // console.log('hi2')
        if (index == (interRole.length - 1)) {
            roles += `${map.get(interRole[index].get('role_id'))}`
            // console.log("Role",roles)
        } else {
            roles += `${map.get(interRole[index].get('role_id'))},`
            // console.log("Role",roles)
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

async function getCandidateById(cid) {
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

let checkEligibility = async (intervewerId, candidate) => {
    let interviewer = await getInterviewerById(intervewerId)
    // let interviewer = interviewers.data.filter(interviewer => interviewer.id == intervewerId)[0]
    if (interviewer['roleNominated'].includes(candidate['role']) && candidate['experience'] <= interviewer['expThershold']) {
        return true
    }
    else {
        return false
    }
}

let candidateInterviwerEligibilityMapping = async (candidateId, round) => {
    let candidate = await getCandidateById(candidateId)
    let elInterviewers = []
    for (let index = 0; index < interviewerRoundPool[round].length; index++) {
        let intervewerId = interviewerRoundPool[round][index]
        let res = await checkEligibility(intervewerId, candidate)
        if (res) {
            elInterviewers.push(intervewerId)
        }
    }
    switch (round) {
        case 1: CQ1.push({
            id: candidateId,
            elInt: elInterviewers
        })
            break;
        case 2: CQ2.push({
            id: candidateId,
            elInt: elInterviewers
        })
            break;
        case 3: CQ3.push({
            id: candidateId,
            elInt: elInterviewers
        })
            break;
        case 'HR': CQHR.push({
            id: candidateId,
            elInt: elInterviewers
        })
            break;
        default:
            break;
    }

}

let emitCandidatesActivity = (data) => {
    testemitter.emit('candidateActivity', data)
}

function getMapping() {
    testemitter.emit("getMapping")
}

function emitMapping() {
    setTimeout(() => {
        testemitter.emit("mapped", mapping)
        testemitter.emit("started", started)
        testemitter.emit("free", freeInterviewers)
        // console.log('hi')
    }, 1000);
}

module.exports = {
    socket: (io) => {

        emitter.on('freeInterviewer', async (id) => {
            await candidateInterviewerMapping(id)
        })

        function callMeFree() {
            freeInterviewers.forEach(interviewer => {
                emitter.emit('freeInterviewer', interviewer.id)
            })
            setTimeout(callMeFree, 1000)
        }

        callMeFree()

        // interviewers.data.forEach(interviewer => distInterviewers(interviewer))
        async function getMappedInterviwersToDrive() {
            if (!driveId) {
                await setDriveId()
            }
            let intersDrive = await InterDrive.findAll({
                where: {
                    drive_id: driveId
                },
                attributes: ['interviewer_id']
            })

            for (let index = 0; index < intersDrive.length; index++) {
                let iid = intersDrive[index].get('interviewer_id')
                // console.log("Interv Id",iid)
                let res = await getInterviewerById(iid)
                distInterviewers(res)
            }
        }
        getMappedInterviwersToDrive().then(() => emitMapping())
        /*candidates.data.forEach(async (candidate) => {
            await candidateInterviwerEligibilityMapping(candidate.id, 1)
        }) */

        // console.log(CQ1)
        async function candidateInterviewerMapping(interviewerId) {
            // console.log(interviewerId)
            if (interviewerRoundPool[1].includes(interviewerId) && CQ1.length !== 0) {
                for (let index = 0; index < CQ1.length; index++) {
                    if (CQ1[index].elInt.includes(interviewerId)) {
                        let cid = CQ1[index].id
                        CQ1.splice(index, 1)
                        console.log(`Candidate ${cid} is mapped to Interviewer ${interviewerId}`)
                        if (driveId == null | driveId == undefined) {
                            await setDriveId()
                        }
                        mapping.push(
                            await candIntMappingService.candIntMapping(cid, interviewerId, 1, driveId)
                        )
                        emitMapping()
                        freeInterviewers.forEach((interviewer, index) => {
                            if (interviewer.id == interviewerId) {
                                freeInterviewers.splice(index, 1)
                                // console.log(freeInterviewers)
                            }
                        })
                        return;
                    }
                }
            }
            if (interviewerRoundPool[2].includes(interviewerId) && CQ2.length !== 0) {
                for (let index = 0; index < CQ2.length; index++) {
                    if (CQ2[index].elInt.includes(interviewerId)) {
                        let cid = CQ2[index].id
                        CQ2.splice(index, 1)
                        console.log(`Candidate ${cid} is mapped to Interviewer ${interviewerId}`)
                        if (driveId == null | driveId == undefined) {
                            await setDriveId()
                        }
                        mapping.push(
                            await candIntMappingService.candIntMapping(cid, interviewerId, 2, driveId)
                        )
                        emitMapping()
                        freeInterviewers.forEach((interviewer, index) => {
                            if (interviewer.id == interviewerId) {
                                freeInterviewers.splice(index, 1)
                                // console.log(freeInterviewers)
                            }
                        })
                        return;
                    }
                }
            }
            if (interviewerRoundPool[3].includes(interviewerId) && CQ3.length !== 0) {
                for (let index = 0; index < CQ3.length; index++) {
                    if (CQ3[index].elInt.includes(interviewerId)) {
                        let cid = CQ3[index].id
                        CQ3.splice(index, 1)
                        console.log(`Candidate ${cid} is mapped to Interviewer ${interviewerId}`)
                        if (driveId == null | driveId == undefined) {
                            await setDriveId()
                        }
                        mapping.push(
                            await candIntMappingService.candIntMapping(cid, interviewerId, 3, driveId)
                        )
                        emitMapping()
                        freeInterviewers.forEach((interviewer, index) => {
                            if (interviewer.id == interviewerId) {
                                freeInterviewers.splice(index, 1)
                                // console.log(freeInterviewers)
                            }
                        })
                        return;
                    }
                }
            }
            if (interviewerRoundPool['HR'].includes(interviewerId) && CQHR.length !== 0) {
                for (let index = 0; index < CQHR.length; index++) {
                    if (CQHR[index].elInt.includes(interviewerId)) {
                        let cid = CQHR[index].id
                        CQHR.splice(index, 1)
                        console.log(`Candidate ${cid} is mapped to Interviewer ${interviewerId}`)
                        if (driveId == null | driveId == undefined) {
                            await setDriveId()
                        }
                        mapping.push(
                            await candIntMappingService.candIntMapping(cid, interviewerId, 'HR', driveId)
                        )
                        emitMapping()
                        freeInterviewers.forEach((interviewer, index) => {
                            if (interviewer.id == interviewerId) {
                                freeInterviewers.splice(index, 1)
                                // console.log(freeInterviewers)
                            }
                        })
                        return;
                    }
                }
            }
            if (!freeInterviewers.filter(interviewer => (interviewer.id == interviewerId)).length > 0) {
                freeInterviewers.push(await candIntMappingService.getInterviewer(interviewerId))
                // console.log('I am free', interviewerId)
                emitMapping()
            }
        }

        /* for (let index = 0; index < interviewerRoundPool[1].length; index++) {
            candidateInterviewerMapping(interviewerRoundPool[1][index])
        } */

        io.on('connection', (socket) => {
            // let flag = true
            ioSocket = socket
            socket.emit('mapped', mapping)
            // console.log('mapped', mapping)
            socket.emit('started', started)
            socket.emit('freeInterviewers', freeInterviewers)
            console.log(freeInterviewers)
            testemitter.on("mapped", (data) => {
                // console.log('mapped', mapping)
                socket.emit('mapped', data)
            })
            testemitter.on("started", (data) => {
                // console.log('mapped')
                socket.emit('started', data)
            })
            testemitter.on("free", (data) => {
                // console.log('mapped')
                socket.emit('freeInterviewers', data)
                console.log(freeInterviewers)
            })
            console.log(socket.handshake.address, CQ1);
            socket.on('free', async (ids) => {
                console.log('freed')
                started.forEach((map, index) => {
                    if (map.interviewer.id == ids['iid']) {
                        started.splice(index, 1)
                    }
                })
                await candidateInterviewerMapping(parseInt(ids['iid']))
                switch (ids['status']) {
                    case 'select': ids['round'] += 1
                        await candidateInterviwerEligibilityMapping(ids['cid'], ids['round'])
                        break
                    case 'reject': break
                    case 'on-hold': break
                }
                socket.emit('mapped', mapping)
                socket.emit('freeInterviewers', freeInterviewers)
            })
            socket.on('start', data => {
                // console.log('started', data)
                mapping.forEach((map, index) => {
                    // console.log("\n\n\nINTERVIEWER ID=>" + map.interviewer.id)
                    // console.log("\n\n DATA ID :" + data['id'])
                    if (map.interviewer.id == data['id']) {
                        // console.log("******************************8")
                        map['timestamp'] = data['timestamp']
                        started.push(map)
                        mapping.splice(index, 1)
                        emitMapping()
                    }
                })
                // console.log(started)
            })
            testemitter.on("candidateActivity", (data) => {
                socket.emit('candidateActivity', data)
            })

            testemitter.on("getMapping", () => {
                socket.emit('mapped', mapping)
                socket.emit('started', started)
                socket.emit('freeInterviewers', freeInterviewers)
            })
        })

        /* if (CQ1.length == 0 && CQ2.length == 0 && CQ3.length == 0 && CQHR.length == 0) {
            clearTimeout()
        } */
    },
    distInterviewers: distInterviewers,
    candidateInterviwerEligibilityMapping: candidateInterviwerEligibilityMapping,
    emitCandidatesActivity: emitCandidatesActivity,
    getInterviewerById: getInterviewerById,
    removeCandidate: removeCandidate,
    getMapping: getMapping
}