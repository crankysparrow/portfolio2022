---
title: nunjucks & eleventy notes
date: 2022-10-21
dateUpdated: 2022-10-21
layout: post.njk
excerpt: "I've used eleventy in several projects and am using it with Nunjucks (mostly) as a templating language for this site. This is a collection of notes & code snippets."
tags: ['nunjucks', 'eleventy']
order: 50
---

I've used [eleventy](https://www.11ty.dev/docs/) in several projects... including this site! On this particular site I'm using [Nunjucks](https://mozilla.github.io/nunjucks/) as a template language, with most of the wordy content in markdown, although eleventy is neat in that you can sort of mix & match your templates.

## Layouts & `extends`

Eleventy has its own [layout system](https://www.11ty.dev/docs/layouts/) where you can define templates used to wrap other content. You note that a particular piece of content should use a particular layout by adding a `layout` key in the frontmatter. You can nest layouts within each other, too. Cool. For example, this post is written in markdown. The frontmatter of this file includes:

```md
---
title: nunjucks & eleventy notes
layout: post.njk
---
```

Nunjucks also has its own [template inheritance](https://mozilla.github.io/nunjucks/templating.html#template-inheritance) system, using `extends` and `block`s. For example...

`parent.njk`:
{% raw %}

```jinja2
{% block title %}
    <h1>default title</h1>
{% endblock %}

<div class="content">
    {% block content %}
        default content
    {% endblock %}
</div>

<div class="sidebar">
    {% block sidebar %}
        default sidebar content
    {% endblock %}
</div>

```

`child.njk`:

```jinja2
{% extends './views/layouts/parent.njk' %}

{% block title %}
    <h1>different title!</h1>
{% endblock %}
```

{% endraw %}

`child.html`:

```html
<h1>not the default title!</h1>
<div class="content">default content</div>
<div class="sidebar">default sidebar content</div>
```

### `extends` means all content needs to be in a block

In this example, the `h1` will disappear into the void:

{% raw %}

```jinja2
{% extends './views/layouts/parent.njk' %}

<h1>what if i put title 1 out here</h1>
{% block title %}
    <h2>and another one in here</h2>
{% endblock %}
```

{% endraw %}

`child.html` - we lost our `h1`!

```html
<h2>and another in here</h2>
<div class="content">default content</div>
<div class="sidebar">default sidebar content</div>
```

### mixing layouts & extends/blocks

It seems to be possible to mix them in some ways but not all. Basically, eleventy layouts are not shorthand for nunjucks `extends`.

For example, let's take a similar parent & child but use eleventy's `layout` option...

{% raw %}

`parent.njk`:

```jinja2
{% block title %}
    <h1>default title</h1>
{% endblock %}

<div class="content">
    {% block content %}
        default content
    {% endblock %}
</div>
```

`child.njk`:

```jinja2
---
layout: parent.njk
---
{% block title %}
    <h1>not the default title!</h1>
{% endblock %}
{% block content %}
    <p>some content</p>
{% endblock %}
some extra content not in a block
```

{% endraw %}

`child.html`:

```html
<h1>default title</h1>
<div class="content">default content</div>
```

Blocks don't work here at all.

If we add `{% raw %}{{ content | safe }}{% endraw %}` to the parent template, it grabs all the content from the child file, but then blocks don't work as expected:

`parent.njk`:
{% raw %}

```jinja2
{% block title %}
    <h1>default title</h1>
{% endblock %}

<div class="content">
    {% block content %}
        {{ content | safe }}
    {% endblock %}
</div>
```

`child.njk`:

```jinja2
---
layout: parent.njk
---
{% block title %}
    <h1>child page title</h1>
{% endblock %}

{% block content %}
    <p>some content</p>
{% endblock %}

some extra content not in a block
```

`child.html`:

```html
<h1>default title</h1>
<div class="content">
	<h1>child page title</h1>
	<p>some content</p>
	some extra content not in a block
</div>
```

{% endraw %}

Eleventy's layout system ignores the block declarations in `child.njk` and just dumps everything into the main `content` block.

I have ended up using templates somewhat like the above parent example, which both include block options and call `{% raw %}{{ content | safe }}{% endraw %}`. Then I can use them as default layouts for markdown content, but make more complex child layouts that use extends instead if needed.

## Includes

[to be added]

## Macros

[to be added]

-   macros take arguments, includes do not. but you can set variables ahead of using `includes` and they'll be recognizable from the included template.

## resources

-   [Nunjucks Templating Docs](https://mozilla.github.io/nunjucks/templating.html)
-   [Eleventy Docs: Layouts](https://www.11ty.dev/docs/layouts/)
-   [Eleventy Docs: Nunjucks](https://www.11ty.dev/docs/languages/nunjucks/)
-   [GitHub issue discussing layouts & extends](https://github.com/11ty/eleventy/issues/853)
-   Webstoemp: [Modular Code with Nunjucks and Eleventy](https://www.webstoemp.com/blog/modular-code-nunjucks-eleventy/)
