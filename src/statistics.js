'use strict'

exports.sumStoryPoints = (issues) => {
  return issues.reduce((sum, item) => sum + item.fields.customfield_10203, 0)
}

