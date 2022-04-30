const util = require('util')
const syntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight')
const sass = require('sass')
const del = require('del')
const path = require('path')

module.exports = function (eleventyConfig) {
	eleventyConfig.addTemplateFormats('scss')
	eleventyConfig.addExtension('scss', {
		outputFileExtension: 'css',
		compile(content, inputPath) {
			let parsed = path.parse(inputPath)
			if (parsed.name.startsWith('_')) return

			console.log('🔮 compiling scss...', inputPath)

			return (data) => {
				let includesPaths = [this.config.dir.includes]
				let result = sass.compile(inputPath, { includesPaths })

				return result.css
			}
		},
	})

	eleventyConfig.addWatchTarget('./src/styles')
	eleventyConfig.addWatchTarget('./src/scripts')

	eleventyConfig.addPassthroughCopy('./src/images')
	eleventyConfig.addPassthroughCopy('./src/fonts')
	eleventyConfig.addPassthroughCopy('./src/scripts')

	eleventyConfig.addFilter('filterTags', function (tags) {
		return (tags || []).filter((tag) => ['all', 'nav', 'post', 'posts'].indexOf(tag) === -1)
	})

	eleventyConfig.addCollection('tagList', function (collections) {
		let tagSet = new Set()
		let filter = ['all', 'post', 'page']
		collections.getAll().forEach((item) => {
			;(item.data.tags || []).forEach((tag) => {
				if (!filter.some((item) => item == tag)) tagSet.add(tag)
			})
		})

		return [...tagSet]
	})

	eleventyConfig.addPlugin(syntaxHighlight)

	eleventyConfig.addFilter('console', function (value) {
		return util.inspect(value)
	})

	eleventyConfig.addFilter('dateString', function (d) {
		return d?.toLocaleDateString('en-US', { dateStyle: 'medium' })
	})

	let markdownIt = require('markdown-it')
	let markdownItClassy = require('markdown-it-classy')
	let options = { html: true }
	let markdownLib = markdownIt(options).use(markdownItClassy)

	eleventyConfig.setLibrary('md', markdownLib)

	return {
		dir: {
			input: 'src',
			output: '_site',
			layouts: 'views/layouts',
			includes: 'views',
		},
	}
}
