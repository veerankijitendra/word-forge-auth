import path from "node:path";

import { LOG_LEVELS } from "./logger.constants";

const defaultConfig = {
  development: {
    transport: {
      targets: [
        {
          target: "pino-pretty",
          level: LOG_LEVELS.DEBUG,
          options: {
            colorize: true,
            levelFirst: true,
            translateTime: "SYS:standard",
          },
        },
      ],
    },
    level: LOG_LEVELS.DEBUG,
  },
  staging: {
    transport: {
      targets: [
        {
          target: "pino-pretty",
          level: LOG_LEVELS.INFO,
          options: {
            colorize: false,
            levelFirst: true,
            translateTime: "SYS:standard",
          },
        },
        {
          target: "pino/file",
          level: LOG_LEVELS.ERROR,
          options: {
            destination: path.join(__dirname, "../../../logs/staging-error.log"),
            mkdir: true,
            sync: false,
          },
        },
      ],
    },
    level: LOG_LEVELS.INFO,
    timestamp: () => `,"timestamp":"${new Date().toISOString()}"`,
    messageKey: "message",
    base: {
      env: process.env.NODE_ENV,
      version: process.env.npm_package_version,
    },
  },

  production: {
    transport: {
      targets: [
        {
          target: "pino/file",
          level: LOG_LEVELS.INFO,
          options: {
            destination: path.join(__dirname, "../../../logs/app.log"),
            mkdir: true,
            sync: false,
          },
        },
      ],
    },
    level: LOG_LEVELS.INFO,
    timestamp: () => `,"timestamp":"${new Date().toISOString()}"`,
    // Removed the formatters since they're not compatible with transport targets
    messageKey: "message",
    base: {
      env: process.env.NODE_ENV,
      version: process.env.npm_package_version,
    },
  },
};

export default defaultConfig;
