const Jira = require('connector')

test('Not throw on valid sprint states', () => {
  const jira = new Jira({})

  expect(() => {
    jira.sprints(123, 'active')
    jira.sprints(123, 'closed')
    jira.sprints(123, 'future')
  }).not.toThrow()
})

test('Throw on invalid sprint states', () => {
  const jira = new Jira({})

  expect(() => {
    jira.sprints(123, 'xxx')
  }).toThrow('Invalid state specified')

  expect(() => {
    jira.sprints(123, '')
  }).toThrow('Invalid state specified')

  expect(() => {
    jira.sprints(123, null)
  }).toThrow('Invalid state specified')

  expect(() => {
    jira.sprints(123, undefined)
  }).toThrow('Invalid state specified')
})
