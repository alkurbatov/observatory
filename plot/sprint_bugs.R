stats <- read.csv(file="project_stats.csv")

# Prepare the data.
bugs_stats <- subset(stats, select=c("created_this_sprint", "fixed_this_sprint", "rejected_this_sprint"))
bugs_matrix <- as.matrix(bugs_stats)
bugs_matrix <- t(bugs_matrix)
colnames(bugs_matrix) <- stats$label

# Get the range for the y axis.
yrange <- c(0, max(bugs_matrix) + 20)

# Draw sprints statistics bar plot.
current_plot <- barplot(
  bugs_matrix,
  ylim=yrange,
  main="Bugs statistics",
  col=c("red", "darkgreen", "gray"),
  beside=TRUE,
)

text(
  x=current_plot,
  y=bugs_matrix,
  label=bugs_matrix,
  pos=3,
  cex=0.8,
  col="blue",
)

legend(
  "topleft",
  c("created", "fixed", "rejected"),
  fill=c("darkred", "darkgreen", "gray"),
)

# Created bugs fixed.
created_bugs_mean <- mean(stats$created_this_sprint)
mtext(
  sprintf("Average created: %0.1f", created_bugs_mean),
  side=4, # right
  adj=1,
  las=1,
  padj=-20
)

# Average bugs fixed.
fixed_bugs_mean <- mean(stats$fixed_this_sprint)
mtext(
  sprintf("Average fixed: %0.1f", fixed_bugs_mean),
  side=4, # right
  adj=1,
  las=1,
  padj=-18
)
