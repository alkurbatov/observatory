const { Client } = require('jira.js')

const log = require('./log').extend('jira')

const SprintStates = ['active', 'closed', 'future']

class Sprint {
  constructor(options) {
    this.client = options.client
    this.id = options.id
  }

  show() {
    return this.client.sprint.getSprint({
      sprintId: this.id,
    })
  }

  issues(jql) {
    return this.client.sprint.getSprintIssues({
      sprintId: this.id,
      jql: jql.getFilter(),
      maxResults: 1000,
      fields: ['key', 'resolution'],
    })
  }

  // NOTE (alkurbatov): Bulk operation, up to bulk_limit issues
  // can be processed at once.
  moveIssues(dst_sprint, keys) {
    return this.client.sprint.moveSprintIssues({
      sprintId: dst_sprint,
      issues: keys,
    })
  }
}

module.exports = class Jira {
  constructor(options) {
    this.client = new Client({
      host: options.host,
      authentication: {
        basic: {
          username: options.username,
          apiToken: options.password,
        },
      },
    })
  }

  boards(project) {
    return this.client.board.getAllBoards({
      startAt: 0,
      maxResults: 100,
      projectKeyOrId: project,
      includePrivate: true,
    })
  }

  sprints(board, state) {
    if (!SprintStates.includes(state))
      throw new Error('Invalid state specified')

    return this.client.board.getAllSprints({
      boardId: board,
      startAt: 0,
      maxResults: 100,
      state,
    })
  }

  sprint(id) {
    return new Sprint({ client: this.client, id })
  }

  // NOTE (alkurbatov): Use '*all' in the fields array to list
  // all possible fields.
  search(jql, fields) {
    log(`Executing search request: \n${jql.getFilter()}`)

    return this.client.issueSearch.searchForIssuesUsingJqlGet({
      jql: jql.getFilter(),
      startAt: 0,
      maxResults: 1000,
      fields,
    })
  }
}
