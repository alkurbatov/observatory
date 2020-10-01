metrics <- read.csv(file="team_metrics_fixed.csv")

# Get the range for the y axis.
for (i in colnames(metrics)){
    if (i == "sprint" || i == "label") {
        next
    }

    personal_metrics <- metrics[[i]]
    yrange <- c(0, max(personal_metrics) + 10)

    current_plot <- barplot(
      personal_metrics,
      main=sprintf("%s bugs statistics", i),
      ylim=yrange,
      names.arg=metrics$label,
      col="darkgreen",
    )

    legend(
      "topleft",
      c("fixed"),
      fill=c("darkgreen"),
    )

    text(
      x=current_plot,
      y=personal_metrics,
      label=personal_metrics,
      pos=3,
      cex=0.8,
      col="blue",
    )

    # Maximum bugs fixed.
    fixed_bugs_max <- max(personal_metrics)
    mtext(
      sprintf("Maximum fixed: %0.1f", fixed_bugs_max),
      side=4, # right
      adj=1,
      las=1,
      padj=-17
    )

    # Average bugs fixed.
    fixed_bugs_mean <- mean(personal_metrics)
    mtext(
      sprintf("Average fixed: %0.1f bugs", fixed_bugs_mean),
      side=4, # right
      adj=1,
      las=1,
      padj=-15
    )
}