# Markdown-to-HTML
## Grabs markdown parses it to handlebars as html
Dependencies
- express-handlebars
- markdown-it
- mkdirp
- walker
- lodash
- del

```
Unable to squash bug: app.js line 64

var htmlFileName = htmlFolder + '/' + (dir.split('/').shift().join('/')) + '.html';
                                                             ^
                                                             TypeError: dir.split(...).shift(...).join is not a function
Error thrown at beginning of join('/') function
```
