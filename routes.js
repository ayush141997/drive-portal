const loginController = require('./controllers/loginController')
const dashboardController = require('./controllers/dashboardController')
const candidateController = require('./controllers/candidateController')
const interviewerController = require('./controllers/interviewerController')
const uploadDataController = require('./controllers/uploadDataController')
const DriveController = require('./controllers/driveController')

module.exports = (app) => {

    
    app.post('/checkLoginStatus', loginController.verifyLogin)

    app.post('/login', loginController.verifyLogin)

    app.use(loginController.verifyCaller)

    app.get('/interviewerDashboard', dashboardController.index)

    app.get('/getAllCandidateData', candidateController.getAllData)

    app.get('/getAllArrivedCandidateData', candidateController.getAllArrivedData)

    app.get('/getCandidateData', candidateController.getData)

    app.post('/submitFeedback', interviewerController.submitFeedback)

    app.get('/getInterviewSummary', interviewerController.getSummary)

    app.post('/setArrivalStatus', candidateController.setArrivalStatus)

    app.post('/submitInterviewerData', interviewerController.addInterviewer)

    app.post('/submitDriveData', DriveController.addDriveData)

    app.post('/uploadData', uploadDataController.upload)

    app.get('/getResultsByIid', interviewerController.getResultsByIid)

    app.get('/getQrCode', loginController.getQrCode);

    app.get('/checkin', loginController.checkIn);

    app.post('/checkCandidate', candidateController.checkCandidate);

    app.post('/registerCandidate', candidateController.registerCandidate);

    app.post('/localFileUpload', uploadDataController.localUpload);

    app.get('/getOverallStatus', interviewerController.getOverallStatus)

    app.get('/getInterviewersData', dashboardController.interviewerData)

    app.get('/getMapping', dashboardController.getMapping)

    // app.get('/deleteInterviewerById', interviewerController.removeInterviewer)

    /* app.get('*', (req, res) => {
        console.log('hi')
        res.sendFile('index.html',
            { root: 'public' });
    }) */
}