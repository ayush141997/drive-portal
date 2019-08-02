const interviewerService = require('../services/interviewerService')

let submitFeedback = async (req, res) => {
    // console.log("Submit Feedback", req.body.params)
    const { ciid, feedback, status } = req.body.params
    const response = await interviewerService.submitFeedback(ciid, feedback, status)
    if (response) {
        res.send({
            status: 200,
            message: 'Data successfully saved'
        })
        return
    }
    res.send({
        status: 500,
        message: 'Something went wrong'
    })
}

let getSummary = (req, res) => {
    let
}

let addInterviewer = async (req, res) => {
    let { data } = req.body.params
    const response = await interviewerService.addInterviewer(data)
    res.send(response)
}

let getResultsByIid = async (req, res) => {
    let { driveId, iid } = req.query
    const response = await interviewerService.getResultsByIid(iid, driveId)
    res.send(response)
}

let getOverallStatus = async (req, res) => {
    let driveId = req.query.driveId
    let response = await interviewerService.getOverallStatus(driveId)
    res.send(response)
}

/* let removeInterviewer = async (req,res) => {
    res.send({
        status: true
    })
} */

module.exports = {
    getSummary,
    submitFeedback,
    addInterviewer,
    getResultsByIid,
    getOverallStatus
}