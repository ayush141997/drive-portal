const sequelize = require('../database/mysql').sequelize
const Sequelize = require('../database/mysql').Sequelize
const Users = require('./users').Users
const roles = require('./roles').Roles
const candidates = require('./candidates').Candidates
const status = require('./status').Status
const drive = require('./drive').Drive



const Model = Sequelize.Model;
class Can_interviewer extends Model { }
Can_interviewer.init({
  // attributes

  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  can_id: {               // FK to candidate
    type: Sequelize.INTEGER,
    references: {
      model: candidates,
      key: 'id',
    },
    allowNull: false
  },
  interviewer_id: {        //FK to interviewer
    type: Sequelize.INTEGER,
    references: {
      model: Users,
      key: 'id',
    },
    allowNull: false
  },
  status_id: {            // FK to status
    type: Sequelize.INTEGER,
    references: {
      model: status,
      key: 'id'
    },
    allowNull: true
  },
  round: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  feedback: {
    type: Sequelize.TEXT,
    allowNull: true
  },
  created_by: {
    type: Sequelize.INTEGER,
    allowNull: true
  },
  modified_by: {
    type: Sequelize.INTEGER,
    allowNull: true
  },
  created_at: {
    type: Sequelize.DATE,
    allowNull: false
  },
  modified_at: {
    type: Sequelize.DATE,
    allowNull: false
  },
  role_id: {                 // FK to roles
    type: Sequelize.INTEGER,
    references: {
      model: roles,
      key: 'id',
    },
    allowNull: false
  },
  drive_id: {                 // FK to roles
    type: Sequelize.INTEGER,
    references: {
      model: drive,
      key: 'id',
    },
    allowNull: false
  },
},
{
  sequelize,
  modelName: 'can_interviewer',
  timestamps: false
});

// Can_interviewer.sync({alter:true})

module.exports = {
  Can_interviewer
}