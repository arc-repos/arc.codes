<div style=background:papayawhip;padding:10px;border-radius:7px;>Esta tradução para o português ainda está incompleta!</div>

# <a id=arc.tables.insert href=#arc.tables.insert>`arc.tables.insert`</a>

## Respond to data being inserted into a DynamoDB table

```javascript
var arc = require('@architect/functions')

function handler(record, callback) {
  console.log(JSON.stringify(record, null, 2))
  callback()
}

exports.handler = arc.tables.insert(handler)
```
