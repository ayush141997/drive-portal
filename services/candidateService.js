const Candidates = require('../models/candidates').Candidates
const Roles = require('../models/roles').Roles
const Drives = require('../models/drive').Drive
const algo = require('../algorithm')

let candidates = []
let map = new Map()

class candidateService {

    async getCandidates(driveId) {
        let data = await Candidates.findAll({
            where: {
                drive_id: driveId
            }
        })
        if (map.size == 0) {
            let roles = await Roles.findAll()

            for (let index = 0; index < roles.length; index++) {
                if (!map.has(roles[index].get('id'))) {
                    map.set(roles[index].get('id'), roles[index].get('role_name'));
                }
            }

        }
        let tempCandidates = []
        data.forEach(async (candidate, index) => {
            let candidateDetail = candidate.get()
            candidateDetail.role = map.get(candidate.get('applied_role_id'))
            tempCandidates.push(candidateDetail)
            if(data.length === (index+1)){
                candidates = [...tempCandidates]
            }
        })
    }

    async getAllData(driveId) {
        if (candidates.length == 0) {
            await this.getCandidates(driveId)
        }
        return {
            status: 200,
            data: candidates
        }
    }

    async getAllArrivedData(driveId) {
        if (candidates.length == 0) {
            await this.getCandidates(driveId)
        }
        return {
            status: 200,
            data: candidates.filter(candidate => (candidate.arrival_status == "arrived"))
        }
    }

    async getData(id, driveId) {
        if (candidates.length == 0) {
            await this.getCandidates(driveId)
        }
        return {
            status: 200,
            data: candidates.filter(e => {
                if (e.id == id && e.arrival_status == "arrived") {
                    return true
                }
            })
        }
    }

    async setArrivalStatus(cid, timestamp, currentStatus, driveId) {
        if (candidates.length == 0) {
            await this.getCandidates(driveId)
        }
        let response = {}
        if (cid && currentStatus) {
            let candidate = await candidates.filter(candidate => (candidate.id == cid))[0]
            {
                if (timestamp && currentStatus == "not-arrived") {
                    candidate.arrival_status = "arrived"
                    candidate.arrival_time = timestamp
                    await Candidates.update({
                        arrival_status: "arrived",
                        arrival_time: timestamp
                    }, {
                            where: {
                                id: cid
                            }
                        })
                    await algo.candidateInterviwerEligibilityMapping(candidate.id, 1)
                    response = {
                        arrival_status: candidate.arrival_status,
                        arrival_time: candidate.arrival_time
                    }
                } else if (currentStatus == "arrived") {
                    candidate.arrival_status = "left"
                    await Candidates.update({
                        arrival_status: "left"
                    }, {
                            where: {
                                id: cid
                            }
                        })
                    algo.removeCandidate(cid)
                    response = {
                        arrival_status: candidate.arrival_status,
                        arrival_time: candidate.arrival_time
                    }
                }
            }

            return response
        }
        return false
    }
    async checkCandidateByEmail(email) {
        let candidate = await Candidates.findOne({
            where: {
                email: email
            },
            attributes: ['id']

        })

        if (candidate['bitField'] != undefined)
            return true;
        return false;
    }

    async addCandidate(data) {
        let role = await Roles.findOne({
            where: {
                role_name: data['role']
            },
            attributes: ['id']
        })

        let current_datetime = new Date()
        let currentDate = `${current_datetime.getFullYear()}-${(current_datetime.getMonth() + 1)}-${current_datetime.getDate()}`
        let currentTime = `${current_datetime.getHours()}:${current_datetime.getMinutes()}:${current_datetime.getSeconds()}`

        let drive = await Drives.findOne({
            where: { status: 'Started' },
            attributes: ['id']
        })
        let driveID = (drive) ? drive.get('id') : 0
        if (driveID !== 0) {
            let res = await Candidates.create({
                name: data.name,
                applied_role_id: role.get('id'),
                specialization: data.specialization,
                experience: data.exp,
                company: data.company,
                notice_period: data.notice,
                preferred_location: 'Delhi',//data.prefLoc,
                email: data.email,
                contact: data.contact,
                drive_id: driveID,
                arrival_status: 'arrived',
                arrival_time: `${currentDate} ${currentTime}`,
                created_at: `${currentDate} ${currentTime}`,
                modified_at: `${currentDate} ${currentTime}`
            })
            if (res) {
                this.getCandidates(driveID)
                return {
                    status: true
                }
            }
        }
        return {
            status: false
        }
    }

}

module.exports = new candidateService()