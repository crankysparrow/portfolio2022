const util = require('util')
const syntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight')
const sass = require('sass')
const del = require('del')
const path = require('path')
const faviconPlugin = require('eleventy-favicon')
const Image = require('@11ty/eleventy-img')

async function imageShortcode({
	src,
	alt,
	widths = [720, 1440],
	sizes = '(min-width: 900px) 720w, 100vw',
	style = '',
	classNames = '',
	quality = 80,
	formats = ['webp', 'jpeg'],
}) {
	let metadata = await Image(src, {
		widths: widths,
		outputDir: './_site/img/',
		formats: formats,
		sharpOptions: {
			quality: quality,
		},
	})

	let lowsrc, highsrc
	if (metadata.jpeg) {
		lowsrc = metadata.jpeg[0]
		highsrc = metadata.jpeg[metadata.jpeg.length - 1]
	} else if (metadata.png) {
		lowsrc = metadata.png[0]
		highsrc = metadata.png[metadata.png.length - 1]
	}

	return `<picture style="${style}" class="${classNames}">
	  ${Object.values(metadata)
			.map((imageFormat) => {
				return `<source type="${imageFormat[0].sourceType}" srcset="${imageFormat
					.map((entry) => entry.srcset)
					.join(', ')}" sizes="${sizes}">`
			})
			.join('\n')}
		<img
		  src="${lowsrc.url}"
		  width="${highsrc.width}"
		  height="${highsrc.height}"
		  alt="${alt}"
		  loading="lazy"
		  decoding="async">
	  </picture>`
}

module.exports = function (eleventyConfig) {
	eleventyConfig.addTemplateFormats('scss')
	eleventyConfig.addExtension('scss', {
		outputFileExtension: 'css',
		isIncrementalMatch: function (incrementalFilePath) {
			if (incrementalFilePath.endsWith('.scss')) return true
		},
		compile(content, inputPath) {
			let parsed = path.parse(inputPath)
			if (parsed.name.startsWith('_')) return

			return (data) => {
				console.log('🔮 compiling scss...', inputPath)
				let result = sass.compile(inputPath)

				return result.css
			}
		},
	})

	eleventyConfig.addWatchTarget('./src/styles/**/*.scss')
	eleventyConfig.addWatchTarget('./src/scripts')
	eleventyConfig.addWatchTarget('./src/sketches/scripts/**/*.js')
	eleventyConfig.addWatchTarget('./src/sketchesthree/scripts/**/*.js')

	eleventyConfig.addPassthroughCopy({ './src/images-passthrough': 'images' })
	eleventyConfig.addPassthroughCopy('./src/fonts')
	eleventyConfig.addPassthroughCopy('./src/scripts')
	eleventyConfig.addPassthroughCopy('./src/sketches/scripts')
	eleventyConfig.addPassthroughCopy('./src/sketchesthree/scripts')

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

	eleventyConfig.addCollection('work', function (collections) {
		let work = collections.getFilteredByTag('work')
		return work.sort(function (a, b) {
			return b.data.order - a.data.order
		})
	})

	eleventyConfig.addCollection('post', function (collections) {
		let notes = collections.getFilteredByTag('post')
		notes = notes.filter((note) => !note.data.draft)
		return notes.sort(function (a, b) {
			return b.data.order - a.data.order
		})
	})

	eleventyConfig.addNunjucksAsyncShortcode('image', imageShortcode)

	eleventyConfig.addNunjucksShortcode(
		'imgStyle',
		function (src, alt, style = '', className = '') {
			return `<img src="${src}" alt="${alt}" style="${style}" />`
		}
	)
	eleventyConfig.addPlugin(syntaxHighlight)
	eleventyConfig.addPlugin(faviconPlugin)

	eleventyConfig.addFilter('console', function (value, level = 2) {
		return util.inspect(value, { depth: level })
	})

	eleventyConfig.addFilter('round', function (val, pos = 2) {
		return Math.round(val * 10 * pos) / (10 * pos)
	})

	eleventyConfig.addFilter('dateString', function (d) {
		if (d) {
			let notUTCDate = d.toISOString().slice(0, -1)
			return new Date(notUTCDate).toLocaleDateString('en-US', { dateStyle: 'medium' })
		}
	})

	// https://github.com/11ty/eleventy-base-blog/blob/main/.eleventy.js
	eleventyConfig.addFilter('head', (array, n) => {
		if (!Array.isArray(array) || array.length === 0) {
			return []
		}
		if (n < 0) {
			return array.slice(n)
		}

		return array.slice(0, n)
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
		markdownTemplateEngine: 'njk',
	}
}
