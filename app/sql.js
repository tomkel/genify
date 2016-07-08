const Sequelize = require('sequelize')
const sequelize = new Sequelize('genify', null, null, { 
  dialect: 'sqlite',
  storage: './genify.db',
})

sequelize.authenticate()
  .then(() =>
    console.log('Connection has been established successfully.')
  ).catch(err =>
    console.log('Unable to connect to the database:', err)
  )

const Track = sequelize.define('track', {
  id: {
    type: Sequelize.STRING,
    primaryKey: true,
    allowNull: false,
  },
})
