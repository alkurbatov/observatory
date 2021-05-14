const secondsToTime = (seconds) => {
  if (seconds === 0) return '0'

  if (seconds < 60) return `${seconds}s`

  if (seconds < 3600) {
    const rem = seconds % 60
    if (rem) return `${(seconds - rem) / 60}m ${secondsToTime(rem)}`

    return `${seconds / 60}m`
  }

  if (seconds < 28800) {
    const rem = seconds % 3600
    if (rem) return `${(seconds - rem) / 3600}h ${secondsToTime(rem)}`

    return `${seconds / 3600}h`
  }

  const rem = seconds % 28800
  if (rem) return `${(seconds - rem) / 28800}d ${secondsToTime(rem)}`

  return `${seconds / 28800}d`
}

module.exports = {
  secondsToTime,
}
