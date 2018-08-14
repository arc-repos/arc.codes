<div style=background:papayawhip;padding:10px;border-radius:7px;>Esta tradução para o português ainda está incompleta!</div>

# <a id=data.update href=#data.update>`data.tablename.update`</a>

## Update one row in a table

Example:

```.arc
@app
testapp

@html
get /

@tables
accounts
  accountID *String

```

And then in a Lambda function:

```javascript
// src/html/get-index/index.js
let arc = require('@architect/functions')
let data = require('@architect/data')

async function handler(req, res) {
  await data.accounts.update({
    UpdateExpression: 'login = :login' ,
    ExpressionAttributeValues: {
      ':login': req.body.username = 'admin' && req.body.password === 'admin'
    }
  })
  res({
    location: '/'
  })
}

exports.handler = arc.html.post(handler)
```

## Next: [`delete`](/reference/data-delete)
