#!/usr/bin/env node
// keys/gen.js — Wallcast license key generator
//
// Usage:
//   node keys/gen.js --init            Generate keypair (first time only)
//   node keys/gen.js --key [licensee]  Issue a signed Pro license key
//   node keys/gen.js --verify <key>    Verify a license key string
//
// keys/private.pem is gitignored. Never commit it.
// Embed the PUBLIC_KEY_B64 printed by --init into wall.html.

'use strict';

const { generateKeyPairSync, sign, verify, createPrivateKey, createPublicKey } = require('crypto');
const fs   = require('fs');
const path = require('path');

const DIR             = __dirname;
const PRIVATE_KEY_PATH = path.join(DIR, 'private.pem');
const PUBLIC_KEY_PATH  = path.join(DIR, 'public.pem');

const [,, cmd, arg] = process.argv;

// ── --init: generate keypair ────────────────────────────────────────────────
if (cmd === '--init') {
  if (fs.existsSync(PRIVATE_KEY_PATH)) {
    console.error('keys/private.pem already exists. Delete it first to regenerate.');
    process.exit(1);
  }

  const { privateKey, publicKey } = generateKeyPairSync('ed25519');

  fs.mkdirSync(DIR, { recursive: true });
  fs.writeFileSync(PRIVATE_KEY_PATH, privateKey.export({ type: 'pkcs8', format: 'pem' }), { mode: 0o600 });
  // Note: file mode 0o600 is enforced on Unix/macOS only. On Windows, manually
  // restrict access with: icacls keys\private.pem /inheritance:r /grant:r "%USERNAME%":F

  const pubPem = publicKey.export({ type: 'spki', format: 'pem' });
  fs.writeFileSync(PUBLIC_KEY_PATH, pubPem);

  const pubDerB64 = publicKey.export({ type: 'spki', format: 'der' }).toString('base64');

  console.log('✅  Keypair generated.\n');
  console.log('Embed this PUBLIC_KEY_B64 constant in wall.html:');
  console.log('\n  ' + pubDerB64 + '\n');
  console.log('Private key → keys/private.pem  (gitignored — keep secret!)');
  console.log('Public key  → keys/public.pem');

// ── --key: issue a license ──────────────────────────────────────────────────
} else if (cmd === '--key') {
  if (!fs.existsSync(PRIVATE_KEY_PATH)) {
    console.error('No private key found. Run: node keys/gen.js --init');
    process.exit(1);
  }

  const privKey  = createPrivateKey(fs.readFileSync(PRIVATE_KEY_PATH));
  const payload  = JSON.stringify({
    tier:      'pro',
    issued:    new Date().toISOString(),
    licensee:  arg || 'unlicensed'
  });
  const payloadBuf = Buffer.from(payload);
  const sigBuf     = sign(null, payloadBuf, privKey);

  const licenseKey = Buffer.from(JSON.stringify({
    data: payloadBuf.toString('base64'),
    sig:  sigBuf.toString('base64')
  })).toString('base64');

  console.log('\n✅  License key for:', arg || '(unlicensed)');
  console.log(licenseKey);

// ── --verify: check a license key ──────────────────────────────────────────
} else if (cmd === '--verify') {
  if (!arg) {
    console.error('Usage: node keys/gen.js --verify <key>');
    process.exit(1);
  }
  if (!fs.existsSync(PUBLIC_KEY_PATH)) {
    console.error('No public key found. Run: node keys/gen.js --init');
    process.exit(1);
  }

  try {
    const pubKey   = createPublicKey(fs.readFileSync(PUBLIC_KEY_PATH));
    const { data, sig } = JSON.parse(Buffer.from(arg.trim(), 'base64').toString('utf8'));
    const dataB    = Buffer.from(data, 'base64');
    const sigB     = Buffer.from(sig,  'base64');
    const ok       = verify(null, dataB, pubKey, sigB);

    if (ok) {
      console.log('✅  Valid license key');
      console.log('Payload:', JSON.parse(dataB.toString('utf8')));
    } else {
      console.log('❌  Invalid signature');
    }
  } catch (e) {
    console.log('❌  Invalid license key:', e.message);
  }

// ── help ────────────────────────────────────────────────────────────────────
} else {
  console.log(`Wallcast License Key Generator

Usage:
  node keys/gen.js --init            Generate Ed25519 keypair
  node keys/gen.js --key [licensee]  Issue a Pro license key
  node keys/gen.js --verify <key>    Verify a license key`);
}
