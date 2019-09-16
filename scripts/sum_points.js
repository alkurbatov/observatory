'use strict'

const rooty = require('rooty');
rooty();

const config = require('config')
const connector = require('jira-connector')
const Filter = require('^src/jql')
const statistics = require('^src/statistics')


const jira = new connector({
  host: config.host,
  basic_auth: {
    username: config.username,
    password: config.password,
  },
})

async function fetchData(jql) {
  return await jira.search.search({
    jql: jql.getFilter(),
    startAt: 0,
    maxResults: 1000,
    // NOTE (alkurbatov): Use '*all' to list all possible fields.
    fields: [
      'key',
      'summary',
      'customfield_10203',
    ]
  })
}

async function main() {
  let jql = new Filter()
  jql.unresolved()
    .and().epicLink('VSTOR-21280')
    .and().component(config.jql.components)
    .and().isDevTask()

  let issues = await fetchData(jql)
  let points_sum = statistics.sumStoryPoints(issues.issues)
  console.log(`Story points sum: ${points_sum}`)

  issues.issues.forEach( item => {
    if (item.fields.customfield_10203)
      return

    console.log(`The issue ${item.key} is not estimated`)
  })
}

if (require.main === module) {
  main()
}
