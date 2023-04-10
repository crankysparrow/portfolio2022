---
title: gif/video from a series of images with ffmpeg
date: 2023-04-09
dateUpdated: 2023-04-09
layout: post.njk
tags: ['generative art', 'video', 'command line']
excerpt: ''
img: ''
imgAlt: ''
order: 20
draft: true
---

Scenario: I have a canvas animation, which I'd like to convert to a gif or video file. While Canvas does have a native `captureStream()` method which enables you to convert directly to video (a process outlined [here](https://julien-decharentenay.medium.com/how-to-save-html-canvas-animation-as-a-video-421157c2203b)) I found that the quality was pretty limited if the animation required a bunch of calculations and things happening in the background - once I started recording the stream, the page slowed down a whole lot, and so did the video. On my slow laptop, at least. So, instead I wrote some code that saved one frame of the drawing at a time as an image, then let me download a whole series of images all at once.

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

This on its own, though, creates a file that's completely unoptimized and not necessarily what you want. So you can add a bunch of other adjustments through a special filter command.

```bash
ffmpeg -f image2 -r 60 -i image-%d.png -filter_complex "FILTER_HERE" output.gif
```

This filter command was by far the most confusing part for me, so I'm going to break it into pieces. The filter is separated with commas and semicolons. Commas separate filters, semicolons separate _chains_ of filters. Between semicolons you can also specify the names of inputs & outputs to the chain. If don't specify a name, it's assumed that the output is just coming from the preceding item.

First bit:

```bash
"fps=10,scale=320:-1:flags=lanczos,"
```

Sets output frame rate to 10fps, and scales it all down to 320px wide. The -1 just keeps the same aspect ratio. `flags=lanczos` refers to the scaling algorithm. There are a bunch of other [scaling algortihms](https://ffmpeg.org/ffmpeg-scaler.html) you can experiment with, but this worked fine for me.

```bash
split[main][back];[back]reverse[r];[main][r]concat=n=2:v=1:a=0,
```

This part makes the gif play forward and then backwards, before looping again. `split` in the beginning copies the input into 2 items, one named `main` and one named `back`. The `reverse` command takes the `back` segment and reverses it, and outputs it as another item labeled `r`. Lastly, the `concat` command takes `main` and `r` and puts them together. `n=2` means there are 2 input segments, `v=1` means one video stream per segment, and `a=0` means 0 audio streams per segment.

Last bit:

```bash
split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse
```

This one creates a palette file from your images and uses that palette when generating the gif.

http://blog.pkh.me/p/21-high-quality-gif-with-ffmpeg.html
https://superuser.com/questions/556029/how-do-i-convert-a-video-to-gif-using-ffmpeg-with-reasonable-quality
https://trac.ffmpeg.org/wiki/Concatenate
https://trac.ffmpeg.org/wiki/FilteringGuide
https://superuser.com/questions/1156837/using-every-nth-image-in-sequence-to-create-video-using-ffmpeg
https://superuser.com/questions/1608327/ffmpeg-boomerang-effect-to-gif
https://www.codeproject.com/Tips/5303741/How-to-Use-FFmpeg-Filters-to-Jazz-Up-Your-Audio-an
https://hamelot.io/visualization/using-ffmpeg-to-convert-a-set-of-images-into-a-video/
https://ottverse.com/how-to-create-gif-from-images-using-ffmpeg/
