// Relationship table: driive - role many to many relationship

const Sequelize = require('../database/mysql').Sequelize
const sequelize = require('../database/mysql').sequelize
const drive = require('../models/drive').Drive
const roles = require('../models/roles').Roles
const Model = Sequelize.Model;

class Drive_role extends Model { }
Drive_role.init({
  // attributes
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  drive_id: {               //FK to Drive
    type: Sequelize.INTEGER,
    references: {
      model: drive,
      key: 'id',
    },
    allowNull: false
  },
  role_id: {           // FK to roles
    type: Sequelize.INTEGER,
    references: {
      model: roles,
      key: 'id',
    },
    allowNull: false
  },
  created_by: {
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
    modelName: 'drive_role',
    timestamps: false

  });

// Drive_role.sync();

module.exports = {
  Drive_role
}