import { AppConfig } from './config.js';
/**
 * Load configuration from a config file and environment variables
 * @param configFilePath - Path to the configuration file
 * @returns The loaded configuration
 */
export declare function loadConfig(configFilePath?: string): AppConfig;
export default loadConfig;
