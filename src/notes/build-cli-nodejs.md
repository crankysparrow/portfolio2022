---
title: building a CLI with NodeJS
date: 2024-08-07
dateUpdated: 2024-08-07
layout: post.njk
tags: ['command line', 'devtools', 'nodejs', 'javascript']
excerpt: ''
img: '/images/cli-screenshot.jpg'
imgAlt: ''
order: 200
---

I recently created a little CLI for my own use to run an [ffmpeg](https://www.ffmpeg.org/) command to transform a series of images into a video (I have some notes on that process here: [ffmpeg commands for image sequences](/notes/ffmpeg-gif-video)). Here are a few notes on the process of building a CLI with NodeJS!

## very basic setup:

1. Create an empty directory, `cd` into it, and `npm init` or `pnpm init`.
2. Create `index.js` in your new directory. At the top, add a shebang like this: `#! /usr/bin/env node`. This tells our shell which interpreter to use (in this case, NodeJS).
3. Add a **bin** entry to your `package.json`.

    ```json
    "bin": {
        "mycli": "index.js"
    },
    "type": "module"
    ```

    This sets your cli command as `mycli` and `index.js` as the file which will be run when you use that command. I also added **type** to use ES module syntax but that part is optional.

4. In the same directory, run this command to install your command globally:

    ```bash
    npm install -g .
    ```

5. Add shebang at the top of `index.js` - this tells our shell which interpreter to use (in this case, NodeJS):

    ```bash
    #! /usr/bin/env node
    ```

## Resources

-   [NodeJS: Accept input from the command line in Node.js](https://nodejs.org/en/learn/command-line/accept-input-from-the-command-line-in-nodejs)
-   [Codecademy: Getting user input in Node.js](https://www.codecademy.com/article/getting-user-input-in-node-js)
-   [Let's build a CLI (medium article)](https://medium.com/@manavshrivastava/lets-build-a-cli-command-line-interface-with-node-js-d3b5faacc5ea)
-   [Building a CLI App with Node.js in 2024 (medium article)](https://medium.com/nmc-techblog/building-a-cli-with-node-js-in-2024-c278802a3ef5)
-   [NodeJS readline documentation](https://nodejs.org/api/readline.html)
-   **helpful packages** (I haven't used all these)
    -   [Inquirer.js](https://github.com/SBoudrias/Inquirer.js) - set of command line interfaces like prompts, checkboxes, confirmation, etc
    -   [commander.js](https://github.com/tj/commander.js) - a bunch of utilities for building a CLI. Not prompts like Inquirer from what I can tell, but setting up commands with options etc.
    -   [Chalk](https://www.npmjs.com/package/chalk) - use pretty colors
