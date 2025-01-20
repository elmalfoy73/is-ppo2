import { Logger } from "@nestjs/common";

export const sequelizeLogger = (message) => {
  const logger = new Logger('Sequelize');
  logger.log(message);
}