const chalk = require('chalk')
const columnify = require('columnify')
const config = require('config')
const moment = require('moment-business-days')

const Filter = require('./jql')
const Jira = require('./connector')
const log = require('./log').extend('time')

const jira = new Jira({
  host: config.host,
  username: config.username,
  password: config.password,
})

async function main() {
  const args = process.argv.slice(2)
  if (!args.length) {
    console.log(chalk.red('Specify time interval'))
    process.exit(1)
  }

  const period = args[0]
  const startedAfter = moment().subtract(period, 'days').toDate()
  const workDays = moment().businessDiff(moment(startedAfter))

  try {
    for (const person of config.team.members) {
      const jql = new Filter().loggedBy([person]).and().loggedDaysAgo(period)

      // NOTE (alkurbatov): By some reason columnify modifies the provided
      // config so we have to recreate it before next call.
      const displayConfig = {
        truncate: true,
        config: {
          key: {
            minWidth: 14,
          },
          type: {
            minWidth: 10,
          },
          priority: {
            minWidth: 10,
          },
          summary: {
            minWidth: 80,
            maxWidth: 80,
          },
          spent: {
            minWidth: 10,
            maxWidth: 10,
          },
        },
      }

      const data = []
      const logged_time = await jira.search(jql, [
        'key',
        'issuetype',
        'priority',
        'summary',
      ])
      log(logged_time.issues)

      let total = 0
      for (const issue of logged_time.issues) {
        const worklog = await jira.getWorklog(issue.key, startedAfter.getTime())

        let sum = 0
        for (const record of worklog.worklogs) {
          if (record.author.name !== person) continue

          // NOTE (alkurbatov): JIRA API v2 can't properly filter worklog
          // by the startedAfter timestamp. Apply workaround to filter out
          // not relevant worklog.
          const created = new Date(record.created)
          if (created < startedAfter) {
            log(`Dropped log: ${issue.key} ${created} < ${startedAfter}`)
            continue
          }

          sum += record.timeSpentSeconds
        }

        sum /= 3600

        // NOTE (alkurbatov): Cut of logged time < 4m.
        if (sum <= 0.04) continue

        total += sum

        data.push({
          key: issue.key,
          type: issue.fields.issuetype.name,
          priority: issue.fields.priority.name,
          summary: issue.fields.summary,
          spent: `${sum.toFixed(2)}h`,
        })
      }

      console.log(`\n${person} (${total.toFixed(2)}/${workDays * 8})`)
      console.log('---------------------------------------')
      console.log(columnify(data, displayConfig))
    }
  } catch (err) {
    console.error(chalk.red(err.message))
  }
}

if (require.main === module) main()
