
# Magic Publishing, a 3 day CMS system for your Enterprise

Magic Publishing is a Content Management System (CMS) built in .Net Core with some unique qualities. First of all,
its intention is to be super scalable, and extremly fast. Hence, it provides very agressive caching out of the box.
This is because one of its targets, is to be a publishing system for small guerillia news media outlets, to create
news media houses, and similar types of websites. It basically features _"Varnish type of cache"_, out of the box,
with zero configuration required.

<p align="center">
<a href="https://www.youtube.com/watch?v=LYd5iRa0sHE">
<img alt="An explanation of Magic Publishing CMS" title="An explanation of Magic Publishing CMS" src="https://servergardens.files.wordpress.com/2020/02/creating-a-cms-system-in-3-days.png" />
</a>
</p>

It also provides an extremely flexible plugin system, based upon Hyperlambda, allowing you to extend it 100%
dynamically, using a dynamic Turing complete programming language.

Since it's built in .Net Core, it also easily allows itself to be deployed unto Linux machines, and internally it
uses MySQL as its database - Allowing you to easily put it on a Linux box, behind for instance Nginx, using 100%
open source platform software to run it. Notice though, you will need a Magic license to run it in production though.

Its easy to understand templating system, allows you to create designs in any HTML editor of your choice, and
dynamically substitute the dynamic portions of your page.

It is also async in nature, allowing for an insane amount of throughput, easily scaling to a _lot_ of simultaneous
users. And it has a modern Angular based dashboard for editing items and settings in the system.

## Wut ...?

To understand how I could create the system in only 3 days, realise I used a _"no-code"_ framework, built by
yours truly, called [Magic](https://polterguy.github.io). This framework basically produced 95% of the code
that the system is dependent upon, and it did it in 10 seconds. To understand how, watch the following video,
and realise all I really had to do, was to design my database, click two buttons, and 95% of my CMS system's
code was literally done.

<p align="center">
<a href="https://www.youtube.com/watch?v=8xO9H-2Fejc">
<img alt="Create a CRUD Web app in seconds" title="Create a CRUD Web app in seconds" src="https://servergardens.files.wordpress.com/2020/01/magic-video-screenshot.png" />
</a>
</p>

## Getting started

You will need MySQL, DotNet CLI, Visual Studio Code, NodeJS and Angular installed. Google these toolkits to
install them for your specific operating system. Then download the latest release above, unzip, and open the
unzipped folder in for instance Visual Studio Code. Then open two terminal windows, and in one of these terminal
windows go into the _"dashboard"_ folder, and write the following terminal commands in sequence.

```
npm link
ng serve
```

The above will serve your dashboard over port 4200. The to start the backend, use another terminal window, and
enter the _"backend"_ folder, and type the following to start the backend.

```
dotnet run
```

This will start your backend on port 55247. To visit your CMS systems backend, go to [localhost:4200](http://localhost:4200),
and to visit its frontend (your actual website), visit [localhost:55247](http://localhost:55247). The system features
a very aggressive cache though, so if you edit settings and such, or your template, it won't be visible before 5
minutes have passed. If this is a problem during development, you can set the _"caching"_ setting to 1 second
using your dashboard's _"Settings"_ component.

## BETA

Notice, Magic Publishing is BETA at the moment. But if you want to you can subscribe to when it's released in
a stable version. To play around with it, please visit the _"downloads"_ section above ...
