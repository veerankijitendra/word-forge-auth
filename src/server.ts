import app from './app';
import { env } from './config/env';
import { connectDB } from './config/db';

const startServer = async () => {
  await connectDB();

  app.listen(env.PORT, () => {
    console.log(`Server is running in ${process.env.NODE_ENV || 'development'} mode on port ${env.PORT}`);
  });
};

startServer();
