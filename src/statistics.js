const sumStoryPoints = (issues) => {
  return issues.reduce((sum, item) => {
    if (!item.fields.customfield_10203) return sum

    return sum + item.fields.customfield_10203
  }, 0)
}

/* eslint-disable no-param-reassign */
const countByAssignee = (issues, filter) => {
  return issues.reduce((counter, item) => {
    const assignee = item.fields.assignee.name
    if (!filter.includes(assignee)) return counter

    counter[assignee] = counter[assignee] ? counter[assignee] + 1 : 1
    return counter
  }, {})
}

module.exports = {
  countByAssignee,
  sumStoryPoints,
}
