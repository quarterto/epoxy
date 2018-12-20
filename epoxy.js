#!/usr/bin/env node bin.js

const { pattern, sh, log, isSourceNewer } = require('@quarterto/epoxy')
const util = require('util')

exports.foo = hmm => log.log(`foo ${util.inspect(hmm)}`)

const typescriptPattern = pattern(`src/%.ts`, `lib/%.js`)
const imaginaryTypescriptCompiler = () => {}

exports.typescript = async source => {
	const target = typescriptPattern(source)

	if(await isSourceNewer({
		source,
		target
	})) {
		log.log(`remaking ${target} because ${source} is newer`)
		await imaginaryTypescriptCompiler({ target, source })
	}

	return target
}

exports.deploy = sh`
echo deploy
`

exports.error = () => {
	throw new Error('lol')
}

exports.dep = async () => {
	await exports.foo('hello')
	await exports.typescript('src/foo.ts')
	await exports.deploy()
}

exports.default = async () => {
	await exports.deploy()
	await exports.foo('lol')
}

exports.slow = delay => new Promise(r => setTimeout(r, delay))

exports.asyncTask = Promise.resolve(() => {
	log.log('async task')
})