const Roles = require('../../models/roles').Roles;
const candidates = require('../../models/candidates').Candidates
const drive = require('../../models/drive').Drive
const users = require('../../models/users').Users
const interviewer_role = require('../../models/interviewer_role').Interviewer_role
const candidateService = require('../candidateService')

// using map for fetching role id corresponding to role names
let map = new Map();

let userId
let driveID
let current_datetime = new Date()
let currentDate = `${current_datetime.getFullYear()}-${(current_datetime.getMonth() + 1)}-${current_datetime.getDate()}`
let currentTime = `${current_datetime.getHours()}:${current_datetime.getMinutes()}:${current_datetime.getSeconds()}`

class Feed {


    constructor(id, driveId) {
        userId = id
        driveID = driveId
    }

    feedRoles(doc) {
        doc.getRows(1, function (err, rows) {
            let data = [];
            rows.map(row => {
                console.log(row);

                let temp = { 'role_name': row.rolename, 'created_by': row.createdby }
                data.push(temp);
            });
            console.log(data)
            roles.bulkCreate(data);
        });
    }


    feedCandidates(doc) {
        console.log('in spread')

        doc.getRows(1, async function (err, rows) {

            let data = []

            rows.map(async (row) => {
                if (map.size == 0) {
                    let roles = await Roles.findAll()
        
                    for (let index = 0; index < roles.length; index++) {
                        if (!map.has(roles[index].get('role_name'))) {
                            map.set(roles[index].get('role_name'), roles[index].get('id'));
                        }
                    }
        
                }
                // console.log("result" + map.get(row.role))
                let temp = {
                    name: row.name,
                    applied_role_id: map.get(row.role),
                    specialization: row.specialization,
                    experience: row.experience,
                    company: row.company,
                    notice_period: row.noticeperiod,
                    preferred_location: row.preferredlocation,
                    email: row.email,
                    contact: row.contact,
                    drive_id: driveID,
                    created_by: userId,
                    modified_by: userId,
                    created_at: `${currentDate} ${currentTime}`,
                    modified_at: `${currentDate} ${currentTime}`
                }
                data.push(temp)
                if (data.length == rows.length) {
                    console.log(data)
                    candidates.bulkCreate(data);
                    candidateService.getCandidates(driveID)
                }
            });
        });
    }


    feedDrive(doc) {
        doc.getRows(1, function (err, rows) {

            let data = [];

            rows.map(row => {
                let temp = {
                    name: row.name,
                    location: row.location,
                    started_by: row.startedby
                }
                data.push(temp)
            });
            drive.bulkCreate(data)
        });
    }

    feedInterviewers(doc) {
        doc.getRows(1, function (err, rows) {
            let data = [];
            let userid;
            rows.map(async (row) => {

                //To fetch User ID of interviewer
                await users.findOne({ where: { email: row.email } }).then(res => {
                    userid = res.dataValues.id;
                })
                let temp = {
                    name: row.name,
                    myoe: row.myoe,
                    profile: row.profile,
                    round: row.rounds,
                    user_id: userid,
                    email: row.email
                }
                // console.log(temp.name)
                await data.push(temp);
                let role_array = row.role.split(',');
                // console.log("ROLE"+role_array)          
                new Feed().feedInter_Roles(role_array, userid);
            });

            // setTimeout( ()=>{
            //     interviewers.bulkCreate(data)
            // },9000)


        });
    }


    feedInter_Roles(role_array, userid) {
        // store info of roles of each interviewer

        role_array.map((i) => {

            let id = map.get(i)
            console.log("???????????????????" + id);
            interviewer_role.create({
                interviewer_id: userid,
                role_id: id

            })
        })
    }
}

module.exports = {
    Feed
}