const process = require('process')

const chalk = require('chalk')
const config = require('config')

const DB = require('./storage')
const Filter = require('./jql')
const Jira = require('./connector')
const log = require('./log').extend('mine')
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

  try {
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
      .and()
      .not()
      .assignedTo(config.jql.exclude)
    const open_bugs = await jira.search(jql, config.jql.fields)
    log(`Open bugs total: ${open_bugs.total}`)

    jql = new Filter()
      .project(config.jql.project)
      .and()
      .isBug()
      .and()
      .component(config.jql.components)
      .and()
      .createdWeeksAgo(config.jql.sprint_length)
      .and()
      .not()
      .assignedTo(config.jql.exclude)
    const created_bugs = await jira.search(jql, config.jql.fields)
    log(`Created bugs total: ${created_bugs.total}`)

    jql = new Filter()
      .project(config.jql.project)
      .and()
      .isDevTask()
      .and()
      .component(config.jql.components)
      .and()
      .fixVersion(config.jql.fix_versions)
      .and()
      .unresolved()
      .and()
      .assignedTo(config.team.members)
    const open_tasks = await jira.search(jql, config.jql.fields)
    log(`Open tasks total: ${open_tasks.total}`)

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
      .and()
      .assignedTo(config.team.members)
    const fixed_bugs = await jira.search(jql, config.jql.fields)
    log(`Fixed bugs total: ${fixed_bugs.total}`)

    jql = new Filter()
      .project(config.jql.project)
      .and()
      .isBug()
      .and()
      .rejected()
      .and()
      .component(config.jql.components)
      .and()
      .resolvedWeeksAgo(config.jql.sprint_length)
      .and()
      .not()
      .assignedTo(config.jql.exclude)
    const rejected_bugs = await jira.search(jql, config.jql.fields)
    log(`Rejected bugs total: ${rejected_bugs.total}`)

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
      .and()
      .assignedTo(config.team.members)
    const finished_tasks = await jira.search(jql, config.jql.fields)
    log(`Finished tasks total: ${finished_tasks.total}`)

    const stats = {
      sprint,
      label: `Sprint ${sprint}`,
      open_bugs_total: open_bugs.total,
      todo_total: statistics.sumStoryPoints(open_tasks.issues),
      created_this_sprint: created_bugs.total,
      fixed_this_sprint: fixed_bugs.total,
      rejected_this_sprint: rejected_bugs.total,
      implemented_this_sprint: statistics.sumStoryPoints(finished_tasks.issues),
    }

    db.save('project_stats', stats)

    const metrics_fixed = {
      sprint,
      label: `Sprint ${sprint}`,
      ...statistics.countByAssignee(fixed_bugs.issues, config.team.members),
    }

    db.save('team_metrics_fixed', metrics_fixed)
  } catch (err) {
    console.error(chalk.red(err.message))
  }
}

if (require.main === module) main()
