const statistics = require('statistics')


test('Sum storypoints', () => {
  const issues = [
    { 'fields': {'customfield_10203': 0.125} },
    { 'fields': {'customfield_10203': 0.2} },
    { 'fields': {'customfield_10203': 0.5} },
    { 'fields': {'customfield_10203': 1} },
    { 'fields': {'customfield_10203': 2} },
    { 'fields': {'customfield_10203': 5} },
  ]

  const data = statistics.sumStoryPoints(issues)
  expect(data).toEqual(8.825)
})

test('Sum story points but ignore missing data', () => {
  const issues = [
    { 'fields': {'customfield_10203': 5} },
    { 'fields': {'customfield_10203': undefined} },
    { 'fields': {'customfield_10203': 5} },
    { 'fields': {'customfield_10203': null} },
    { 'fields': {'customfield_10203': 5} },
    { 'fields': {} },
  ]

  const data = statistics.sumStoryPoints(issues)
  expect(data).toEqual(15)
})
