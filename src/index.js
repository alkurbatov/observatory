const config = require('config')
const DataExporter = require('./exporter')
const Filter = require('./jql')
const Jira = require('./connector')
const statistics = require('./statistics')

const jira = new Jira({
  host: config.host,
  username: config.username,
  password: config.password,
})

const fields = [
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

async function fetchDataBySprint(jql, sprint) {
  const sprint_filter = new Filter(jql.getFilter())
    .and()
    .sprint(`"HCI Sprint ${sprint}"`)
    .and()
    .not()
    .sprint(`"HCI Sprint ${sprint + 1}"`)
  return jira.search(sprint_filter, fields)
}

async function main() {
  const last_sprint = config.starting_sprint + config.window_size

  let jql = new Filter()
    .project(config.jql.project)
    .and()
    .isBug()
    .and()
    .fixed()
    .and()
    .component(config.jql.components)

  let exporter = new DataExporter('bugs.csv')
  exporter.dump(['SprintId', 'FixedBugs'])

  for (let i = config.starting_sprint; i !== last_sprint; i++) {
    // eslint-disable-next-line no-await-in-loop
    const issues = await fetchDataBySprint(jql, i)
    exporter.dump([i, issues.total])
  }

  // FIXME (alkurbatov): Perhaps we should shutdown the streams gracefully?
  // exporter.shutdown()

  jql = new Filter()
    .project(config.jql.project)
    .and()
    .fixed()
    .and()
    .isDevTask()
    .and()
    .component(config.jql.components)

  exporter = new DataExporter('tasks.csv')
  exporter.dump(['SprintId', 'ImplementedTasks', 'TotalStoryPoints'])

  for (let i = config.starting_sprint; i !== last_sprint; i++) {
    // eslint-disable-next-line no-await-in-loop
    const issues = await fetchDataBySprint(jql, i)

    exporter.dump([i, issues.total, statistics.sumStoryPoints(issues.issues)])
  }

  // FIXME (alkurbatov): Perhaps we should shutdown the streams gracefully?
  // exporter.shutdown()

  exporter = new DataExporter('fix_rate.csv')
  exporter.dump(['createdLastWeek', 'resolvedLastWeek'])

  jql = new Filter()
    .project(config.jql.project)
    .and()
    .isBug()
    .and()
    .component(config.jql.components)
    .and()
    .fixVersion(config.jql.fix_versions)
    .and()
    .createdWeeksAgo(config.qa_vs_dev.period)
  const created_last_week = await jira.search(jql, fields)

  jql = new Filter()
    .project(config.jql.project)
    .and()
    .isBug()
    .and()
    .component(config.jql.components)
    .and()
    .fixVersion(config.jql.fix_versions)
    .and()
    .resolvedWeeksAgo(config.qa_vs_dev.period)
  const resolved_last_week = await jira.search(jql, fields)

  exporter.dump([created_last_week.total, resolved_last_week.total])

  // FIXME (alkurbatov): Perhaps we should shutdown the streams gracefully?
  // exporter.shutdown()
}

if (require.main === module) main()
