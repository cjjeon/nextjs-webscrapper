# NextJS Webscrapper

This repository is inspired by [VercelGL](https://github.com/vikiival/vercelgl) repository of setting up puppeteer in
vercel.

## Installation

Make sure you run `pnpm` install. Otherwise, it may not work
`pnpm install`

## Setup

Update `.env` file for authorization token.

## Running

Run below to start the development
`pnpm run dev`

### Using browser

Navigate to web browser for http://localhost:3000

You will see two sections: URL and Token.

* URL - the website you want to crawl
* TOKEN - The authorization token that you set in `.env` file

Once the endpoint successfully return, You should see the markdown file of html.

---
You can also run shell script to get what you want.

Make sure to replace variable for $TOKEN and $URL

```shell
curl 'http://localhost:3000/api/scrape' \
  -H 'Authorization: Bearer $TOKEN' \
    --data-raw '{"url":"$URL"}'
```

## Deploy on Vercel

There is one thing that you need to configure before deploying to Vercel.

You must be using pnpm to deploy and using node version 18.

You can configure this in the settings tab.
