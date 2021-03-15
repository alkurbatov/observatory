const chalk = require('chalk')
const config = require('config')
const columnify = require('columnify')
const commander = require('commander')

const Filter = require('../src/jql')
const Jira = require('../src/connector')
const statistics = require('../src/statistics')

const jira = new Jira({
  host: config.host,
  username: config.username,
  password: config.password,
})
const program = new commander.Command()

program
  .command('boards')
  .description('print information about available boards')
  .action(async function () {
    try {
      console.log(await jira.boards(config.jql.project))
    } catch (err) {
      console.error(chalk.red(err))
      process.exit(1)
    }
  })

program
  .command('sprints []')
  .description('print information about available sprints')
  .option('-f, --filter <sprint_id>', 'filter by particular id', undefined)
  .option(
    '-s, --state <sprint_state>',
    'filter by particular state: active, closed or future',
    'active'
  )
  .action(async function (cmd) {
    try {
      if (cmd.filter) {
        console.log(await jira.sprint(cmd.filter).show())
        process.exit(0)
      }

      console.log(await jira.sprints(config.jql.board_id, cmd.state))
    } catch (err) {
      console.error(chalk.red(err))
      process.exit(1)
    }
  })

program
  .command('move <from_sprint_id> <to_sprint_id>')
  .description('move open issues from one sprint to another')
  .option('-d, --dryrun', 'execute command without moving anything', false)
  .action(async function (from_sprint_id, to_sprint_id, cmd) {
    const jql = new Filter()
    jql
      .project(config.jql.project)
      .and()
      .component(config.jql.components)
      .and()
      .unresolved()
      .and()
      .isIssue()

    const issues = await jira.sprint(from_sprint_id).issues(jql)
    const keys = issues.issues.reduce((result, item) => {
      result.push(item.key)
      return result
    }, [])
    console.log(`Found ${keys.length} issues:`)
    console.log(keys)

    if (cmd.dryrun) process.exit(0)

    for (let i = 0; i < keys.length; i += config.bulk_limit) {
      const portion = keys.slice(i, i + config.bulk_limit)
      // eslint-disable-next-line no-await-in-loop
      await jira.sprint(from_sprint_id).moveIssues(to_sprint_id, portion)
    }
  })

program
  .command('sum <epic_id>')
  .description('sum up story points of the tasks in the provided epic')
  .action(async function (epic_id) {
    const fields = ['key', 'summary', 'resolution', 'customfield_10203']

    const jql = new Filter()
    jql
      .epicLink(epic_id)
      .and()
      .component(config.jql.components)
      .and()
      .isDevTask()

    const all_issues = await jira.search(jql, fields)
    if (!all_issues.issues.length) {
      console.log('No issues found, please, check your filter')
      process.exit(1)
    }

    const total_points = statistics.sumStoryPoints(all_issues.issues)

    jql.and().resolved()

    const resolved_issues = await jira.search(jql, fields)
    const burned_points = statistics.sumStoryPoints(resolved_issues.issues)
    const percent_done = total_points
      ? ((100 * burned_points) / total_points).toFixed(1)
      : 0

    const data = []
    all_issues.issues.forEach((item) => {
      data.push({
        key: item.key,
        points: item.fields.customfield_10203 || '???',
        state:
          (item.fields.resolution && item.fields.resolution.name) || 'Open',
      })
    })

    const displayConfig = {
      config: {
        points: {
          align: 'right',
          minWidth: 10,
        },
        state: {
          align: 'right',
          minWidth: 10,
        },
      },
    }

    console.log(columnify(data, displayConfig))
    console.log('---------------------------------------')
    console.log(
      `Story points sum: ${burned_points}/${total_points} (${percent_done}%)`
    )
  })

program.parse(process.argv)
