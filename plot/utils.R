# Calculate delta between the last value and the value before lst
# in the provided vector.
# Returns: string result
calc_delta <- function(vector) {
  length <- length(vector)
  delta <- vector[length] - vector[length - 1]

  if (delta > 0) {
    return(sprintf("+%0.2f", delta))
  }

  return(sprintf("%0.2f", delta))
}
