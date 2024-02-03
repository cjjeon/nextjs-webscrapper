import chrome from '@sparticuz/chromium';
import {NodeHtmlMarkdown} from "node-html-markdown";
import puppeteer from "puppeteer-core";

export const maxDuration = 60; // This function can run for a maximum of 5 seconds
export const dynamic = 'force-dynamic';

const sleep = (ms: number) => {
    return new Promise((resolve) => {
        setTimeout(resolve, ms)
    })
}

async function getOption() {
    if (process.env.NODE_ENV === 'production') {
        return {
            args: chrome.args,
            executablePath: await chrome.executablePath(),
            headless: chrome.headless,
        }
    }

    if (process.platform === 'win32') {
        return {
            args: [],
            executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
            headless: true
        }
    }

    return {
        args: [],
        executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
        headless: true
    }
}

export async function POST(req: Request) {
    const authorization = req.headers.get('Authorization')
    if (!authorization) {
        return new Response('Not Authorized', {status: 400})
    }
    const authToken = authorization.replace('Bearer ', '')
    if (authToken !== process.env.AUTH_TOKEN) {
        return new Response('Not Authorized', {status: 400})
    }

    console.log("environment mode: " + process.env.NODE_ENV)
    console.log("scraping...")

    const {url, delay} = await req.json()
    let timeDelay = delay || 3000

    console.log("launching browser...")
    const option = await getOption()
    const browser = await puppeteer.launch(option)

    console.log("opening new page...")
    const page = await browser.newPage()

    console.log("navigating to " + url + "...")
    await page.goto(url, {timeout: 0})

    console.log("add delay for javascript update")
    await sleep(timeDelay)

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
    return Response.json({markdown})
}
