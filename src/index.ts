import { Logger, WoxQueryProcessor } from "wox-ts"
import { ConfigManager } from "./ConfigManager";
import { EntryManager } from "./EntryManager";
import { StreamHandler } from "./StreamHandler";
const logger = new Logger(true);
const configManager = new ConfigManager()
const config = configManager.loadConfig()
const entryManager = config.path ? new EntryManager(config.path, logger) : undefined
const handler = new StreamHandler({ logger, configManager, entryManager }, config)
const processor = new WoxQueryProcessor(handler, logger);
processor.processFromCommandLineAsync(process.argv).then(() => { });