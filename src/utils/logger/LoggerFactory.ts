import pino from "pino";
import { ENVIRONMENTS } from "./logger.constants";
import defaultConfig from "./logger.config";

class LoggerFactory {
  static #instance: LoggerFactory | null = null;
  #logger: pino.Logger | null = null;

  constructor() {
    if (LoggerFactory.#instance) {
      return LoggerFactory.#instance;
    }

    LoggerFactory.#instance = this;
  }

  initialize(options = {}) {
    const env = (process.env.NODE_ENV || ENVIRONMENTS.DEVELOPMENT) as keyof typeof defaultConfig;
    const baseConfig = defaultConfig[env];
    try {
      this.#logger = pino({
        ...baseConfig,
        ...options,
      });

      this.#logger.info(
        {
          env,
          nodeVersion: process.version,
          pid: process.pid,
        },
        "Logger initialized successfully",
      );
    } catch (error: unknown) {
      console.error("Error initializing logger:", error);
      this.#logger = pino({
        level: "info",
        timestamp: true,
      });
    }

    return this.#logger;
  }

  getLogger() {
    if (!this.#logger) {
      this.initialize();
    }
    return this.#logger;
  }

  createChildLogger(bindings: Record<string, unknown>) {
    const logger = this.getLogger()!;
    return logger.child(bindings);
  }
}

export default new LoggerFactory();
