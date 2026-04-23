import express from 'express';
import config from './config/config.js';
import routes from './routes/routes.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is healthy',
  });
});

app.use('/api', routes);

app.use(errorHandler);

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
