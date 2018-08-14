<div style=background:papayawhip;padding:10px;border-radius:7px;>Esta tradução para o português ainda está incompleta!</div>

# `@text`

## `@text` section defines HTTP routes that return `text/plain` content

### Syntax

- Routes must start with a leading slash
- Dashes and underscores are not allowed

### Additional bits

- Advised maximum of 100 characters
- Optional Express-style URL parameters denoted with colons (`:`)
- Currently only `GET` supported, [read more here](/intro/limits)

### Example

This `.arc` file defines some typical text routes:

```arc
@app
testapp

@text
/robots.txt
/humans.txt
```

The `.arc` above generates the following functions:

```bash
/
├── text
¦   ├── get-robots-txt/
│   └── get-humans-txt/
├── .arc
└── package.json
```

## Next: [Defining routes with `@html`](/reference/html)
