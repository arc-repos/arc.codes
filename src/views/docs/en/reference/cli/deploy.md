---
title: arc deploy
description: Architect deploy is a module to deploy SAM and CloudFormation templates to an AWS account
sections:
  - Overview
  - Usage
  - Flags
---

Deploys code to AWS.

## Usage

```bash
arc deploy [production|static|direct]
```

## Flags

- `[--no-hydrate]` Do not automatically run `npm`, `bundle` or `pip`
- `[dirty, --dirty, -d]` Overwrite staging Lambda with local source. A faster way to deploy and test small changes to individual functions without redeploying an entire stack. 
- `[--dry-run]` Creates a CloudFormation template but does not deploy it. A dry-run allows you to check the CloudFormation and SAM output before deploying the actual stack.
- `[production, --production, -p]` Deploys a CloudFormation stack to a production stack.
- `[prune, --prune]` Remove assets not present in the local static folder.
- `[static, --static, -s]` Deploys only the files in the static folder.
- `[verbose, --verbose, -v]` Displays the full deploy status messages.
- `[tags, --tags, -t]` Adds resource tags to the CloudFormation stack.
- `[name, --name, -n]` Deploy a custom named staging stack.

## Examples

### Deploy a staging stack

```bash
arc deploy
```

> Protip: deploy arbitrary named staging stacks with `arc deploy --name my-stack`

### Deploy a production stack

```bash
arc deploy production
```

### Deploy static assets to S3

```bash
arc deploy static
```

### Deploy code directly to the staging Lambda

```bash
arc deploy dirty src/http/get-index
```

### Run deploy without deploying

This is useful for testing `@macros`; it will still generate `sam.json`.

```bash
arc deploy --dry-run
```

