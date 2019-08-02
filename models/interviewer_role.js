// Relationship table: interviewer - role many to many relationship

const Sequelize = require('../database/mysql').Sequelize
const sequelize = require('../database/mysql').sequelize
const Users = require('../models/users').Users
const roles = require('../models/roles').Roles
const InterviewerDrive = require('../models/interviewer_drive').Interviewer_drive

const Model = Sequelize.Model;
class Interviewer_role extends Model {}
Interviewer_role.init({
  // attributes
  id: {
    type: Sequelize.INTEGER,
    primaryKey:true,
    autoIncrement: true,
    allowNull: false
  },
  interviewer_id: {       //FK to interviewers
    type: Sequelize.INTEGER,
    references: {
      model: Users,
      key: 'id',
     },
     allowNull: false
    // allowNull defaults to true
  },
  
  role_id:{           // FK to roles
    type:Sequelize.INTEGER,
    references: {
      model: roles,
      key: 'id',
     },
     allowNull: false
  },
  interviewer_drive_id:{           // FK to interviewer drive
    type:Sequelize.INTEGER,
    references: {
      model: InterviewerDrive,
      key: 'id',
     },
     allowNull: false
  },
  created_by:{
    type: Sequelize.INTEGER,
    allowNull: false
  },
  modified_by: {
    type: Sequelize.INTEGER,
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
  modelName: 'interviewer_role',
  timestamps:false
  
});

// Interviewer_role.sync({force:true})

module.exports={
  Interviewer_role
}