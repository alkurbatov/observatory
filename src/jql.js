'use strict'


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

  greaterOrEquals(field, value) {
    this.jql += `${field} >= ${value}`
    return this
  }

  project(project_name) {
    return this.equals('project', project_name)
  }

  issueType(issue_types) {
    return this.oneOf('Type', issue_types)  
  }

  isDevTask() {
    return this.issueType(['"Dev task"', '"Dev sub task"', 'Task'])
  }

  isBug() {
    return this.issueType(['Bug', 'Bugfix'])
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

  unresolved() {
    return this.equals('Resolution', 'Unresolved')
  }

  resolved() {
    return this.equals('Status', 'Resolved')
  }

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
}

