---
layout: post
title:  "Web Publishing Sucks"
date:   2019-06-08 00:00:00
categories: content creation creativity wordpress
---

For the past few months I've been working a lot with scaling a WordPress blog. Let me first say that I have really enjoyed working with WordPress, and it's certainly a user friendly way to post content to the web.

This problem has been keeping me up at night, and I'm afraid that there's not a great solution on the market just yet. It's almost 2020, and I thought that we'd be here by now. But then I remembered that we were promised flying cars, and I've yet to see any of those on the road.

There's something really exciting about the problem space of web publishing to me. There certainly is no lack of content on the internet, but if I were to bet on anything, I'd bet on the fact that companies are going to be more reliant on content marketing than ever in the next few years.

With that reliance on content marketing comes a need for companies to write more content than ever, shoot short films, put out a weekly podcast and manage a whole host of social media channels. This sounds like a full time job, and it certainly is.

I've been putting in full time hours just managing a blog working on dealing with scaling issues around WordPress. This involves many things. Managing where images are stored, putting content behind a CDN, installing and keeping a myriad of plugins up to date, keeping backups, and even setting up staging environments to try out changes before shipping to production. That's a lot! And it's only a small part of the many things that a content team needs to stay on top of.

I really like my job and enjoy working with WordPress, but I feel like surely there are better ways to handle things like content management. Naturally, I began to look for alternatives to WordPreass. There are many alternatives, yet most of them were quite pricey and migrating to a new CMS seems like quite the undertaking. So for now, I feel locked into WordPress, or at least until I can engineer something better for my day to day usage.

Before I rule out WordPress or any alternatives, let's talk about my needs (In no particular order):
-Store images in Azure Storage or S3. We have a lot of media that we work with and will need to offload it somewhere. Azure Storage and S3 do a fantastic job at this.
-Easy to create staging environments. To have fast feedback loops, I need to be able to spin up and tear down a staging environment with ease and have all our content accessible from the staging environment.
-Super fast load times. Since content marketing is the goal of the site I work on, we need to have good scores on tests like PageSpeed Insights to rank well in the search engines. I'd like to have near perfect scores for mobile and for desktop versions of the site.

Nice to haves:
-Content planning functionality- It would be awesome for the content team to have a content calendar built into whatever system that they are using so that they can understand what content goes out to our blog, social media, etc.
-Editing and Commenting- We use Google Docs to handle the drafting of content and rely on comments and collaborative editing to get the job done. With today's modern web applications, a collaborative editing experience is almost to be expected. So is things like auto saving, and keeping a copy in localStorage should the user experience an intermittent internet connection.


Other stuff that I really want:
-Static by default. Static sites are really, really fast. I'd love a system that puts all my content into a static site by the time the build process is completed. Bonus points for supporting things like incremental builds. When I change one post out of 10,000, I don't really want to have to rebuild the entire website if only the content of a post changed.
-Local and remote push and pull- I'd love an environment where people can log into a web interface and write content that eventually gets saved to a database. I'd also like the ability to be a developer and sync my local workstation with the latest content that has been posted online. Having something like this would make my life as a developer supporting a content team about 10x easier.






Wow, that's a lot already, but I have many more things that I would like to see out of a web publishing system.


