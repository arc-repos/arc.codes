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

---

## Next: [Defining routes with `@http`](/reference/arc/http)

