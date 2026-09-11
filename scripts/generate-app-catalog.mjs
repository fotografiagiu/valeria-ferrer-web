#!/usr/bin/env node

import { createHash } from 'node:crypto'
import fs from 'node:fs'
import path from 'path'
import {
  APP_CATALOG_RELATIVE_PATH,
  MODELS_PATH,
  PUBLIC_DIR,
  readJson,
  writeSeoOutputFile,
} from './lib/seo-assets.mjs'

const VIP_RATE_KEY_TO_SERVICE = {
  '30min': '30min',
  '45min': '45min',
  '1h': '60min',
  '1.5h': '90min',
  '2h': '120min',
  '3h': '180min',
  salidaHotel: 'salida',
  noche: 'noche',
  dia: 'dia',
  dosDias: 'dosDias',
}

function parseEuroToCents(input) {
  const cleaned = String(input).replace(/€/gi, '').replace(/\s/g, '').trim()
  if (!cleaned) return null
  const hasComma = cleaned.includes(',')
  const hasDot = cleaned.includes('.')
  let normalized = cleaned
  if (hasComma && hasDot) {
    normalized = normalized.replace(/\./g, '').replace(',', '.')
  } else if (hasComma) {
    normalized = normalized.replace(',', '.')
  } else if (hasDot && /^\d{1,3}(\.\d{3})+$/.test(normalized)) {
    normalized = normalized.replace(/\./g, '')
  }
  const value = Number(normalized)
  if (!Number.isFinite(value)) return null
  return Math.round(value * 100)
}

function extractRateExceptions(vipRates) {
  if (!vipRates || typeof vipRates !== 'object') return []

  const rateExceptions = []
  for (const [key, value] of Object.entries(vipRates)) {
    const serviceTypeId = VIP_RATE_KEY_TO_SERVICE[key]
    const totalCents = parseEuroToCents(value)
    if (serviceTypeId && totalCents != null) {
      rateExceptions.push({ serviceTypeId, totalCents })
    }
  }
  return rateExceptions
}

function asPublicPath(value) {
  if (typeof value !== 'string') return null
  const trimmed = value.trim()
  if (!trimmed) return null
  return trimmed.startsWith('/') ? trimmed : `/${trimmed}`
}

function toCatalogModel(model) {
  if (!model || typeof model.slug !== 'string' || typeof model.name !== 'string') {
    return null
  }

  const slug = model.slug.trim()
  const name = model.name.trim()
  if (!slug || !name) return null

  const coverImageUrl = asPublicPath(model.coverImageUrl) || asPublicPath(model.profileImageUrl)
  const images = Array.isArray(model.images)
    ? model.images.map(asPublicPath).filter(Boolean)
    : []

  const entry = {
    slug,
    name,
    active: model.active !== false,
    vip: model.vip === true,
    coverImageUrl: coverImageUrl || null,
    images,
  }

  const rateExceptions = extractRateExceptions(model.vipRates)
  if (rateExceptions.length > 0) {
    entry.rateExceptions = rateExceptions
  }

  return entry
}

const raw = readJson(MODELS_PATH)
if (!Array.isArray(raw)) {
  throw new Error('data/models.json must be an array')
}

const sourceBytes = fs.readFileSync(MODELS_PATH)
const catalogVersion = createHash('sha256').update(sourceBytes).digest('hex')
const generatedAt = new Date().toISOString()

const models = raw.map(toCatalogModel).filter(Boolean)
const catalog = {
  generatedAt,
  catalogVersion,
  source: 'valeria-ferrer-web',
  method: 'build-app-catalog',
  models,
}

writeSeoOutputFile(APP_CATALOG_RELATIVE_PATH, `${JSON.stringify(catalog, null, 2)}\n`)

const outputPath = path.join(PUBLIC_DIR, APP_CATALOG_RELATIVE_PATH)
const activeCount = models.filter((model) => model.active).length
const inactiveCount = models.length - activeCount
const vipCount = models.filter((model) => model.vip || model.rateExceptions?.length).length
const withCover = models.filter((model) => model.coverImageUrl).length

console.log(`✅ Generated ${outputPath}`)
console.log(
  `   ${models.length} fichas (${activeCount} activas, ${inactiveCount} inactivas, ${vipCount} con tarifa VIP, ${withCover} con portada)`,
)
console.log(`   catalogVersion ${catalogVersion.slice(0, 12)}…`)

