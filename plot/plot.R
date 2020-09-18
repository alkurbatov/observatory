# Created vs Resolved issues
fix_rate <- scan("fix_rate.csv", sep=",", skip=1, quiet=TRUE)
vs_labels <- paste(c("Bugs reported", "Bugs resolved"), "\n", fix_rate, sep="")
pie(
  fix_rate,
  labels=vs_labels,
  main="Devs VS QA (last three weeks)",
  col=rainbow(length(vs_labels))
)

bugs <- read.csv(file="bugs.csv")

fixed_issues <- barplot(
  bugs$FixedBugs,
  main="Fixed bugs",
  xlab="Sprints",
  ylab="Total",
  ylim=c(0, 100),
  names.arg=bugs$SprintId,
)

text(
  x=fixed_issues,
  y=bugs$FixedBugs,
  label=bugs$FixedBugs,
  pos=3,
  cex=0.8,
  col="blue",
)

# Implemented dev tasks and storypoints
tasks <- read.csv(file="tasks.csv")
total_story_points <- barplot(
  tasks$TotalStoryPoints,
  main="Total story points",
  xlab="Sprints",
  ylab="Total",
  ylim=c(0, 100),
  names.arg=tasks$SprintId,
)

text(
  x=total_story_points,
  y=tasks$TotalStoryPoints,
  label=tasks$TotalStoryPoints,
  pos=3,
  cex=0.8,
  col="blue",
)

# Average story points burned
story_points_mean <- mean(tasks$TotalStoryPoints)
mtext(
  sprintf("Average: %0.2f", story_points_mean),
  4, # right
  adj=1,
  las=1,
  padj=-22
)

