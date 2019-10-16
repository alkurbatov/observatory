'use strict'

const fs = require('fs')
const stringify = require('csv-stringify')


module.exports = class DataExporter {
  constructor(target) {
    this.dst = fs.createWriteStream(target)
    this.dst.on('error', (this.onError).bind(this))

    this.stringifier = stringify({})
    this.stringifier.on('readable', (this.onReadable).bind(this))
    this.stringifier.on('error', (this.onError).bind(this))
  }

  dump(data) {
    this.stringifier.write(data)
  }

  shutdown() {
    this.dst.end()
    this.stringifier.end()
  }

  onReadable() {
    let row

    while((row = this.stringifier.read())) {
      this.dst.write(row)
    }
  }

  onError(err) {
    console.log(err)
  }
}
