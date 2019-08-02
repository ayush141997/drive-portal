const driveService = require('../services/driveService')

let addDriveData = async (req, res) => {
    let { data } = req.body.params
    const response = await driveService.addDriveData(data)
    res.send(response)
}

module.exports = {
    addDriveData
}