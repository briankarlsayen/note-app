to start run delete the previous container: 
  npm run db:dev:rm
then create and run docker container: 
  npm run db:dev:up

create database:
  sequelize db:create // create inside docker container

connect to database using sync models by activating this code:
  await sequelize.sync({ force: true });

connect to database using migration (prefered):
  sequelize db:migrate

start the express server:
  npm run dev
