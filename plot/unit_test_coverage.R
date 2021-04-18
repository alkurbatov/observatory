main <- function() {
  data <- "unit_test_coverage_hci.csv"

  if (!file.exists(data)) {
    return()
  }

  stats <- read.csv(file=data)

  # Get the range for the x and y axis.
  xrange <- range(stats$sprint, finite=TRUE)
  yrange <- c(min(stats$functions) - 10, max(stats$branches) + 20)

  draw_coverage("vstorage-ui-hci", stats, xrange, yrange)

  stats <- read.csv(file="unit_test_coverage_rnt.csv")

  # Get the range for the x and y axis.
  xrange <- range(stats$sprint, finite=TRUE)
  yrange <- c(min(stats$functions) - 10, max(stats$branches) + 20)

  draw_coverage("vstorage-ui-rnt", stats, xrange, yrange)
}

main()
