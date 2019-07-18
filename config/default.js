module.exports = {
  // Jira instance we want connect to e.g. 'pmc.acronis.com'.
  // 'https' is used by default.
  host: undefined,

  // Your Jira login.
  username: undefined,

  // Your Jira password.
  password: undefined,

  // Number of the sprint which will be used as a starting point of
  // analyzing interval.
  starting_sprint: 0,

  // Count of sprints included into analyzing interval.
  window_size: 12,

  // JQL filter settings.
  jql: {
    // Name of the project one works on.
    project: undefined,

    // List of required components.
    // Warning: All values should be escaped in a proper way.
    // e.g:
    // ['WebCP::Frontend', '"UI/UX"', 'SPLA', '"S3 User App"']
    components: [],

    // List of milestones of a project.
    fix_versions: [],
  }
}
