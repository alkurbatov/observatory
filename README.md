# Observatory

[![CI](https://github.com/alkurbatov/observatory/actions/workflows/ci.yml/badge.svg)](https://github.com/alkurbatov/observatory/actions/workflows/ci.yml)

## About

Show nice-looking sprint statistics using the Jira API and the R language.
Also, a collection of handy scripts provided.

## Requirements

- nodejs >= 12
- R language support
- Rscript available in PATH

## Basic usage

```bash
# Install dependencies.
$ npm install

# Fill required config values,
# see config/default.js.

# Export currently used config to shell env,
# e.g. for config/frontend.json:
$ export NODE_CONFIG_ENV=frontend

# Collect the data using provided config,
$ run mine -- <sprint-number>

# Draw the plots.
# The results are exported to Rplots.pdf.
# The raw results are available in *.csv files.
$ npm run plot
```

## Additional options

```bash
# Run with the application with additional debug logs,
# specify the DEBUG variable, e.g.:
$ DEBUG="observatory:*" NODE_CONFIG_ENV=frontend npm run mine -- 74

# List available sprints:
$ node bin/observer.js sprints

# Move open issues from one sprint to another:
$ node bin/observer.js move <from_sprint_id> <to_sprint_id>

# Sum up story points of the provided epic:
$ node bin/observer.js sum <epic_id>
```

## License

Copyright (c) 2019-2021 Alexander Kurbatov

Licensed under the [GPL 3.0 license](LICENSE).
