stats <- read.csv(file="project_stats.csv")

# Get the range for the x and y axis.
xrange <- range(stats$sprint, finite=TRUE)
yrange <- range(stats$open_bugs_total, finite=TRUE)

# Draw a plot with decorations.
plot(
   xrange,
   c(yrange[1], yrange[2] + 30),
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
  fill=c("red", "darkgreen"),
  inset=.05,
  horiz=FALSE,
)

# Draw total open issues graph.
lines(
  stats$sprint,
  stats$open_bugs_total,
  type="o",
  lwd=1.5,
  col="red",
  pch=19, # solid circle.
)

text(
  stats$sprint,
  stats$open_bugs_total,
  labels=stats$open_bugs_total,
  pos=3,
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
  col="darkgreen",
  lwd=1.5,
)

# Draw delta
delta <- calc_delta(stats$open_bugs_total)
mtext(
  sprintf("Sprint delta: %s", delta),
  side=4, # right
  adj=1.1,
  las=1,
  padj=-18
)
