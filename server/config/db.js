import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('mydb', 'root', 'skrtj!@#0720', {
  host: 'localhost',
  dialect: 'mysql',
});

export default sequelize;
