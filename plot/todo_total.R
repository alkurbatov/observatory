stats <- read.csv(file="project_stats.csv")

# Get the range for the x and y axis.
xrange <- range(stats$sprint, finite=TRUE)
yrange <- range(stats$todo_total, finite=TRUE)

# Draw a plot with decorations.
plot(
   xrange,
   c(yrange[1], yrange[2] + 30),
   type="n",
   xaxt="n",
   xlab="",
   ylab="Story points",
)

axis(
  1,
  at=stats$sprint,
  labels=stats$label,
  las=1,
)

# Draw total story points graph.
lines(
  stats$sprint,
  stats$todo_total,
  type="o",
  lwd=1.5,
  col="darkblue",
  pch=19, # solid circle.
)

text(
  stats$sprint,
  stats$todo_total,
  labels=stats$todo_total,
  pos=3,
)

# Draw delta
delta <- calc_delta(stats$todo_total, format="f")
mtext(
  sprintf("Sprint delta: %s", delta),
  side=4, # right
  adj=1.1,
  las=1,
  padj=-18
)
