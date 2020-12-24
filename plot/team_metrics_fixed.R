fixed <- read.csv(file="team_metrics_fixed.csv")
implemented <- read.csv(file="team_metrics_implemented.csv")

# Get the range for the y axis.
for (i in colnames(fixed)){
  if (i == "sprint" || i == "label") {
      next
  }

  personal_metrics <- fixed[[i]]
  yrange <- c(0, max(personal_metrics) + 10)

  draw_metrics(
    sprintf("%s bugs statistics", i),
    personal_metrics,
    fixed$label,
    yrange,
    "darkgreen"
  )

  personal_metrics <- implemented[[i]]
  yrange <- c(0, max(personal_metrics) + 10)

  draw_metrics(
    sprintf("%s story points statistics", i),
    personal_metrics,
    implemented$label,
    yrange,
    "darkblue"
  )
}
