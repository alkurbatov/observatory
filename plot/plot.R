bugs <- read.csv(file="bugs.csv")

fixed_issues <- barplot(
  bugs$ResolvedBugs,
  main="Fixed bugs",
  xlab="Sprints",
  ylab="Total",
  ylim=c(0, 100),
  names.arg=bugs$SprintId,
)

text(
  x = fixed_issues,
  y = bugs$ResolvedBugs,
  label = bugs$ResolvedBugs,
  pos = 3,
  cex = 0.8,
  col = "blue",
)

tasks <- read.csv(file="tasks.csv")
implemented_tasks <- barplot(
  tasks$ImplementedTasks,
  main="Implemented tasks",
  xlab="Sprints",
  ylab="Total",
  ylim=c(0, 40),
  names.arg=tasks$SprintId,
)

text(
  x = implemented_tasks,
  y = tasks$ImplementedTasks,
  label = tasks$ImplementedTasks,
  pos = 3,
  cex = 0.8,
  col = "blue",
)

total_story_points <- barplot(
  tasks$TotalStoryPoints,
  main="Total story points",
  xlab="Sprints",
  ylab="Total",
  ylim=c(0, 100),
  names.arg=tasks$SprintId,
)

text(
  x = total_story_points,
  y = tasks$TotalStoryPoints,
  label = tasks$TotalStoryPoints,
  pos = 3,
  cex = 0.8,
  col = "blue",
)

