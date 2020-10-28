const process = require('process')

const chalk = require('chalk')
const config = require('config')

const DataExporter = require('./exporter')
const DB = require('./storage')

const db = new DB()

function fillWithZeros(data, requiredFields) {
  data.forEach((it) => {
    requiredFields.forEach((field) => {
      /* eslint-disable no-param-reassign */
      if (!it[field]) it[field] = 0
    })
  })
}

function exportData(view, requiredFields = []) {
  const data = db.get(view)
  if (data.length === 0) {
    console.log(chalk.red('Database is empty. Please, mine data first.'))
    process.exit(1)
  }

  // NOTE (alkurbatov): Fill missing values with zeros, otherwise
  // R can't calculate anything.
  if (requiredFields.length) fillWithZeros(data, requiredFields)

  const exporter = new DataExporter({
    dst: `dist/${view}.csv`,
    fields: Object.keys(data[0]),
  })

  exporter.dump(data)

  exporter.shutdown()
}

function main() {
  ;[
    'project_stats',
    'unit_test_coverage_hci',
    'unit_test_coverage_rnt',
  ].forEach((view) => exportData(view))
  ;['team_metrics_fixed'].forEach((view) =>
    exportData(view, config.team.members)
  )
}

if (require.main === module) main()
