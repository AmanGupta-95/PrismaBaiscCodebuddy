import express from 'express';
import config from './config/config';
import { prisma } from './config/prisma';

const app = express();

app.use(express.json());

const startServer = async () => {
  prisma.$connect().then(() => {
    console.log('Connected to the database successfully.');
  });
  app.listen(config.port, () => {
    console.log(
      `Server is running on port ${config.port} in ${config.nodeEnv} mode.`,
    );
  });
};

startServer().catch((error) => {
  prisma.$disconnect();
  console.error('Failed to start server:', error);
  process.exit(1);
});
