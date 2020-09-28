const process = require('process')

const chalk = require('chalk')

const DataExporter = require('./exporter')
const DB = require('./storage')

const db = new DB()

function exportData(view) {
  const data = db.get(view)
  if (data.length === 0) {
    console.log(chalk.red('Database is empty. Please, mine data first.'))
    process.exit(1)
  }

  const exporter = new DataExporter({
    dst: `dist/${view}.csv`,
    fields: Object.keys(data[0]),
  })

  exporter.dump(data)

  exporter.shutdown()
}

function main() {
  ;['project_stats', 'unit_test_coverage'].forEach((view) => exportData(view))
}

if (require.main === module) main()
