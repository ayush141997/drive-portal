const Sequelize = require('../database/mysql').Sequelize
const sequelize = require('../database/mysql').sequelize

const Model = Sequelize.Model;
class Status extends Model { }
Status.init({
  // attributes
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  status_name: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false
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
    modelName: 'status',
    timestamps: false

  });

/* Status.sync({alter: true})

Status.bulkCreate([
  {
    status_name: 'Started',
    created_at: new Date(),
    modified_at: new Date()
  },
  {
    status_name: 'R1 Hold',
    created_at: new Date(),
    modified_at: new Date()
  },
  {
    status_name: 'R1 Reject',
    created_at: new Date(),
    modified_at: new Date()
  },
  {
    status_name: 'R2 Hold',
    created_at: new Date(),
    modified_at: new Date()
  },
  {
    status_name: 'R2 Select',
    created_at: new Date(),
    modified_at: new Date()
  },
  {
    status_name: 'R2 Reject',
    created_at: new Date(),
    modified_at: new Date()
  },
  {
    status_name: 'R3 Hold',
    created_at: new Date(),
    modified_at: new Date()
  },

  {
    status_name: 'R3 Select',
    created_at: new Date(),
    modified_at: new Date()
  },
  {
    status_name: 'R3 Reject',
    created_at: new Date(),
    modified_at: new Date()
  },
  {
    status_name: 'HR Hold',
    created_at: new Date(),
    modified_at: new Date()
  },
  {
    status_name: 'HR Select',
    created_at: new Date(),
    modified_at: new Date()
  },
  {
    status_name: 'HR Reject',
    created_at: new Date(),
    modified_at: new Date()
  }
]).then(res => console.log(res)).catch(err => console.error(err))
 */

module.exports = {
  Status
}