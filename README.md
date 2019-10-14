# Observatory

## About
Show nice-looking sprint statistics using the Jira API and the R language.
Also, a collection of handy scripts provided.

## Requirements
* nodejs >= 10
* R language support
* Rscript available in PATH

## Usage
```bash
# Install dependencies.
$ npm install

# Draw the plots.
# The results are exported to Rplots.pdf.
# The raw results are available in *.csv files.
$ npm start

# List available sprints:
$ node bin/observer.js sprints

# Move open issues from one sprint to another:
$ node bin/observer.js move <from_sprint_id> <to_sprint_id>

# Sum up story points of the provided epic:
$ node bin/observer.js sum <epic_id>
```

## License
Copyright (c) 2019

Licensed under the [GPL 3.0 license](LICENSE).
