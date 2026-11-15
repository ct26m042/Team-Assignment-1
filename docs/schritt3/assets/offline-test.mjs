// Offline-Testdurchlauf für Relay: drei Szenarien aus Schritt 3 D.
// Aufruf: node offline-test.mjs <projektordner> <ausgabeordner>
import { spawn } from 'node:child_process'
import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import puppeteer from 'puppeteer-core'

const [project, out, distV2] = process.argv.slice(2)
mkdirSync(out, { recursive: true })
const EDGE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'
const BASE = 'http://localhost:4173'
const log = []
const note = (msg) => { console.log(msg); log.push(msg) }

let server
async function startServer(outDir = 'dist') {
  server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', 'preview', '--port', '4173', '--strictPort', '--outDir', outDir], { cwd: project })
  for (let i = 0; i < 50; i++) {
    try { await fetch(BASE); note(`[server] online (${outDir === 'dist' ? 'Build v1' : 'Build v2'})`); return } catch { await new Promise((r) => setTimeout(r, 200)) }
  }
  throw new Error('server did not start')
}
async function stopServer() {
  server.kill()
  await new Promise((r) => server.once('exit', r))
  note('[server] gestoppt (Verbindungsabbruch zum Origin)')
}

async function launch() {
  return puppeteer.launch({
    executablePath: EDGE,
    headless: true,
    userDataDir: mkdtempSync(join(tmpdir(), 'relay-test-')),
    defaultViewport: { width: 1000, height: 760 },
  })
}

async function waitForController(page) {
  return page.evaluate(async () => {
    await navigator.serviceWorker.ready
    if (!navigator.serviceWorker.controller) {
      await new Promise((r) => navigator.serviceWorker.addEventListener('controllerchange', r, { once: true }))
    }
    return navigator.serviceWorker.controller.scriptURL
  })
}

async function cacheReport(page) {
  return page.evaluate(async () => {
    const report = {}
    for (const name of await caches.keys()) {
      const keys = await (await caches.open(name)).keys()
      report[name] = keys.map((req) => new URL(req.url).pathname)
    }
    return report
  })
}

async function snapshot(page, file) {
  await page.screenshot({ path: join(out, file) }).catch(async () => {
    // Die Browser-Fehlerseite hängt in einem neuen Frame, darum direkt über CDP aufnehmen.
    const session = await page.createCDPSession()
    const { data } = await session.send('Page.captureScreenshot', { format: 'png' })
    writeFileSync(join(out, file), Buffer.from(data, 'base64'))
  }).catch((e) => note(`  screenshot ${file} -> ${e.message}`))
  const state = await page.evaluate(() => ({
    url: location.pathname,
    h1: document.querySelector('h1')?.textContent.trim() ?? null,
    cards: document.querySelectorAll('main li').length,
    online: navigator.onLine,
    controlled: Boolean(navigator.serviceWorker?.controller),
    body: document.body.innerText.slice(0, 160).replace(/\s+/g, ' '),
  })).catch((error) => ({ error: String(error) }))
  note(`  ${file}: ${JSON.stringify(state)}`)
  return state
}

async function goOffline(page) {
  await stopServer()
  await page.setOfflineMode(true)
  note('[client] DevTools-Offline-Modus aktiv')
}

async function goto(page, path) {
  try {
    await page.goto(BASE + path, { waitUntil: 'networkidle0', timeout: 10000 })
  } catch (error) {
    note(`  goto ${path} -> ${error.message.split('\n')[0]}`)
  }
}

// Szenario 1: einmal online laden, dann offline die Session-Übersicht neu öffnen.
note('\n== Szenario 1: Programm online geladen, dann offline neu geöffnet')
await startServer()
let browser = await launch()
let page = await browser.newPage()
await page.setCacheEnabled(false)
await goto(page, '/programm')
note(`  SW kontrolliert: ${await waitForController(page)}`)
note(`  Caches: ${JSON.stringify(await cacheReport(page))}`)
await snapshot(page, 's1-online-programm.png')
await goOffline(page)
await page.reload({ waitUntil: 'networkidle0' }).catch((e) => note(`  reload -> ${e.message.split('\n')[0]}`))
await snapshot(page, 's1-offline-programm.png')
await goto(page, '/sessions/s03')
await snapshot(page, 's1-offline-deeplink-session.png')

// Szenario 2: Sessions online hinzufügen, dann „Mein Programm“ offline direkt öffnen.
note('\n== Szenario 2: Mein Programm offline nach dem Hinzufügen')
await page.setOfflineMode(false)
await startServer()
await goto(page, '/programm')
const buttons = await page.$$('main li button')
for (const button of buttons.slice(0, 3)) await button.click()
note(`  gespeichert: ${await page.evaluate(() => localStorage.getItem('relay.myProgram.v1'))}`)
await goOffline(page)
await goto(page, '/mein-programm')
await snapshot(page, 's2-offline-mein-programm.png')
await page.reload({ waitUntil: 'networkidle0' }).catch((e) => note(`  reload -> ${e.message.split('\n')[0]}`))
await snapshot(page, 's2-offline-mein-programm-reload.png')
await browser.close()

// Szenario 3: Erstbesuch ohne vorheriges Online-Laden.
note('\n== Szenario 3: Erstbesuch offline (frisches Profil, kein Service Worker)')
browser = await launch()
page = await browser.newPage()
await page.setCacheEnabled(false)
await page.setOfflineMode(true)
await goto(page, '/')
await new Promise((r) => setTimeout(r, 1000))
page = (await browser.pages()).at(-1)
await snapshot(page, 's3-offline-erstbesuch.png')
await browser.close()

// Zusatzszenario 4: späte Raumänderung. Build v2 verlegt s01 in Saal C.
if (distV2) {
  note('\n== Zusatzszenario 4: Raumänderung erreicht einen Client mit altem Cache')
  const room = (page) => page.evaluate(() => document.querySelector('main')?.innerText.match(/Hauptsaal|Saal C/)?.[0] ?? null)
  await startServer()
  browser = await launch()
  page = await browser.newPage()
  await page.setCacheEnabled(false)
  await goto(page, '/sessions/s01')
  await waitForController(page)
  note(`  v1 geladen, Raum: ${await room(page)}`)
  await stopServer()
  await startServer(distV2)
  await page.reload({ waitUntil: 'networkidle0' })
  await page.waitForSelector('.pwa__button', { timeout: 10000 }).catch(() => note('  kein Update-Hinweis erschienen'))
  note(`  Reload mit v2 auf dem Server, Raum: ${await room(page)}`)
  await snapshot(page, 's4-update-hinweis.png')
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle0' }),
    page.click('.pwa__button'),
  ])
  note(`  nach „Aktualisieren“, Raum: ${await room(page)}`)
  note(`  Caches: ${JSON.stringify(await cacheReport(page))}`)
  await snapshot(page, 's4-nach-update.png')
  await stopServer()
  await browser.close()
}

writeFileSync(join(out, 'log.txt'), log.join('\n') + '\n')
