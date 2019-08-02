// Relationship table: drive - interviewer many to many relationship

const Sequelize = require('../database/mysql').Sequelize
const sequelize = require('../database/mysql').sequelize
const drive = require('../models/drive').Drive
const Users = require('../models/users').Users

const Model = Sequelize.Model;

class Interviewer_drive extends Model { }

Interviewer_drive.init({
  // attributes
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  interviewer_id: {   // FK to interviewer
    type: Sequelize.INTEGER,
    references: {
      model: Users,
      key: 'id',
    },
    allowNull: false
  },
  drive_id: {      // FK to drive
    type: Sequelize.INTEGER,
    references: {
      model: drive,
      key: 'id',
    },
    allowNull: false
  },
  myoe: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  round: {
    type: Sequelize.STRING,
    allowNull: false
  },
  created_by: {
    type: Sequelize.STRING,
    allowNull: false
  },
  modified_by: {
    type: Sequelize.STRING,
    allowNull: false
  },

  created_at: {
    type: Sequelize.DATE,
    allowNull: false
  },
  modified_at: {
    type: Sequelize.DATE,
    allowNull: false
  }
},
  {
    sequelize,
    modelName: 'interviewer_drive',
    timestamps: false

  });

// Interviewer_drive.sync({force:true});

Interviewer_drive.getRunningDrive = async (id) => {
  let statuses = await sequelize.query(`SELECT drives.id 
                                        FROM interviewer_drives 
                                        INNER JOIN drives ON interviewer_drives.drive_id = drives.id
                                        WHERE interviewer_drives.interviewer_id = ${id} AND drives.status = 'Started'`,
                                        { type: Sequelize.QueryTypes.SELECT }
                                      )
  return statuses
}

module.exports = {
  Interviewer_drive
}