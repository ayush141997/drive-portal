const Sequelize = require('../database/mysql').Sequelize
const sequelize = require('../database/mysql').sequelize
const roles = require('../models/roles').Roles
const drive = require('../models/drive').Drive;

const Model = Sequelize.Model;

class Candidates extends Model { }
Candidates.init({
  // attributes
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false

  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
    // allowNull defaults to true
  }
  ,
  applied_role_id: {         // FK to roles
    type: Sequelize.INTEGER,
    references: {
      model: roles,
      key: 'id',
    },
    allowNull: false
  },
  specialization: {
    type: Sequelize.STRING,
    allowNull: false
  },
  experience: {
    type: Sequelize.STRING,
    allowNull: false
  },
  company: {
    type: Sequelize.STRING,
    allowNull: false
  },
  notice_period: {
    type: Sequelize.STRING,
    allowNull: false
  },
  joining_date: {
    type: Sequelize.DATE,
    allowNull: true
  },
  preferred_location: {
    type: Sequelize.STRING,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false
  },
  contact: {
    type: Sequelize.BIGINT,
    allowNull: false

  },
  arrival_status: {
    type: Sequelize.ENUM('not-arrived','arrived','left','no-show'),
    allowNull: false,
    defaultValue: 'not-arrived'
  },
  arrival_time: {
    type: Sequelize.DATE,
    allowNull: false
  },
  drive_id: {                  //FK to Drive
    type: Sequelize.INTEGER,
    references: {
      model: drive,
      key: 'id',
    },
    allowNull: false
  },
  role_alotted: {            // FK to Roles
    type: Sequelize.INTEGER,
    references: {
      model: roles,
      key: 'id',
    },
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
  }
},
  {
    sequelize,
    modelName: 'candidate',
    timestamps: false

  });

// Candidates.sync({alter : true})

module.exports = {
  Candidates
}

