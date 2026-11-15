// Listly Safari extension: fills a marketplace's own sell page with a Listly listing (DD-46).
//
// How the listing arrives: the Listly app opens the sell page with "#listly=<base64url JSON>". The part after "#"
// is never sent to the marketplace's servers, and this script removes it from the address bar as soon as it has
// read it. The listing is kept in this tab's sessionStorage only until the form is filled (so it survives a
// redirect to a sign-in page and back), then deleted.
//
// What it never does: read or type passwords, sign in, or press Post / List / Publish. The seller does that.
//
// Field matching uses labels, placeholders and names, not fixed page structure, because these sites change
// often. The hints below are [verify]: confirm them on each live sell page with a test account.

(() => {
  const KEY = 'listly='
  const STORE = 'listly-pending'
  const MAX_AGE_MS = 30 * 60 * 1000

  // ---------- read the listing ----------
  function decode(b64url) {
    const b64 = b64url.replace(/-/g, '+').replace(/_/g, '/')
    const bin = atob(b64 + '==='.slice((b64.length + 3) % 4))
    const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0))
    return JSON.parse(new TextDecoder().decode(bytes))
  }

  let listing = null
  const at = location.hash.indexOf(KEY)
  if (at >= 0) {
    try {
      listing = decode(location.hash.slice(at + KEY.length))
      listing.receivedAt = Date.now()
      sessionStorage.setItem(STORE, JSON.stringify(listing))
    } catch (e) {
      console.warn('Listly: could not read the listing', e)
    }
    history.replaceState(null, '', location.pathname + location.search) // drop the listing from the address bar
  } else {
    try {
      listing = JSON.parse(sessionStorage.getItem(STORE) || 'null')
    } catch {
      listing = null
    }
  }
  if (!listing || listing.v !== 1 || Date.now() - (listing.receivedAt || 0) > MAX_AGE_MS) return

  const site = location.hostname.includes('poshmark') ? 'poshmark' : location.hostname.includes('mercari') ? 'mercari' : 'facebook'
  const SITE_NAME = { poshmark: 'Poshmark', mercari: 'Mercari', facebook: 'Facebook Marketplace' }[site]
  const POST_WORD = { poshmark: 'List', mercari: 'List', facebook: 'Publish' }[site]

  // ---------- field hints per site [verify] ----------
  // Each field: patterns matched against a control's label, aria-label, placeholder, name, id and data-test ids.
  const HINTS = {
    common: {
      title: [/\btitle\b/i, /what are you selling/i, /item name/i],
      description: [/descri/i, /tell buyers/i, /more about/i],
      price: [/listing price/i, /\bprice\b/i, /asking/i],
      brand: [/\bbrand\b/i],
      size: [/\bsize\b/i],
    },
    // Fields that look similar but must never be filled.
    avoid: [/original price/i, /\bpassword\b/i, /\bemail\b/i, /\bsearch\b/i, /\bzip\b/i, /\bshipping\b/i],
  }

  // ---------- page helpers ----------
  function labelText(el) {
    const parts = [el.getAttribute('aria-label'), el.getAttribute('placeholder'), el.getAttribute('name'), el.id, el.getAttribute('data-test'), el.getAttribute('data-testid')]
    if (el.id) {
      const l = document.querySelector(`label[for="${CSS.escape(el.id)}"]`)
      if (l) parts.push(l.textContent)
    }
    const wrap = el.closest('label')
    if (wrap) parts.push(wrap.textContent)
    const by = el.getAttribute('aria-labelledby')
    if (by) by.split(/\s+/).forEach((id) => parts.push(document.getElementById(id)?.textContent))
    // a visible heading just above the control (common on these forms)
    const prev = el.closest('div')?.previousElementSibling
    if (prev && prev.textContent && prev.textContent.length < 60) parts.push(prev.textContent)
    return parts.filter(Boolean).join(' | ')
  }

  function visible(el) {
    const r = el.getBoundingClientRect()
    return r.width > 0 && r.height > 0 && getComputedStyle(el).visibility !== 'hidden'
  }

  function findControl(field) {
    const controls = [...document.querySelectorAll('input:not([type=hidden]):not([type=file]):not([type=checkbox]):not([type=radio]), textarea, [contenteditable="true"]')]
    const want = HINTS.common[field]
    let best = null
    for (const el of controls) {
      if (!visible(el) || el.type === 'password') continue
      const text = labelText(el)
      if (HINTS.avoid.some((r) => r.test(text))) continue
      if (field === 'description' && el.tagName !== 'TEXTAREA' && el.getAttribute('contenteditable') !== 'true' && !/descri/i.test(text)) continue
      if (want.some((r) => r.test(text))) {
        best = el
        break
      }
    }
    return best
  }

  // Set a value the way typing would, so the page's own form logic (React and similar) sees it.
  function setValue(el, value) {
    el.focus()
    if (el.getAttribute('contenteditable') === 'true') {
      document.execCommand('selectAll', false)
      document.execCommand('insertText', false, value)
    } else {
      const proto = el.tagName === 'TEXTAREA' ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype
      const setter = Object.getOwnPropertyDescriptor(proto, 'value').set
      setter.call(el, value)
      el.dispatchEvent(new Event('input', { bubbles: true }))
      el.dispatchEvent(new Event('change', { bubbles: true }))
    }
    el.blur()
  }

  async function attachPhotos(urls) {
    const input = [...document.querySelectorAll('input[type=file]')].find((i) => !i.accept || /image/.test(i.accept))
    if (!input || !urls.length) return 0
    const files = []
    for (const [i, url] of urls.entries()) {
      try {
        const res = await fetch(url)
        if (!res.ok) continue
        const blob = await res.blob()
        files.push(new File([blob], `listly-photo-${i + 1}.jpg`, { type: blob.type || 'image/jpeg' }))
      } catch (e) {
        console.warn('Listly: a photo could not be fetched', e)
      }
    }
    if (!files.length) return 0
    const dt = new DataTransfer()
    files.forEach((f) => dt.items.add(f))
    input.files = dt.files
    input.dispatchEvent(new Event('change', { bubbles: true }))
    return files.length
  }

  // ---------- banner: what was filled, and that the seller posts ----------
  function banner(lines, done) {
    document.getElementById('listly-banner')?.remove()
    const box = document.createElement('div')
    box.id = 'listly-banner'
    box.setAttribute('role', 'status')
    box.setAttribute('aria-live', 'polite')
    box.style.cssText = [
      'position:fixed', 'left:12px', 'right:12px', 'bottom:max(12px, env(safe-area-inset-bottom))', 'z-index:2147483647',
      'background:#121821', 'color:#f4f6fa', 'border-radius:14px', 'padding:14px 16px', 'box-shadow:0 8px 24px rgba(0,0,0,.25)',
      'font:15px/1.45 -apple-system,system-ui,sans-serif',
    ].join(';')
    const title = document.createElement('strong')
    title.textContent = done ? `Listly filled this listing. Check it, then tap ${POST_WORD} yourself.` : 'Listly is waiting for the sell form…'
    title.style.cssText = 'display:block;margin-bottom:6px;font-size:16px'
    box.appendChild(title)
    for (const l of lines) {
      const p = document.createElement('div')
      p.textContent = l
      p.style.cssText = 'opacity:.85'
      box.appendChild(p)
    }
    const close = document.createElement('button')
    close.type = 'button'
    close.textContent = 'Close'
    close.setAttribute('aria-label', 'Close the Listly message')
    close.style.cssText = 'margin-top:10px;min-height:44px;min-width:44px;padding:0 16px;border-radius:10px;border:0;background:#f4f6fa;color:#121821;font:600 15px -apple-system,system-ui,sans-serif'
    close.onclick = () => box.remove()
    box.appendChild(close)
    document.body.appendChild(box)
  }

  // ---------- fill, once the form is on the page ----------
  async function fill() {
    const fields = {
      title: listing.title,
      description: listing.description,
      price: listing.price ? String(listing.price) : '',
      brand: listing.brand,
      size: listing.size,
    }
    const filled = []
    const missed = []
    for (const [field, value] of Object.entries(fields)) {
      if (!value) continue
      const el = findControl(field)
      if (el) {
        setValue(el, value)
        filled.push(field)
      } else missed.push(field)
    }
    const photos = await attachPhotos(listing.photos || [])
    sessionStorage.removeItem(STORE) // filled once; never kept around

    const name = { title: 'title', description: 'description', price: 'price', brand: 'brand', size: 'size' }
    const lines = []
    if (filled.length) lines.push(`Filled: ${filled.map((f) => name[f]).join(', ')}.`)
    if (photos) lines.push(`Added ${photos} ${photos === 1 ? 'photo' : 'photos'}.`)
    else if ((listing.photos || []).length) lines.push('Add your photos on this page (Listly couldn’t attach them).')
    if (missed.length) lines.push(`Fill in on this page: ${missed.map((f) => name[f]).join(', ')}.`)
    lines.push(`Also pick the category${site === 'poshmark' ? ', size' : ''} and condition here.`)
    banner(lines, true)
  }

  // The sell form is built by the page's scripts, so wait for a title-like control to appear (up to 30 s).
  let tries = 0
  const ready = () => !!findControl('title')
  if (ready()) fill()
  else {
    banner([`Open ${SITE_NAME}'s sell page if it isn't showing. Sign in there if asked.`], false)
    const obs = new MutationObserver(() => {
      if (ready()) {
        obs.disconnect()
        fill()
      } else if (++tries > 600) obs.disconnect()
    })
    obs.observe(document.documentElement, { childList: true, subtree: true })
    setTimeout(() => obs.disconnect(), 30000)
  }
})()
