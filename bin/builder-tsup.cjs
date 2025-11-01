#!/usr/bin/env node

const path = require('node:path')

const fs = require('node:fs/promises')

const { build, defineConfig } = require('tsup')

const [, , ...args] = process.argv

const env = require('dotenv').config({ path: path.resolve(__dirname, '../../../.env') })

const configFile = path.resolve(process.cwd(), 'tsup.config.json')

/**
 * Check if file exists
 *
 * @param {string} path
 * @returns {Promise<boolean>}
 * @example const fileExist = await exists('tsup.config.json')
 */
async function exists(path) {
  try {
    await fs.access(path)
    return true
  } catch {
    return false
  }
}

/**
 * Extract configuration from `tsup.config.json` file if exists
 *
 * @returns {Promise<object>}
 */
async function resolveConfigFile() {
  let config = {}

  const fileExist = await exists(configFile)

  if (fileExist) {
    const content = await fs.readFile(configFile, 'utf8')
    config = JSON.parse(content)
  }

  return config
}

/**
 * Extract command arguments from flags format to object. `--minify` -> `{ minify: true }`
 *
 * @returns {Promise<object>}
 */
async function resolveCommandFlags() {
  return args.reduce((acc, arg) => {
    const [key, value] = arg.split('=')

    return { ...acc, [key.replace('--', '')]: value || true }
  }, {})
}

async function main() {
  const [config, flags] = await Promise.all([resolveConfigFile(), resolveCommandFlags()])

  try {
    const defaultConfig = {
      clean: true,
      dts: true,
      entry: ['src/index.ts'],
      format: ['esm', 'cjs'],
      minify: env.parsed.BUILD_MODE !== 'development',
      sourcemap: env.parsed.BUILD_MODE !== 'development',
    }

    const settings = defineConfig({ ...defaultConfig, ...config, ...flags })

    build(settings)
  } catch (e) {
    console.error(e)
    process.exit(1)
  }
}

main()

