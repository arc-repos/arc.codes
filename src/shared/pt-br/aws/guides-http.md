<div style=background:papayawhip;padding:10px;border-radius:7px;>Esta tradução para o português ainda está incompleta!</div>

# HTTP Functions

> `.arc` abstracts API Gateway configuration and provisioning, while `@architect/functions` adds a very light but powerful API shim to Lambda for working with HTTP

`.arc` supports the following HTTP Content Types:

|  &nbsp; | Content Type       | Verbs Supported
| ------- | ------------------ | ----------------
| `@html` | `text/html`        | `GET`, `POST`
| `@json` | `application/json` | `GET`, `POST`, `PATCH`, `PUT`, `DELETE`
| `@text` | `text/plain`       | `GET`
| `@css`  | `text/css`         | `GET`
| `@js`   | `text/javascript`  | `GET`
| `@xml`  | `application/xml`  | `GET`, `POST`, `PATCH`, `PUT`, `DELETE`

<style>
tr {
  background: none;
}
tr > td:first-child {
  background: darkgreen;
}
td {
  vertical-align: bottom;
  padding:10px;
  background: #eaeaea
}
</style>

Example `.arc` file:

```arc
@app
testapp

@html
get /

@json
get /api/likes
post /api/likes
patch /api/likes/:likeID
delete /api/likes/:likeID

@text
/robots.txt
/humans.txt

@js
/js/index.js

@css
/css/index.css
```

## Request

Every HTTP handler receives a plain JavaScript object `req` as a first parameter:

```javascript
var arc = require('@architect/functions')

function index(req, res) {
  res({
    html: `<b>hello world</b>` 
  })
}

exports.handler = arc.html.get(index)
```

`req` has the following keys:

- `body` - any `application/x-www-form-urlencoded` form variables as a plain `Object`
- `path` - absolute path of the request
- `method` dependsa on the type of function but one of `GET`, `POST`, `PATCH`, `PUT` and `DELETE`
- `params` - any URL param defined
- `query` - any query params defined
- `headers` - a plain `Object` of request headers 
- `session` - a plain `Object` representing the current session

`req` also has the following hidden helper methods:

- `req._url` - transforms `/` into the appropriate `/staging` or `/production` API Gateway paths
- `req._verify` - verify a `csrf` token
- `req._static` - resolves S3 bucket URLs; pass it a path and it returns the URL appropriate to `localhost:3333`, `staging` or `production`

## Response

`res` is a function that accepts named parameters:

- **Required**: One of 
  - `json` 
  - `html` 
  - `text` 
  - `css` 
  - `js` 
  - `xml` 
  - `location`
- Optionally: `session` to assign to the current session
- Optionally: `status` of:
  - `400` Bad Request
  - `403` Forbidden
  - `404` Not Found
  - `406` Not Acceptable
  - `409` Conflict
  - `415` Unsupported Media Type
  - `500` Internal Serverless Error

The default HTTP status code is `200`. A `302` is sent automatically when redirecting via `location`.

## Examples

Here we have an example handler `200` response of `Content-Type: text/html`:

```javascript
var arc = require('@architect/functions')

function index(req, res) {
  res({
    html: `<b>hello world</b>` 
  })
}

exports.handler = arc.html.get(index)
```

This shows a `302` from a `POST` writing to the `session`:

```javascript
var arc = require('@architect/functions')

function login(req, res) {
  var isLoggedIn = req.body.email === 'admin' && req.body.password === 'admin'
  res({
    session: {isLoggedIn},
    location: req._url('/')
  })
}

exports.handler = arc.html.post(login)
```

This is a `302` response clearing the session data:

```javascript
var arc = require('@architect/functions')

function logout(req, res) {
  res({
    session: {},
    location: req._url('/')
  })
}

exports.handler = arc.html.post(logout)
```

This is an example `500` response:

```javascript
var arc = require('@architect/functions')

// something went wrong!
function fail(req, res) {
  res({
    status: 500,
    html: 'internal "server" error'
  })
}

exports.handler = arc.html.get(fail)
```

## Errors

A `res` may also be invoked with an instance of `Error`.

```javascript
var arc = require('@architect/functions')

// something went wrong!
function fail(req, res) {
  res(Error('internal "server" error'))
}

exports.handler = arc.html.get(fail)
```

By default an `Error` returns with an HTTP status code `500`. If the `Error` passed to `res` contains a property of `code`, `status` or `statusCode` with a value of `403`, `404` or `500` the status code response is updated accordingly.

### Custom Error Pages

The default error response template can be overridden by adding `error.js` to your function's root directory.

`error.js` exports a single default function that accepts an `Error` and returns a non-empty `String`.

```javascript
// src/html/get-index/error.js
module.exports = function error(err) {
  return `
  <!doctype html>
  <html>
    <body>
      <h1>${err.message}</h1>
      <pre>${err.stack}</pre>
    </body>
  </html>
  `
}
```

> Have a look at the [error examples repo](https://github.com/arc-repos/arc-example-errors) and demos at https://wut0.click

## Sessions

All HTTP endpoints are sessions-enabled by default. 

- Session tables are automatically generated by `npx create` with the name `${appname}-staging-sessions` and `${appname}-production-sessions`, respectively 
- Every request is tagged to a session in DynamoDB via a signed cookie `_idx`
- Session data expires after a week of inactivity

Note:

- HTTP endpoints are slower with sessions enabled due to marshalling data to and from DynamoDB
- To disable session support, remove the `SESSION_TABLE_NAME` environment variable from the Lambda configuration in the AWS Console (wherein session becomes a passthrough)
- If disabled you can also delete any corresponding session tables from DynamoDB

## Middleware Pattern

All `.arc` defined HTTP endpoints can register multiple Express-style middleware functions. 

In this example we register `log`, `ping` and `index` to run in series. Each function signals to continue to the next function in the series by calling `next()`. Execution is halted at any time in the chain by calling `res`.

```javascript
var arc = require('@architect/functions')

function log(req, res, next) {
  console.log(JSON.stringify(req, null, 2))
  next()
}

function ping(req, res, next) {
  // does something with SNS here maybe
  next()
}

function index(req, res) {
  res({
    html: 'rendered index'
  })
}

exports.handler = arc.html.get(log, ping, index)
```

## URLs

API Gateway generates long URLs that are hard to read, and extends the URL base path with either `staging` or `production` &mdash; this means a link intended to point at `/` should actually point at `/staging` or `/production`. This pain point is eased if you set up a [custom domain name with DNS](/guides/custom-dns).

`architect` also bundles a hidden helper function `req._url` for resolving URL paths that haven't yet been configured with DNS. This is helpful for early prototyping.

Here is an example index page, protected by authentication middleware, that demonstrates `req._url` usage:

```javascript
var arc = require('@architect/functions')

function auth(req, res, next) {
  if (req.session.isLoggedIn) {
    next()
  }
  else {
    res({
      location: req._url('/login')
    }) 
  }
}

function index(req, res) {
  res({
    html: `<a href=${req._url('/logout')}>logout</a>` 
  })
}

exports.handler = arc.html.get(auth, index)
```

## Example App

Let's implement a proof-of-concept login flow. [Example repo here.](https://github.com/arc-repos/arc-example-login-flow)

This example `.arc` brings together all the concepts for defining HTTP Lambdas:

```arc
@app
example-login-flow

@html
get /
get /logout
get /protected
post /login
```

`npx create` generates the following directory structure:

```bash
/
├── src
│   ├── html
│   │   ├── get-index/
│   │   ├── get-logout/
│   │   ├── get-protected/
│   │   └── post-login/
│   └── shared/
├── .arc
└── package.json
```

First we render a form for `/login` if `req.session.isLoggedIn` is `false`:

```javascript
var arc = require('@architect/functions')

function index(req, res) {
  var header = `<h1>Login Demo</h1>`
  var protec = `<a href=${req._url('/protected')}>protected</a>`
  var logout = `<a href=${req._url('/logout')}>logout</a>`
  var nav = `<p>${protec} | ${logout}</p>`

  var form = `
  <form action=${req._url('/login')} method=post>
    <label for=email>Email</label>
    <input type=text name=email>
    <label for=password>Password</label>
    <input type=password name=password>
    <button>Login</button>
  </form>
  `

  res({
    html: `${header} ${req.session.isLoggedIn? nav : form}`
  })
}

exports.handler = arc.html.get(index)
```

That form performs an HTTP `POST` to `/login` where we look for mock values in `req.body.email` and `req.body.password`:

```javascript
var arc = require('@architect/functions')

function route(req, res) {
  var isLoggedIn = req.body.email === 'admin' && req.body.password === 'admin'
  res({
    session: {isLoggedIn},
    location: req._url(`/`)
  })
}

exports.handler = arc.html.post(route)
```

If successful `req.session.isLoggedIn` will be `true` and `nav` gets rendered. `/protected` utilizes middleware to ensure only logged in users can see it.

```javascript
var arc = require('@architect/functions')

function protect(req, res, next) {
  if (req.session.isLoggedIn) {
    next()
  }
  else {
    res({
      location: req._url(`/`)
    })
  }
}

function attack(req, res) {
  var msg = 'oh hai you must be logged in to see me!'
  var logout = `<a href=${req._url('/logout')}>logout</a>`
  res({
    html: `${msg} ${logout}`
  })
}

exports.handler = arc.html.get(protect, attack)
```

Logging out just resets the `session` and redirects back to `/`.

```javascript
var arc = require('@architect/functions')

function route(req, res) {
  res({
    session: {},
    location: req._url(`/`)
  })
}

exports.handler = arc.html.get(route)
```

And that's it! [Find the example repo here.](https://github.com/arc-repos/arc-example-login-flow)

<hr>
## Next: [Static Assets](/guides/static-assets)
