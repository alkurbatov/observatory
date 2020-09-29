module.exports = {
  // Jira instance we want connect to e.g. 'https://jira.somehost.com'.
  host: undefined,

  // Your Jira login.
  username: undefined,

  // Your Jira password.
  password: undefined,

  // Maximum number of issues processed during single request.
  bulk_limit: 50,

  // JQL filter settings.
  jql: {
    // Name of the project one works on.
    project: undefined,

    // ID of the kanban board used to work with the project.
    board_id: undefined,

    // List of required components.
    // Warning: All values should be escaped in a proper way.
    // e.g:
    // ['WebCP::Frontend', '"UI/UX"', 'SPLA', '"S3 User App"']
    components: [],

    // List of milestones of a project.
    fix_versions: [],

    // Length of single sprint in weeks.
    sprint_length: 2,

    // List of fields requested from the Jira API.
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
    ],
  },

  // Settings of columnized output.
  columnify: {
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
  },
}
