const dashboardService = require('../services/dashboardService')
const algo = require('../algorithm')

let index = async (req, res) => {
    const uid = req.query.userID
    const driveId = req.query.driveId
    let response = await dashboardService.getDashData(uid, driveId)
    res.send(response)
}

let interviewerData = async (req, res) => {
    let driveId = req.query.driveId
    let response = await dashboardService.getInterviewerData(driveId)
    res.send(response)
}

let getMapping = async (req, res) => {
    algo.getMapping()
    res.send({
        status: 200
    })
}

module.exports = {
    index,
    interviewerData,
    getMapping
}