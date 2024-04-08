---
title: ffmpeg commands for image sequences
date: 2023-04-09
dateUpdated: 2023-04-10
layout: post.njk
tags: ['generative art', 'video', 'command line']
excerpt: 'converting sequences of images to video & gif files using ffmpeg on the command line'
img: ''
imgAlt: ''
order: 51
---

Scenario: I have a canvas animation, which I'd like to convert to a gif or video file. While Canvas does have a native `captureStream()` method which enables you to convert directly to video ([more about recording Canvas animations with `captureStream()` here](https://julien-decharentenay.medium.com/how-to-save-html-canvas-animation-as-a-video-421157c2203b)) I found that the quality was pretty limited if the animation required a bunch of calculations and things happening in the background - once I started recording the stream, the page slowed down a whole lot, and so did the video. On my slow laptop, at least. So, instead I wrote some code that saved one frame of the drawing at a time as an image, then let me download a whole series of images all at once.

Once I had this series of images, I used [ffmpeg](https://ffmpeg.org/) to pack them all together into a gif or a video. I have the sense that ffmpeg is quite a powerful tool, but it's a really complex one. Most of my use of it has been limited to trial & error with answers I dig up on stackoverflow. So this was a bit of a challenge but I managed to figure some things out!

## images to video

Base ffmpeg command to convert a series of numbered images to video:

```bash
ffmpeg -r 60 -f image2 -i image-%d.png -crf 23 -r 30 -pix_fmt yuv420p video.mp4
```

What the options mean:

-   `-r`: frame rate (fps). Note there are two of these. The first one refers to the **input** fps and the second to the **output**.
-   `-f`: format... this is probably optional since ffmpeg usually can figure out what your file formats are
-   `-i`: input. `image-%d.png` means just look for a series of images with ascending digits (`image-1.png`, `image-2.png`, etc). There are other ways to write this depending on your filenames. For example, if you have a list of images padded with zeroes to 4 digits (`img0001.png`, `img0002.png`...) use `img%04d.png`.
-   `-crf` quality. 0 is lossless, max is 51. I believe the default is 23 and most examples I found online kept the number somewhere around there.
-   `-pix_fmt` pixel format. I found that without adding this option and `yuv420p` the video was created okay and worked online, but quicktime couldn't open it.
-   last argument is the output: `video.mp4`

## images to gif

Base ffmpeg command to convert a series of numbered images to gif:

```bash
ffmpeg -f image2 -r 60 -i image-%d.png output.gif
```

Many of these options are similar to those above.

### using filters

The command above on its own creates a file that's completely unoptimized and HUGE. So you can add a bunch of other adjustments through a special filter command.

The filter command is preceded by `-filter_complex` or `-vf`. The difference (I think?) is about how many inputs/outputs you have, with `-filter_complex` being used for multiple inputs/outputs with complex filter chains, vs `-vf` which is a simpler, linear filter chain. ([reddit comment about this](https://www.reddit.com/r/ffmpeg/comments/gy4hdb/whats_the_difference_between_vf_and_filter_complex/)).

```bash
ffmpeg -f image2 -r 60 -i image-%d.png -filter_complex "FILTER_HERE" output.gif
```

The filter was by far the most confusing part for me, so I'm going to break it into pieces.

#### ffmpeg filter syntax

The filter is separated with commas and semicolons. Commas separate filters, semicolons separate _chains_ of filters. Between semicolons you can also specify the names of inputs & outputs to the chain. If don't specify a name, it's assumed that the output is just coming from the preceding item.

#### set scale & frame rate

```bash
fps=10,scale=320:-1:flags=lanczos,
```

-   `fps=10` sets output frame rate to 10fps
-   `scale=320:-1` scales images down to 320px wide. -1 keeps it at the same aspect ratio
-   `flags=lanczos` scales using lanczos scaling algorithm. There are a bunch of other [scaling algortihms](https://ffmpeg.org/ffmpeg-scaler.html) you can experiment with if you want.

#### add a boomerang effect

```bash
split[main][back];[back]reverse[r];[main][r]concat=n=2:v=1:a=0,
```

For this particular project I wanted the animation to play forward and then backward. If you don't want this effect, you can leave this part out.

-   `split` beginning copies the input into 2 segments, one named `main` and one named `back`
-   `reverse` takes the `back` segment as input, reverses it, and outputs it as another item labeled `r`.
-   `concat` concatenates `main` (the normal, forward sequence) and `r` (the reversed one)
    -   `n=2` = there are 2 input segments
    -   `v=1` = one video stream per segment
    -   `a=0` = 0 audio streams per segment

#### use a custom palette

```bash
split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse
```

GIF is limited to 256 colors. By default ffmpeg will just use a generic palette that attempts to work with a variety of content. In my case, I was working with black & white images, so a palette attempting to cover the entire space would be mostly wasted, and I'd be missing lots of nuance in the shades.

This filter step creates a palette specifically tailored to your content.

-   `split` again copies your input into 2 segments, this time named `s0` and `s1`
-   `palettegen` creates a palette from the `s0` segment
-   we designate the created palette as `p`
-   `paletteuse` tells ffmpeg that when building our output gif from `s1` (the sequence with all our previous filters performed on it), use palette `p` instead of the default

If you want, you can separate these steps out and generate a palette from your images, save the palette as a png, and then use that saved png as a second input when you create the gif. That looks something like:

```bash
filters=fps=10,scale=320:-1:flags=lanczos # or whatever other filters you're using
ffmpeg -f image2 -i image-%d.png -vf "$filters,palettegen" palette.png  # first command to create the palette
ffmpeg -i image-%d.png -i palette.png -filter_complex "$filters[x];[x][1:v] paletteuse" output.gif
```

But the first way, you get it done all at once without having to deal with an extra palette file.

There are a bunch of options and details here if you want to go into them; this [blog post discusses palettes in more detail](http://blog.pkh.me/p/21-high-quality-gif-with-ffmpeg.html).

### example commands

Using boomerang effect, generating a palette, using `filter_complex`:

```bash
ffmpeg -f image2 -r 60 -i image-%d.png -filter_complex "fps=10,scale=320:-1:flags=lanczos,split[main][back];[back]reverse[r];[main][r]concat=n=2:v=1:a=0,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" output.gif
```

Split into variables, no boomerang, using `-vf`:

```bash
filters="fps=10,scale=320:-1:flags=lanczos"
palette="split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse"
ffmpeg -f image2 -r 60 -i image-%d.png -vf "$filters,$palette" output.gif
```

you can also put an output frame rate using `-vf`, I sort of fiddle with this vs the input to make the speed different, which erm.. sometimes works?

```bash
ffmpeg -f image2 -r 60 -i image-%d.png -vf "$filters,$palette" -r 30 output.gif
```

## resources

-   [pkh.me: high quality gif with ffmpeg](http://blog.pkh.me/p/21-high-quality-gif-with-ffmpeg.html)
-   [ffmpeg wiki: filtering guide](https://trac.ffmpeg.org/wiki/FilteringGuide)
-   [code project: how to use ffmpeg filters to jazz up your audio and video](https://www.codeproject.com/Tips/5303741/How-to-Use-FFmpeg-Filters-to-Jazz-Up-Your-Audio-an) (explains some of the filter syntax details)
-   [hammad mazhar: using ffmpeg to convert a set of images into video](https://hamelot.io/visualization/using-ffmpeg-to-convert-a-set-of-images-into-a-video/)
-   a bunch of stackexchange type posts:
    -   [how to convert video to gif with reasonable quality](https://superuser.com/questions/556029/how-do-i-convert-a-video-to-gif-using-ffmpeg-with-reasonable-quality)
    -   [use every nth image in sequence to create a video](https://superuser.com/questions/1156837/using-every-nth-image-in-sequence-to-create-video-using-ffmpeg)
    -   [ffmpeg boomerang effect to gif](https://superuser.com/questions/1608327/ffmpeg-boomerang-effect-to-gif)
