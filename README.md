# wallcast

**Browser-native P2P live photo wall for events.**

Guests scan a QR code, snap photos on their phones, and they appear live on the host's screen — no server storage, no accounts, no upload. Everything travels browser-to-browser via WebRTC DataChannels.

---

## What it is

Two HTML files, zero build step. Open `wall.html` on a TV or laptop. Guests scan the QR code, open `join.html` on their phones, and photos stream directly into the wall.

```
Host (wall.html)  ←── WebRTC DataChannel ←──  Phone 1
                  ←── WebRTC DataChannel ←──  Phone 2
                  ←── WebRTC DataChannel ←──  Phone N
```

**Star topology:** The wall is the hub; every guest is a spoke. Photos are chunked at 16 KB with backpressure control so the host tab stays responsive even when 10+ guests send concurrently.

---

## How to run

### Option A — same-network LAN (recommended for events)

```bash
# Python 3
python3 -m http.server 8080

# or Node
npx serve .
```

1. Find your LAN IP (`ipconfig` / `ifconfig`).
2. Open `http://YOUR-LAN-IP:8080/wall.html` on the TV/laptop.
3. Guests scan the QR code shown on the wall — it opens `join.html` pre-filled with the room code.

### Option B — just open the file

Open `wall.html` directly with `file://`. The QR will point to `file://` URLs which guests can't scan from phones, but guests can open `join.html` manually and type the 6-character room code.

> **Corporate NAT / firewall?**  WebRTC P2P may fail behind symmetric NATs. A TURN server is needed in that case. The default PeerJS signaling uses Google STUN and the public `0.peerjs.com` signaling server.

---

## Pricing

| Feature | Free | Pro |
|---------|------|-----|
| Photos per wall | 20 | Unlimited |
| "made with wallcast" badge | Shown | Hidden |
| License key required | — | Yes |

### Unlock Pro

1. Click **🔑 Unlock** on `wall.html`.
2. Paste a valid license key.
3. Unlock persists in `localStorage` across reloads on that device.

### Generating license keys (operators)

```bash
# First time — generates keys/private.pem and keys/public.pem
node keys/gen.js --init

# Issue a license key for a customer
node keys/gen.js --key "customer@example.com"

# Verify a key
node keys/gen.js --verify <key-string>
```

> **Keep `keys/private.pem` secret** — it's gitignored and must never be committed.
> The public key is baked into `wall.html`; customers' licenses are verified offline via the Web Crypto API.

---

## Running the spike test

`spike.html` validates chunking and backpressure logic against a mocked DataChannel; real-device LAN test (2+ phones) is the acceptance gate.

Open `spike.html` in any modern browser. Click **Run Spike**. It simulates 10 concurrent senders each sending a 2–5 MB synthetic image through the chunking + backpressure engine, plus abuse cases (oversize declaration, duplicate chunk index, per-guest pending cap), and reports PASS/FAIL.

```
🟢 SPIKE PASSED — 10 images, zero dropped, zero corrupt
```

---

## Architecture

| Concern | Approach |
|---------|----------|
| Signaling | PeerJS 1.5.5 (CDN) + public `0.peerjs.com` |
| Transport | WebRTC DataChannel, `reliable: true`, binary serialization |
| Chunking | 16 KB per message (SCTP MTU safe) |
| Backpressure | Pause `bufferedAmount > 1 MB`; resume `< 256 KB` |
| Downscale | Canvas → max 1920 px long edge, JPEG q0.8 |
| Reconnect | Guest: exponential backoff 2 s → 4 s → … max 30 s |
| Wall layout | Masonry (CSS columns) **or** Ken Burns slideshow (toggle) |
| Moderation | Optional approve-before-show queue |
| License | Ed25519 offline sign (Node), Web Crypto verify (browser) |
| Storage | `localStorage` (`wc.*` namespace), in-memory fallback |

---

## Known limits

The wall enforces per-guest resource caps so a hostile or buggy guest can't exhaust host tab memory:

| Limit | Value |
|-------|-------|
| Max photo size (post-compression) | **8 MB** (`MAX_PHOTO_BYTES`) |
| Max chunks per photo | **512** (`MAX_CHUNKS`, 512 × 16 KB = 8 MB) |
| Max concurrent transfers per guest | 2 (`MAX_PENDING_PER_GUEST`) |
| Photos per wall (free tier) | 20 |
| Room code lifetime | 24 h (auto-regenerated on wall load; "New room" button forces a fresh code) |

### `photo-rejected` reasons

When the wall refuses a photo it replies to the sending guest with `{ type: 'photo-rejected', id, reason }`:

| Reason | Meaning | Guest message |
|--------|---------|---------------|
| `limit` | Free-tier photo cap reached | "Wall is full — ask the host to upgrade." |
| `too-large` | Declared size > 8 MB, > 512 chunks, invalid size/chunk fields, or more bytes streamed than declared | "Photo too large after compression — try another." |
| `busy` | Guest already has 2 transfers in flight | "Wall is busy — try again in a moment." |

On success the wall replies `{ type: 'photo-ack', id }`; the guest shows "On the wall!" only after receiving the ack (with a warning fallback if no ack arrives within 5 s).

---

## Files

```
wall.html          Host page — open on TV / laptop
join.html          Guest page — open on phones
spike.html         Spike test: 10 concurrent senders
vendor/peerjs.min.js    PeerJS 1.5.5 (vendored, no CDN dependency)
vendor/qrcode.min.js    QRCode.js (vendored)
keys/gen.js        License key generator (Node.js ≥ 18)
keys/private.pem   GITIGNORED — your signing key
keys/public.pem    GITIGNORED — your public key (for reference)
README.md          This file
```

---

## Acceptance checklist

- [x] Two phones + one laptop on same Wi-Fi: photo appears on wall < 3 s after send
- [x] Kill and reopen a guest tab: reconnects and can send again
- [x] 21st photo on free tier is blocked with upgrade message; valid key unblocks
- [x] Spike: 10 concurrent 2–5 MB images, zero dropped, zero corrupt

---

## License

MIT