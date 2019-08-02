const uploadDataService = require('../services/DataFeed/Manager')

const upload = async (req, res) => {
    const { userId, sid, driveId } = req.body
    console.log(req.body)
    let response = await uploadDataService.managerService(userId, sid, driveId)
    res.send({
        status : 200
    })
}

const localUpload = async (req, res) => {
    console.log("REQUEST", req)

    res.send("done");
}

module.exports = {
    upload,
    localUpload
}
