const sumStoryPoints = (issues) => {
  return issues.reduce((sum, item) => {
    // NOTE (alkurbatov): Add 'customfield_10203' to config.jql.fields
    // to enable this calculation. In my current version of Jira
    // 'customfield_10203' stands to 'Story Points'.
    if (!item.fields.customfield_10203) return sum

    return sum + item.fields.customfield_10203
  }, 0)
}

/* eslint-disable no-param-reassign */
const countStoryPointsByAssignee = (issues, filter) => {
  return issues.reduce((counter, item) => {
    const assignee = item.fields.assignee.name
    if (!filter.includes(assignee) || !item.fields.customfield_10203)
      return counter

    if (counter[assignee]) {
      counter[assignee] += item.fields.customfield_10203
      return counter
    }

    counter[assignee] = item.fields.customfield_10203
    return counter
  }, {})
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
  countStoryPointsByAssignee,
  sumStoryPoints,
}
