const candidateService = require('../services/candidateService')

let getAllData = async (req, res) => {
    let driveId = req.query.driveId
    console.log("In candidateController ==> Drive ID==>", driveId)
    let response = await candidateService.getAllData(driveId)
    res.send(response)
}

let getAllArrivedData = async (req, res) => {
    let driveId = req.query.driveId
    console.log("In candidateController 2==> Drive ID==>", driveId)
    let response = await candidateService.getAllArrivedData(driveId)
    res.send(response)
}

let getData = async (req, res) => {
    let cid = req.query.cid
    let driveId = req.query.driveId
    let response = await candidateService.getData(cid, driveId)
    res.send(response)
}

let setArrivalStatus = async (req, res) => {
    const { cid, timestamp, currentStatus, driveId } = req.body
    const response = await candidateService.setArrivalStatus(cid, timestamp, currentStatus, driveId)
    console.log('Arrival Status', response)
    if (response && Object.keys(response).length !== 0) {
        res.send({
            status: 200,
            data: response
        })
        return
    }
    res.send({
        status: 500
    })
}

let checkCandidate = async (req, res) => {
    let email = req.body.email;
    console.log(email)
    let response = await candidateService.checkCandidateByEmail(email)
    if (!response)
        res.sendFile('/register.html', { root: 'public' });
    else
        res.send('<h1>You have marked as arrived</h1>')
}

let registerCandidate = async (req, res) => {
    let data = req.body;
    let response = candidateService.addCandidate(data)
    if(response){
        res.send(response) 
        return
    }
    res.send({
        status : false
    })
}

module.exports = {
    getAllData,
    getData,
    getAllArrivedData,
    setArrivalStatus,
    checkCandidate,
    registerCandidate
}