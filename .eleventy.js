const util = require('util')
const syntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight')
const sass = require('sass')

module.exports = function (eleventyConfig) {
	eleventyConfig.addTemplateFormats('scss')
	eleventyConfig.addExtension('scss', {
		outputFileExtension: 'css',
		compile: async function (inputContent) {
			let result = sass.compileString(inputContent)
			return result.css.toString('utf8')
		},
	})

	eleventyConfig.addPassthroughCopy('public')
	eleventyConfig.addPassthroughCopy('css')

	eleventyConfig.addPlugin(syntaxHighlight)

	eleventyConfig.addFilter('console', function (value) {
		return util.inspect(value)
	})

	let markdownIt = require('markdown-it')
	let markdownItClassy = require('markdown-it-classy')
	let options = { html: true }
	let markdownLib = markdownIt(options).use(markdownItClassy)

	eleventyConfig.setLibrary('md', markdownLib)
}
