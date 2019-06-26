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

async function fetchData(jql, sprint) {
  let sprint_filter = new Filter(jql.getFilter())
    .and().sprint(`"HCI Sprint ${sprint}"`)
    .and().not().sprint(`"HCI Sprint ${sprint + 1}"`)

  return await jira.search.search({
    jql: sprint_filter.getFilter(),
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
  jql.project('VSTOR')
    .and().resolved()
    .and().issueType(['Bug, Bugfix'])
    .and().component(config.jql.components)

  let exporter = new DataExporter('bugs.csv')
  exporter.dump(['SprintId', 'ResolvedBugs'])

  for (let i = config.starting_sprint; i != last_sprint; i++) {
    let issues = await fetchData(jql, i)
    exporter.dump([i, issues.total])
  }

  jql.reset()

  jql.project('VSTOR')
    .and().resolved()
    .and().issueType(['"Dev task"', '"Dev sub task"'])
    .and().component(config.jql.components)

  // FIXME (alkurbatov): Perhaps we should shutdown the streams gracefully?
  //exporter.shutdown()

  exporter = new DataExporter('tasks.csv')
  exporter.dump(['SprintId', 'ImplementedTasks', 'TotalStoryPoints'])

  for (let i = config.starting_sprint; i != last_sprint; i++) {
    let issues = await fetchData(jql, i)

    exporter.dump([i, issues.total, statistics.sumStoryPoints(issues.issues)])
  }

  // FIXME (alkurbatov): Perhaps we should shutdown the streams gracefully?
  //exporter.shutdown()
}

if (require.main === module) {
  main()
}

