---
title: "scratchpad: vue3"
date: 2022-09-09
dateUpdated: 2022-09-09
layout: post.njk
order: 10
tags: ['vue', 'vue3']
img: ''
excerpt: "vue3 notes reference"
imgAlt: ''
---

Working notes/playground thingy here: [https://vue3-notes.michelleenos.com/](https://vue3-notes.michelleenos.com/)


## installation

with [create-vue](https://github.com/vuejs/create-vue): 

```bash
npm init vue@latest
```

or with [create-vite](https://vitejs.dev/guide/): 

```bash
# npm 7+, extra double-dash is needed:
npm create vite@latest my-vue-app -- --template vue
```

* create-vue also uses vite, there doesn't seem to really be a lot of difference between them, they install basically the same packages. 
* create-vite adds `"type": "module"` in `package.json` while create-vue doesn't
	* explanation of [ES vs CommonJS modules on freecodecamp](https://www.freecodecamp.org/news/modules-in-javascript/) 

## runtime or browser compilation

(honestly not that important of a topic, but the examples I was seeing in documentation confused me for a minute and figuring it out helped me internalize a little more about how Vue works)

Some docs use super simple components written like this in examples: 

```js 
const PersonObject = {
	props: ['id'],
	template: '<div class="page">Person: {{ id }}</div>',
}
``` 

* this way of creating components requires Vue's template compiler **in the browser**, which isn't actually set up by default using create-vite etc 
	* the whole point is you're compiling your templates in advance (in a *build step*), before they get to the browser.
* use an alternate vue build to get the browser compiler
	* change `import { createApp } from 'vue'` in `main.js` to `import { createApp } from 'vue/dist/vue.esm-bundler'`
	* this gives you regular build step + template compiler in the browser. 
		* also a bigger file + probably in real life not a lot of reason to do this
* resources:
	* [Vue3 in-browser template compilation](https://vuejs.org/guide/scaling-up/tooling.html#note-on-in-browser-template-compilation)
	* I haven't tried it but: [petite-vue](https://github.com/vuejs/petite-vue) is a Vue-based tool that can be used without a build step. Could be useful for just sprinkling some reactivity into a static site. 

## some definitions

* **Single-File Component (SFC)**: `.vue` files. Simply means that the template, logic (scripts), and styles of a Vue component are in a single file. ([VueJS docs page on SFCs](https://vuejs.org/guide/scaling-up/sfc.html))
* **2 API styles**
	* **Options API**: All the logic for a component is defined within an object with a bunch of options. Options are things like `data`, `methods`, `computed`, etc. The 'old way' of writing components. Access properties defined in the options object with `this`. 
	* **Composition API**: Logic for a component is defined in a `setup` function or most often inside `<script setup>` (`setup` tells Vue that it needs to do some particular compilation magic). The 'new way'. Import functions like `onMounted` and `computed` to use those parts of Vue in a particular component.
	* Resources: [vue docs explanation of API styles](https://vuejs.org/guide/introduction.html#api-styles) - also if you just browse the docs, you can toggle a switch in the sidebar between options & composition APIs

## router 

[playground: dynamic routes notes & examples](https://vue3-notes.michelleenos.com/dynamic-routes)

[Install Vue Router](https://router.vuejs.org/installation.html) & [import it in `main.js`](https://router.vuejs.org/guide/#javascript):

```js
import { createApp } from 'vue'
import App from './App.vue'
import { createRouter, createWebHistory } from 'vue-router'

// some components
import Home from './contents/Home.vue'
import About from './contents/About.vue'

const routes = [
    { path: '/', component: Home },
    { path: '/about', component: About }
]

const router = createRouter({
	history: createWebHistory(),
	routes,
})

app.use(router)
app.mount('#app')
```

Now in `App.vue`:

```js
<template>
	<div class="wrap">
		<div class="links">
			<router-link to="/">Home</router-link>
			<router-link to="/about">About</router-link>
		</div>
		<router-view></router-view>
	</div>
</template>
```


### names + dynamic routes + props

* **named routes**: provide a name to a route, then call up that name in an object in `<router-link>`
	* [Vue Router docs on named routes](https://router.vuejs.org/guide/essentials/named-routes.html) list several advantages to this approach, most of which I don't really understand 🙃 
* use a colon (`:`) in front of part of the route to make it dynamic 
* you can then use that dynamic bit as a variable in your code, either through `$route.params` or as a prop, if you add `props: true` to the route object

example of a dynamic route with param `id`:

```js
const routes = [ { path: '/person/:id', component: Person, name: 'person', props: true }]
```

```html
// in router-link
<router-link :to="`person/${person.id}`">
<router-link :to="{ name: 'person', params: { id: person.id }}">

// in Person component: 
<div>ID: {% raw %}{{ $route.params.id }}</div>

// as a prop in Person component (only works if props: true in the route definition)
<script setup>
const props = defineProps({ id: String })
</script>
<template>
	<div>ID: {{ id }}</div>
</template>
```
{% endraw %}

## reactivity options vs. composition 

* `data()` in options API maps to `ref()` or `reactive()`
* `ref()` for a single variable, `reactive()` for an object

* [playground: data & refs notes/examples](https://vue3-notes.michelleenos.com/data-refs)
* [playground: manipulate an svg shape with options vs composition API]()
