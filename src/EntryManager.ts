import * as fs from "fs"
import * as path from "path"
import { exec } from 'child_process';
import { Logger } from "wox-ts";

const d = (date: Date, opt: Intl.DateTimeFormatOptions) => {
  return date.toLocaleString("en-us", opt)
}

export class EntryManager {
  constructor(private dir: string, private logger: Logger) {
    // this.dir = this.dir
    //   .replace(/\\\\/, '\\')
    //   .replace(/\/\//, '/')
  }

  createEntry(content: string) {
    const date = new Date
    const day = d(date, { year: "numeric" }) + "-" +
      d(date, { month: "2-digit" }) + "-" +
      d(date, { day: "2-digit" })
    const time = d(date, {
      hour: "2-digit", hour12: false
    }) + "-" +
      d(date, { minute: "2-digit" }) + "-" +
      d(date, { second: "2-digit" })

    const file = day + "-" + time.replace(/:/g, "-") + ".md"
    const dateForTitle = date.toLocaleString("en-us", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      weekday: "short"
    })
    const fileContent = `---
title: ${dateForTitle}
---

${content}`
    const filePath = path.join(this.dir, file)
    fs.writeFileSync(filePath, fileContent)

    // exec(`cmd 'cd "${this.dir}" && git add -A && git commit -m "Add ${dateForTitle}" && git push origin master'`,
    //   (error, stdout, stderr) => {
    //     if (error) {
    //       this.logger.log(`Error: ` + error)
    //     }
    //     if (stdout) {
    //       this.logger.log(`Command returned: ` + stdout)
    //     }
    //     if (stderr) {
    //       this.logger.log(`Command errored: ` + stderr)
    //     }
    //   })
  }
}