'use strict'

const rooty = require('rooty')
rooty()

const chalk = require('chalk')
const config = require('config')
const commander = require('commander')

const Filter = require('^src/jql')
const Jira = require('^src/connector')
const statistics = require('^src/statistics')


const jira = new Jira({
  host: config.host,
  username: config.username,
  password: config.password,
})
const program = new commander.Command()

program
  .command('sprints []')
  .description('print information about available sprints')
  .option('-f, --filter <sprint_id>', 'filter by particular id', undefined)
  .option('-s, --state <sprint_state>', 'filter by particular state', 'active')
  .action(async function(cmd) {
    try {
      if (cmd.filter) {
        console.log(await jira.sprint(cmd.filter).show())
        process.exit(0)
      }

      console.log(await jira.sprints(config.jql.board_id, cmd.state))
    }
    catch(err) {
      console.error(chalk.red(err))
      process.exit(1)
    }
  })

program
  .command('move <from_sprint_id> <to_sprint_id>')
  .description('move open issues from one sprint to another')
  .option('-d, --dryrun', 'execute command without moving anything', false)
  .action(async function (from_sprint_id, to_sprint_id, cmd) {
    let jql = new Filter()
    jql.project(config.jql.project)
      .and().component(config.jql.components)
      .and().unresolved()
      .and().isIssue()

    let issues = await jira.sprint(from_sprint_id).issues(jql)
    let keys = issues.issues.reduce((result, item) => {
      result.push(item.key)
      return result
    },
    [])
    console.log(`Found ${keys.length} issues:`)
    console.log(keys)

    if (cmd.dryrun)
      process.exit(0)

    await jira.sprint(from_sprint_id).moveIssues(to_sprint_id, keys)
  })

program
  .command('sum <epic_id>')
  .description('sum up story points of the tasks in the provided epic')
  .action(async function (epic_id) {
    const fields = [
      'key',
      'summary',
      'customfield_10203',
    ]

    let jql = new Filter()
    jql.epicLink(epic_id)
      .and().component(config.jql.components)
      .and().isDevTask()

    const all_issues = await jira.search(jql, fields)
    const total_points = statistics.sumStoryPoints(all_issues.issues)

    jql.and().resolved()

    const resolved_issues = await jira.search(jql, fields)
    const burned_points = statistics.sumStoryPoints(resolved_issues.issues)
    let percent_done = total_points ?
      ((100 * burned_points) / total_points).toFixed(1)
      : 0

    console.log(
      `Story points sum: ${burned_points}/${total_points} (${percent_done}%)`)

    all_issues.issues.forEach(item => {
      if (item.fields.customfield_10203)
        return

      console.log(`The issue ${item.key} is not estimated`)
    })
  })

program.parse(process.argv)
