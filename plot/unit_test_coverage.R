stats <- read.csv(file="unit_test_coverage.csv")

# Get the range for the x and y axis.
xrange <- range(stats$sprint, finite=TRUE)
yrange <- c(0, 100)

# Settings.
colors <- c("red", "blue", "green", "orange")
line_width <- 0.5
line_type <- "l"

# Draw a plot with decorations.
plot(
   xrange,
   yrange,
   type="n",
   xaxt="n",
   xlab="",
   ylab="%",
)

axis(
  1,
  at=stats$sprint,
  labels=stats$label,
  las=1,
)

title(
  main="Code coverage",
  sub="vstorage-ui-hci"
)

legend(
  "topleft",
  c("statements", "branches", "functions", "lines"),
  fill=colors,
  inset=.05,
  horiz=FALSE,
)

# Draw coverage.
lines(
  stats$sprint,
  stats$statements,
  type=line_type,
  lwd=line_width,
  col=colors[1],
)

lines(
  stats$sprint,
  stats$branches,
  type=line_type,
  lwd=line_width,
  col=colors[2],
)

lines(
  stats$sprint,
  stats$functions,
  type=line_type,
  lwd=line_width,
  col=colors[3],
)

lines(
  stats$sprint,
  stats$lines,
  type=line_type,
  lwd=line_width,
  col=colors[4],
)

# Actual values.
actual <- tail(stats$statements, n=1)
delta <- calc_delta(stats$statements, "f")

mtext(
  sprintf("Statements: %0.2f%% (%s)", actual, delta),
  side=4, # right
  adj=1.1,
  las=1,
  padj=-18
)

actual <- tail(stats$branches, n=1)
delta <- calc_delta(stats$branches, "f")

mtext(
  sprintf("Branches: %0.2f%% (%s)", actual, delta),
  side=4, # right
  adj=1.1,
  las=1,
  padj=-16
)

actual <- tail(stats$functions, n=1)
delta <- calc_delta(stats$functions, "f")

mtext(
  sprintf("Functions: %0.2f%% (%s)", actual, delta),
  side=4, # right
  adj=1.1,
  las=1,
  padj=-14
)

actual <- tail(stats$lines, n=1)
delta <- calc_delta(stats$lines, "f")

mtext(
  sprintf("Lines: %0.2f%% (%s)", actual, delta),
  side=4, # right
  adj=1.1,
  las=1,
  padj=-12
)
