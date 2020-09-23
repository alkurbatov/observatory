const process = require('process')

const chalk = require('chalk')
const config = require('config')

const DB = require('./storage')
const Filter = require('./jql')
const Jira = require('./connector')
const statistics = require('./statistics')

const jira = new Jira({
  host: config.host,
  username: config.username,
  password: config.password,
})

const db = new DB()

async function main() {
  const args = process.argv.slice(2)
  if (!args.length) {
    console.log(chalk.red('Specify sprint number, e.g. npm run mine -- 73'))
    process.exit(1)
  }
  const sprint = Number.parseInt(args[0], 10)

  let jql = new Filter()
    .project(config.jql.project)
    .and()
    .isBug()
    .and()
    .component(config.jql.components)
    .and()
    .fixVersion(config.jql.fix_versions)
    .and()
    .unresolved()
  const open_bugs = await jira.search(jql, config.jql.fields)

  jql = new Filter()
    .project(config.jql.project)
    .and()
    .isBug()
    .and()
    .component(config.jql.components)
    .and()
    .createdWeeksAgo(2)
  const created_bugs = await jira.search(jql, config.jql.fields)

  jql = new Filter()
    .project(config.jql.project)
    .and()
    .isBug()
    .and()
    .fixed()
    .and()
    .component(config.jql.components)
    .and()
    .sprint(`"HCI Sprint ${sprint}"`)
    .and()
    .not()
    .sprint(`"HCI Sprint ${sprint + 1}"`)
  const fixed_bugs = await jira.search(jql, config.jql.fields)

  jql = new Filter()
    .project(config.jql.project)
    .and()
    .isBug()
    .and()
    .rejected()
    .and()
    .component(config.jql.components)
    .and()
    .sprint(`"HCI Sprint ${sprint}"`)
    .and()
    .not()
    .sprint(`"HCI Sprint ${sprint + 1}"`)
  const rejected_bugs = await jira.search(jql, config.jql.fields)

  jql = new Filter()
    .project(config.jql.project)
    .and()
    .fixed()
    .and()
    .isDevTask()
    .and()
    .component(config.jql.components)
    .and()
    .sprint(`"HCI Sprint ${sprint}"`)
    .and()
    .not()
    .sprint(`"HCI Sprint ${sprint + 1}"`)
  const finished_tasks = await jira.search(jql, config.jql.fields)

  const stats = {
    sprint,
    label: `Sprint ${sprint}`,
    open_bugs_total: open_bugs.total,
    created_this_sprint: created_bugs.total,
    fixed_this_sprint: fixed_bugs.total,
    rejected_this_sprint: rejected_bugs.total,
    implemented_this_sprint: statistics.sumStoryPoints(finished_tasks.issues),
  }

  db.saveProjectStats(stats)
}

if (require.main === module) main()
