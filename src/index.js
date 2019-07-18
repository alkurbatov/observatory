'use strict'

const config = require('config')
const connector = require('jira-connector')
const DataExporter = require('./exporter')
const Filter = require('./jql')
const statistics = require('./statistics')


const jira = new connector({
  host: config.host,
  basic_auth: {
    username: config.username,
    password: config.password,
  },
})

async function fetchDataBySprint(jql, sprint) {
  let sprint_filter = new Filter(jql.getFilter())
    .and().sprint(`"HCI Sprint ${sprint}"`)
    .and().not().sprint(`"HCI Sprint ${sprint + 1}"`)
  return await fetchData(sprint_filter)
}

async function fetchData(jql) {
  return await jira.search.search({
    jql: jql.getFilter(),
    startAt: 0,
    maxResults: 1000,
    // NOTE (alkurbatov): Use '*all' to list all possible fields.
    fields: [
      'key',
      'summary',
      'reporter',
      'assignee',
      'created',
      'priority',
      'status',
      'resolution',
      'timespent',
      'customfield_10203',
    ]
  })
}

async function main() {
  const last_sprint = config.starting_sprint + config.window_size

  let jql = new Filter()
    .project('VSTOR')
    .and().fixed()
    .and().issueType(['Bug, Bugfix'])
    .and().component(config.jql.components)

  let exporter = new DataExporter('bugs.csv')
  exporter.dump(['SprintId', 'FixedBugs'])

  for (let i = config.starting_sprint; i != last_sprint; i++) {
    let issues = await fetchDataBySprint(jql, i)
    exporter.dump([i, issues.total])
  }

  // FIXME (alkurbatov): Perhaps we should shutdown the streams gracefully?
  //exporter.shutdown()

  jql = new Filter()
    .project('VSTOR')
    .and().fixed()
    .and().issueType(['"Dev task"', '"Dev sub task"', 'Task'])
    .and().component(config.jql.components)

  exporter = new DataExporter('tasks.csv')
  exporter.dump(['SprintId', 'ImplementedTasks', 'TotalStoryPoints'])

  for (let i = config.starting_sprint; i != last_sprint; i++) {
    let issues = await fetchDataBySprint(jql, i)

    exporter.dump([i, issues.total, statistics.sumStoryPoints(issues.issues)])
  }

  // FIXME (alkurbatov): Perhaps we should shutdown the streams gracefully?
  //exporter.shutdown()

  exporter = new DataExporter('fix_rate.csv')
  exporter.dump(['createdLastWeek', 'resolvedLastWeek'])

  jql = new Filter()
    .project('VSTOR')
    .and().issueType(['Bug', 'Bugfix'])
    .and().component(config.jql.components)
    .and().fixVersion(config.jql.fix_versions)
    .and().createdLastWeek()
  let created_last_week = await fetchData(jql)

  jql = new Filter()
    .project('VSTOR')
    .and().issueType(['Bug', 'Bugfix'])
    .and().component(config.jql.components)
    .and().fixVersion(config.jql.fix_versions)
    .and().resolvedLastWeek()
  let resolved_last_week = await fetchData(jql)

  exporter.dump([created_last_week.total, resolved_last_week.total])

  // FIXME (alkurbatov): Perhaps we should shutdown the streams gracefully?
  //exporter.shutdown()
}

if (require.main === module) {
  main()
}

