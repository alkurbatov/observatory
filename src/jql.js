module.exports = class Filter {
  constructor(jql) {
    this.jql = jql || ''
    this.invert = false
  }

  getFilter() {
    return this.jql
  }

  and() {
    this.jql += ' AND '
    return this
  }

  not() {
    this.invert = true
    return this
  }

  equals(field, value) {
    if (this.invert) {
      this.invert = false
      this.jql += `${field} != ${value}`
      return this
    }

    this.jql += `${field} = ${value}`
    return this
  }

  notEquals(field, value) {
    this.jql += `${field} != ${value}`
    return this
  }

  oneOf(field, values) {
    this.jql += `${field} in (${values.join(', ')})`
    return this
  }

  notOneOf(field, values) {
    this.jql += `${field} not in (${values.join(', ')})`
    return this
  }

  greaterOrEquals(field, value) {
    this.jql += `${field} >= ${value}`
    return this
  }

  raw(data) {
    this.jql += data
    return this
  }

  project(name) {
    return this.equals('project', name)
  }

  issueType(types) {
    return this.oneOf('Type', types)
  }

  isDevTask() {
    return this.issueType(['"Dev task"', '"Dev sub task"', 'Task'])
  }

  isBug() {
    return this.issueType(['Bug', 'Bugfix'])
  }

  isIssue() {
    return this.issueType([
      'Bug',
      'Bugfix',
      '"Dev task"',
      '"Dev sub task"',
      'Task',
    ])
  }

  component(components) {
    return this.oneOf('Component', components)
  }

  fixVersion(versions) {
    return this.oneOf('fixVersion', versions)
  }

  fixed() {
    return this.oneOf('Resolution', ['Fixed', 'Done'])
  }

  rejected() {
    return this.notOneOf('Resolution', ['Fixed', 'Done', 'Unresolved'])
  }

  unresolved() {
    return this.equals('Resolution', 'Unresolved')
  }

  resolved() {
    return this.equals('Status', 'Resolved')
  }

  // NOTE (alkurbatov): Specify either sprint name or id.
  sprint(name) {
    return this.equals('Sprint', name)
  }

  // NOTE (alkurbatov): Specify either name of an epic or epic issue id.
  epicLink(name) {
    return this.equals('"Epic Link"', name)
  }

  createdLastWeek() {
    return this.greaterOrEquals('created', '-1w')
  }

  resolvedLastWeek() {
    return this.greaterOrEquals('resolutiondate', '-1w')
  }

  createdWeeksAgo(count) {
    if (count <= 0) throw new Error('Count should be greater then 0')

    return this.greaterOrEquals('created', `-${count}w`)
  }

  resolvedWeeksAgo(count) {
    if (count <= 0) throw new Error('Count should be greater then 0')

    return this.greaterOrEquals('resolutiondate', `-${count}w`)
  }

  assignedTo(people) {
    if (people.length === 0) throw new Error('Empty assignee list provided')

    return this.oneOf('assignee', people)
  }
}
