import { IWoxQueryHandler, JsonRPCAction, Logger, Result, ResultItem } from "wox-ts"
import { StreamConfig } from "./StreamConfig"
import * as fs from "fs"
import { ConfigManager } from "./ConfigManager"
import { EntryManager } from "./EntryManager"

export interface StreamHandlerDeps {
  logger: Logger
  configManager: ConfigManager
  entryManager?: EntryManager
}

const METHOD_CREATE_ENTRY = "CREATE"
const METHOD_SET_PATH = "SETPATH"
const METHOD_INVALID = "INVALID"
const COMMAND_CONFIGURE = "path"

export class StreamHandler implements IWoxQueryHandler {
  constructor(private deps: StreamHandlerDeps, private config: StreamConfig) { }

  private getConfigurationAction(command: string): ResultItem {
    const path = command.substr(COMMAND_CONFIGURE.length).trim().replace(/\\\\/g, "\\")
    if (fs.existsSync(path)) {
      return {
        Title: "Configure stream path",
        Subtitle: "Configure stream path to " + path,
        IcoPath: "img/log.png",
        JsonRPCAction: {
          method: METHOD_SET_PATH,
          parameters: [path]
        }
      }
    }
    else {
      return {
        Title: "Configure stream path - invalid path",
        Subtitle: path + " doesn't exist",
        IcoPath: "img/log.png",
        JsonRPCAction: {
          method: METHOD_INVALID,
          parameters: []
        }
      }
    }
  }

  private getMissingConfigAction() {
    return {
      Title: "path {path}",
      Subtitle: "You need to configure the path for Stream",
      IcoPath: "img/log.png",
      JsonRPCAction: {
        method: METHOD_INVALID,
        parameters: []
      }
    }
  }

  private getLogEntryAction(command: string): ResultItem {
    const shortenSubtitle = (subtitle: string) => subtitle.length < 20 ? subtitle : subtitle.substr(0, 19) + "..."
    const logEntryResult =
    {
      Title: "Save log",
      Subtitle: command,
      IcoPath: "img/log.png",
      JsonRPCAction: {
        method: METHOD_CREATE_ENTRY,
        parameters: [command]
      }
    }
    return logEntryResult
  }

  private setPath(path: string) {
    this.config.path = path.replace(/\\\\/g, "\\")
    this.deps.configManager.saveConfig(this.config)
  }

  private createEntry(text: string) {
    this.deps.entryManager?.createEntry(text)
  }

  async processAsync(rpcAction: JsonRPCAction): Promise<Result> {
    let commands = []
    if (rpcAction.method === METHOD_CREATE_ENTRY) {
      this.createEntry(rpcAction.parameters[0])
    } else if (rpcAction.method === METHOD_SET_PATH) {
      this.setPath(rpcAction.parameters[0])
    } else if (rpcAction.method !== METHOD_INVALID) {
      if (rpcAction.parameters[0].startsWith(COMMAND_CONFIGURE)) {
        commands.push(this.getConfigurationAction(rpcAction.parameters[0]))
      } else if (this.deps.entryManager) {
        commands.push(this.getLogEntryAction(rpcAction.parameters[0]))
      } else {
        commands.push(this.getMissingConfigAction())
      }
    }
    return {
      result: commands
    }
  }
}