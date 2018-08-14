<div style=background:papayawhip;padding:10px;border-radius:7px;>Esta tradução para o português ainda está incompleta!</div>

# `@events`

## `@events` define SNS topics and Lambda handlers for them

### Syntax
- Lowercase alphanumeric string
- Maximum of 50 characters
- Dashes are allowed; underscores are not allowed
- Must begin with a letter

### Example

This `.arc` file defines two `@events`:

```arc
@app
testapp

@events
hit-counter
likes
```

Which generates the corresponding code:

```bash
/
├── events
│   ├── hit-counter/
│   └── likes/
├── .arc
└── package.json
```

And the following deployment Lambdas:

- `testapp-staging-hit-counter`
- `testapp-production-hit-counter`
- `testapp-staging-likes`
- `testapp-production-likes`

## Next: [Scheduling functions with `@scheduled`](/reference/scheduled)
