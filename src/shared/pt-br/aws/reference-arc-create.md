<div style=background:papayawhip;padding:10px;border-radius:7px;>Esta tradução para o português ainda está incompleta!</div>

# `npx create`

Reads `.arc` and generates AWS infrastructure if it does not already exist. This command is intended to be run and re-run as you develop your app and modify the corresponding `.arc` file. Some AWS resources can take a few minutes to create so be patient. 🐢 It's worth it! 

> 🐇 Note: This method can throw errors related to AWS account throttling – if this happens, don't be alarmed! Just wait a few seconds are re-run the command. It just means you're working faster than your AWS account is provisioned to handle. If this problem persists contact AWS support to get a rate limit increase. 🚀

If `ARC_LOCAL` environment variable is present `npx create` will only generate code locally (and will *not* generate AWS infra defined in `.arc`).

<script src="https://asciinema.org/a/182106.js" id="asciicast-182106" async data-autoplay="true" data-size="big"></script>
