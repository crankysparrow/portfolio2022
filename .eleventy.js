const syntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight')
const faviconPlugin = require('eleventy-favicon')
const { imageShortcode } = require('./build/image-shortcode')
const collections = require('./build/collections')
const filters = require('./build/filters')
const customFormatScss = require('./build/scss-format')
const { watchTargets, passthroughCopy } = require('./build/watch-passthrough-info')
const markdownSetup = require('./build/markdown')

module.exports = function (eleventyConfig) {
	customFormatScss(eleventyConfig)
	markdownSetup(eleventyConfig)

	watchTargets.forEach((item) => eleventyConfig.addWatchTarget(item))
	passthroughCopy.forEach((item) => eleventyConfig.addPassthroughCopy(item))
	collections.forEach(({ name, fn }) => eleventyConfig.addCollection(name, fn))
	filters.forEach(({ name, fn }) => eleventyConfig.addFilter(name, fn))

	eleventyConfig.addNunjucksAsyncShortcode('image', imageShortcode)

	eleventyConfig.addNunjucksShortcode(
		'imgStyle',
		function (src, alt, style = '', className = '') {
			return `<img src="${src}" alt="${alt}" style="${style}" />`
		}
	)

	eleventyConfig.addPlugin(syntaxHighlight)
	eleventyConfig.addPlugin(faviconPlugin)

	return {
		dir: {
			input: 'src',
			output: '_site',
			layouts: 'views/layouts',
			includes: 'views',
		},
		markdownTemplateEngine: 'njk',
	}
}
