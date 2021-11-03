import * as fs from "fs"
import { StreamConfig } from "./StreamConfig";

const file = "stream-config.json"

export class ConfigManager {
  saveConfig(config: StreamConfig) {
    const serialized = JSON.stringify(config)
    fs.writeFileSync(file, serialized)
  }
  loadConfig(): StreamConfig {
    if (fs.existsSync(file)) {
      const content = fs.readFileSync(file).toString()
      return JSON.parse(content) as StreamConfig
    }
    return {
      path: ""
    }
  }
}