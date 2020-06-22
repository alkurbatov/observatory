const Filter = require('jql')

test('createdLastWeek forms correct filter', () => {
  const jql = new Filter().createdLastWeek()
  expect(jql.getFilter()).toEqual('created >= -1w')
})

test('resolvedLastWeek forms correct filter', () => {
  const jql = new Filter().resolvedLastWeek()
  expect(jql.getFilter()).toEqual('resolutiondate >= -1w')
})

test('createdWeeksAgo forms correct filter', () => {
  const jql = new Filter().createdWeeksAgo(10)
  expect(jql.getFilter()).toEqual('created >= -10w')
})

test('createdWeeksAgo throws on invalid data', () => {
  expect(() => {
    new Filter().createdWeeksAgo(0)
  }).toThrow('Count should be greater then 0')

  expect(() => {
    new Filter().createdWeeksAgo(-10)
  }).toThrow('Count should be greater then 0')
})

test('resolvedWeeksAgo forms correct filter', () => {
  const jql = new Filter().resolvedWeeksAgo(10)
  expect(jql.getFilter()).toEqual('resolutiondate >= -10w')
})

test('resolvedWeeksAgo throws on invalid data', () => {
  expect(() => {
    new Filter().resolvedWeeksAgo(0)
  }).toThrow('Count should be greater then 0')

  expect(() => {
    new Filter().resolvedWeeksAgo(-10)
  }).toThrow('Count should be greater then 0')
})
