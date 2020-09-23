stats <- read.csv(file="project_stats.csv")

# Get the range for the x and y axis.
xrange <- range(stats$sprint, finite=TRUE)
yrange <- range(stats$open_bugs_total, finite=TRUE)

# Draw a plot with decorations.
plot(
   xrange,
   yrange,
   type="n",
   xaxt="n",
   xlab="",
   ylab="Bugs",
)

axis(
  1,
  at=stats$sprint,
  labels=stats$label,
  las=1,
)

title("Bugs on team")
legend(
  "topleft",
  c("bugs", "bugjail"),
  fill=c("red", "blue"),
  inset=.05,
  horiz=FALSE,
)

# Draw total open issues graph.
lines(
  stats$sprint,
  stats$open_bugs_total,
  type="b",
  lwd=1.5,
  col="red"
)

# Draw bugjail border.
limit <- 30
axis(
  4,
  at=c(limit),
  labels=c(limit),
  col.axis="blue",
  las=2,
  cex.axis=0.7,
)
abline(
  h=limit,
  col="blue"
)
