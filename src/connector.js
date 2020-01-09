'use strict'

const connector = require('jira-connector')


const SprintStates = ['active', 'closed', 'future']

module.exports = class Jira {
  constructor(options) {
    this.connector = new connector({
      host: options.host,
      basic_auth: {
        username: options.username,
        password: options.password,
      },
    })
  }

  boards(project) {
    return this.connector.board.getAllBoards({
      startAt: 0,
      maxResults: 100,
      projectKeyOrId: project,
      includePrivate: true,
    })
  }

  sprints(board, state) {
    if (!SprintStates.includes(state))
      throw new Error('Invalid state specified')

    return this.connector.board.getAllSprints({
      boardId: board,
      startAt: 0,
      maxResults: 100,
      state: state,
    })
  }

  sprint(id) {
    return new Sprint({connector: this.connector, id: id})
  }

  // NOTE (alkurbatov): Use '*all' in the fields array to list
  // all possible fields.
  search(jql, fields) {
    return this.connector.search.search({
      jql: jql.getFilter(),
      startAt: 0,
      maxResults: 1000,
      fields: fields,
    })
  }
}

class Sprint {
  constructor(options) {
    this.connector = options.connector
    this.id = options.id
  }

  show() {
    return this.connector.sprint.getSprint({
      sprintId: this.id,
    })
  }

  issues(jql) {
    return this.connector.sprint.getSprintIssues({
      sprintId: this.id,
      jql: jql.getFilter(),
      fields: [
        'key',
        'resolution',
      ]
    })
  }

  moveIssues(dst_sprint, keys) {
    return this.connector.sprint.moveSprintIssues({
      sprintId: dst_sprint,
      issues: keys,
    })
  }
}
