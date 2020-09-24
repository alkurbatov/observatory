const process = require('process')

const chalk = require('chalk')

const DataExporter = require('./exporter')
const DB = require('./storage')

const db = new DB()

async function main() {
  const data = db.getProjectStats()
  if (data.length === 0) {
    console.log(chalk.red('Database is empty. Please, mine data first.'))
    process.exit(1)
  }

  const exporter = new DataExporter({
    dst: 'project_stats.csv',
    fields: Object.keys(data[0]),
  })

  exporter.dump(data)

  exporter.shutdown()
}

if (require.main === module) main()
