stats <- read.csv(file="project_stats.csv")

# Prepare the data.
bugs_stats <- subset(stats, select=c("created_this_sprint", "fixed_this_sprint", "rejected_this_sprint"))
bugs_matrix <- as.matrix(bugs_stats)
bugs_matrix <- t(bugs_matrix)
colnames(bugs_matrix) <- stats$label

# Get the range for the y axis.
local_maximum <- which(bugs_matrix == max(bugs_matrix), arr.ind = TRUE)
yrange <- c(0, bugs_matrix[local_maximum] + 20)

# Draw sprints statistics bar plot.
current_plot <- barplot(
  bugs_matrix,
  ylim=yrange,
  main="Bugs statistics",
  col=c("darkred", "darkgreen", "gray"),
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

# Maximum bugs fixed.
fixed_bugs_max <- max(stats$fixed_this_sprint)
mtext(
  sprintf("Maximum fixed: %0.1f", fixed_bugs_max),
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
