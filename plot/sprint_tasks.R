stats <- read.csv(file="project_stats.csv")

current_plot <- barplot(
  stats$implemented_this_sprint,
  main="Dev Tasks statistics",
  ylim=c(0, 100),
  names.arg=stats$label,
)

text(
  x=current_plot,
  y=stats$implemented_this_sprint,
  label=stats$implemented_this_sprint,
  pos=3,
  cex=0.8,
  col="blue",
)

# Average story points burned
story_points_mean <- mean(stats$implemented_this_sprint)
mtext(
  sprintf("Average speed: %0.2f story points", story_points_mean),
  side=4, # right
  adj=1,
  las=1,
  padj=-20
)
