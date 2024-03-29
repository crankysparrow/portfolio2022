---
title: compiling scss with eleventy
date: 2022-01-30
dateUpdated: 2022-10-21
layout: post.njk
order: 6
tags: ['eleventy', 'scss']
img: '/images/eleventypossums.jpg'
excerpt: "use eleventy's custom templating language feature to compile scss alongisde the rest of your eleventy build"
imgAlt: 'three possums hanging by their tails from a red balloon'
---

Just noting for myself the code & process to set up scss as a custom templating language for [Eleventy](https://www.11ty.dev/). 

Eleventy added [custom templating languages](https://www.11ty.dev/docs/languages/custom/) in a recent update. So we're going to add scss as a new template language and tell eleventy how to process it.  

The file structure for my project looks something like this: 

```
.eleventy.js
📂_site 
    (compiled files from eleventy)
📂src
    index.njk
    📂views
    📂layouts
    📂styles 
        style.scss
        _fonts.scss
        _variables.scss
```

and the very basics of my eleventy config (in **.eleventy.js** file):

```js
module.exports = function (eleventyConfig) {

    return {
        dir: {
			input: 'src',
			output: '_site',
			layouts: 'views/layouts',
			includes: 'views',
		},
    }
}
```

## updated .eleventy.js

ok! So to start compiling that `style.scss` file, we need to first run `npm install sass`.

Then we can adjust our eleventy config. 

```js
const sass = require('sass')
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
				let result = sass.compile(inputPath)
				return result.css
			}
		},
	})

    return {
        dir: {
			input: 'src',
			output: '_site',
			layouts: 'views/layouts',
			includes: 'views',
		},
    }
}
```

## Here's what's going on:

* we import the **sass** module we installed + npm's **path** module, which is just to help us figure out the names of each file 
* `eleventyConfig.addTemplateFormats('scss')` tells eleventy to look for scss files in our source folder
* `eleventyConfig.addExtension('scss', ...)` then tells eleventy how it'll process files with the extension scss
* `outputFileExtension` tells eleventy that the compiled output should have the extension .css instead of .scss
* the `parsed` bit checks if the file starts with **_**, and if it does, simply returns the function so eleventy doesn't try to compile those files individually. Any scss file starting with an underscore is used by or imported into the main **style.scss** file, so we don't actually want separate css files for each one. 
* the returned function within `compile` uses the sass module to compile our scss file and return the compiled css! 
** the `data` in the returned function is all the data's about eleventy's collections etc etc... we don't really need it here, though

## alternatives 

* the [example on 11ty.dev](https://www.11ty.dev/docs/languages/custom/#example-add-sass-support-to-eleventy) uses an async function instead
* [ZeroPoint](https://github.com/MWDelaney/ZeroPoint/blob/master/src/config/templateLanguages.js) starter theme uses `sass.renderSync`

## incremental builds 

__UPDATE 10/21/22__: When I first wrote this, I wasn't able to use eleventy's incremental builds, because there was no way to tell eleventy that editing an scss file with a _ in front of it meant the main style.css files should be updated. But now there seems to be an option for this! The `addExtension` config options include a function called `isIncrementalMatch`. The docs currently don't include any info on how to actually use this function, but I dug around in the code and found a [potential use of `isIncrementalMatch` here](https://github.com/11ty/eleventy/blob/bd3e4a4a7482c3a306654ed83727a782a4180d4c/test/TemplateTest.js#L1899), and [where `isIncrementalMatch` is called](https://github.com/11ty/eleventy/blob/14e0199b2442086a6d21bf90d3d9917e3ddb75bc/src/TemplateContent.js#L515). So I added a couple lines to my config and I _think_ it's working: 

```js
eleventyConfig.addExtension('scss', {
	//...
	isIncrementalMatch: function (incrementalFilePath) {
		if (incrementalFilePath.endsWith('.scss')) return true
	}
})
```

## issues

Using eleventy's custom template option this way means that, when using the dev server, eleventy watches all the scss files and rebuilds every time there's a change to one of them. The browserSync server used for the dev server has the ability to simply inject updated CSS into the page, rather than reloading the page entirely. 

So if you were updating & compiling your CSS some other way, without eleventy being aware of it, you could add something like this to **eleventy.js**: 

```js
eleventyConfig.setBrowserSyncConfig({
    files: './_site/styles/*.css',
    injectChanges: true,
})
``` 

But when eleventy is watching the scss files and rebuilding them itself, it will just reload the page every time the CSS is updated. There doesn't seem to be a way to use browserSync to inject the styles instead of reloading the page. This is not THAT big of a deal, but it annoys me. I'm not sure if there's some way to configure the server differently that I just can't find. 