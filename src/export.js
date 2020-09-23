const DataExporter = require('./exporter')
const DB = require('./storage')

const db = new DB()

async function main() {
  const data = db.getProjectStats()

  const exporter = new DataExporter({
    dst: 'project_stats.csv',
    fields: Object.keys(data[0]),
  })

  exporter.dump(data)

  exporter.shutdown()
}

if (require.main === module) main()
