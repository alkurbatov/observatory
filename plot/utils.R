# Calculate delta between the last value and the value before lst
# in the provided vector.
# Returns: formatted string.
calc_delta <- function(vector, format="d") {
  length <- length(vector)
  delta <- vector[length] - vector[length - 1]

  sign <- ""
  if (delta > 0) {
      sign <- "+"
  }

  if (format == "f") {
    return(sprintf("%s%0.2f", sign, delta))
  }

  return(sprintf("%s%d", sign, delta))
}
