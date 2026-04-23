import express from 'express';
import config from './config/config';

const app = express();

app.use(express.json());

const startServer = async () => {
  app.listen(config.port, () => {
    console.log(
      `Server is running on port ${config.port} in ${config.nodeEnv} mode.`,
    );
  });
};

startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
