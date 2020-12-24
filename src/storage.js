const FileSync = require('lowdb/adapters/FileSync')
const low = require('lowdb')

class DB {
  constructor() {
    this.db = low(new FileSync('db.json'))

    this.db
      .defaults({
        project_stats: [],
        unit_test_coverage_hci: [],
        unit_test_coverage_rnt: [],
        team_metrics_fixed: [],
        team_metrics_implemented: [],
      })
      .write()
  }

  save(view, data) {
    const records = this.db.get(view)
    const existing_record = records.find({ sprint: data.sprint })

    if (existing_record.value()) {
      existing_record.assign(data).write()
      return
    }

    records.push(data).write()
  }

  get(view) {
    return this.db.get(view).value()
  }
}

module.exports = DB
