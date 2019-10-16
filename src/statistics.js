'use strict'

exports.sumStoryPoints = (issues) => {
  return issues.reduce(
    (sum, item) => {
      if (!item.fields.customfield_10203)
        return sum

      return sum + item.fields.customfield_10203
    },
    0)
}
