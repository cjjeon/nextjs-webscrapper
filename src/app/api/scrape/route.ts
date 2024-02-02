import chrome from 'chrome-aws-lambda';
import {NodeHtmlMarkdown} from "node-html-markdown";
import puppeteer from "puppeteer-core";

const sleep = (ms: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}


export async function POST(req: Request) {
  console.log("environment mode: " + process.env.NODE_ENV)

  console.log("scraping...")

  const {url, delay} = await req.json()
  let timeDelay = delay || 4000

  console.log("launching browser...")
  const browser = await puppeteer.launch(
    process.env.NODE_ENV === 'production'
      ? {
        args: chrome.args,
        executablePath: await chrome.executablePath,
        headless: chrome.headless,
      }
      : {
        args: [],
        executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
        headless: true
      }
  )

  console.log("opening new page...")
  const page = await browser.newPage()

  console.log("setting request interception...")
  await page.setRequestInterception(true)
  page.on("request", (request) => {
    const reqType = request.resourceType()
    if (reqType === "document") {
      request.continue()
    } else if (process.env.NODE_ENV === "development") {
      request.continue()
    } else {
      console.log("block request type: " + request.resourceType())
      request.abort()
    }
  })

  console.log("navigating to " + url + "...")
  await page.goto(url, {timeout: 0})

  if (process.env.NODE_ENV === "development") {
    await sleep(4000)
    console.log("add delay for javascript update")
  }

  console.log("get page content...")

  const html =
    process.env.NODE_ENV === "development"
      ? await page.content()
      : await page.evaluate(() => {
        // @ts-ignore
        return document.querySelector("body").innerHTML
      })

  console.log("convert html to markdown...")
  const markdown = NodeHtmlMarkdown.translate(html)

  console.log("closing browser...")
  await browser.close()

  console.log("done.")
  return Response.json({html, markdown})
}
