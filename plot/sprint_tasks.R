stats <- read.csv(file="project_stats.csv")

# Get the range for the y axis.
yrange <- c(0, max(stats$implemented_this_sprint) + 20)

draw_metrics(
  "Story points statistics",
  stats$implemented_this_sprint,
  stats$label,
  yrange,
  "darkblue"
)
