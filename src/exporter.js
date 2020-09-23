const fs = require('fs')
const { parse } = require('json2csv')

module.exports = class DataExporter {
  constructor({ dst, fields }) {
    this.dst = fs.openSync(dst, 'w')
    this.fields = fields
    this.header = true
  }

  dump(data) {
    const csv = parse(data, { fields: this.fields, header: this.header })
    fs.appendFileSync(this.dst, `${csv}\n`)

    this.header = false
  }

  shutdown() {
    fs.closeSync(this.dst)
  }
}
