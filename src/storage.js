const FileSync = require('lowdb/adapters/FileSync')
const low = require('lowdb')

class DB {
  constructor() {
    this.db = low(new FileSync('db.json'))

    this.db
      .defaults({
        project_stats: [],
        unit_test_coverage: [],
      })
      .write()
  }

  saveProjectStats(data) {
    const project_stats = this.db.get('project_stats')
    const existing_record = project_stats.find({ sprint: data.sprint })

    if (existing_record.value()) {
      existing_record.assign(data).write()
      return
    }

    project_stats.push(data).write()
  }

  get(view) {
    return this.db.get(view).value()
  }
}

module.exports = DB
