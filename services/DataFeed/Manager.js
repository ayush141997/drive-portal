const { Feed } = require('./feed')

const GoogleSpreadsheet = require('google-spreadsheet');
const creds = require('../../drive_secret.json');

class Manager {

  managerService(userId, spreadsheet_id, driveId) {
    var doc = new GoogleSpreadsheet(spreadsheet_id);
    var title = '';
    doc.useServiceAccountAuth(creds, async function (err) {
      if(err){
        console.error(err)
      }
      doc.getInfo(function (err, info) {
        if(err){
          console.error(err)
        }
        title = info.title;
        console.log('Title: ' + title)
        // console.log("888888",driveId)
        let feed = new Feed(userId, driveId);

        switch (title) {
          case 'Roles': console.log('Role Spreadsheet')
            feed.feedRoles(doc);
            break;

          case 'Candidate Details': console.log('Candidate Sheet')
            feed.feedCandidates(doc)
            break;

          case 'DriveInfo': feed.feedDrive(doc);
            break;

          case 'Interviewer': feed.feedInterviewers(doc);
        }
      })

    });
    return {
      status : true,
      message : "Success"
    }
  }
}

module.exports = new Manager();
