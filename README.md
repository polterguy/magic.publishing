
# Magic Publishing

Magic Publishing is a Content Management System (CMS) built in .Net Core with some unique qualities. First of all,
its intention is to be super scalable, and extremly fast. Hence, it provides very agressive caching out of the box.
This is because one of its targets, is to be a publishing system for small guerillia news media outlets, to create
news media houses, and similar types of websites. It basically features _"Varnish type of cache"_, out of the box,
with zero configuration required.

It also provides an extremely flexible plugin system, based upon Hyperlambda, allowing you to extend it 100%
dynamically, using a dynamic Turing complete programming language.

Since it's built in .Net Core, it also easily allows itself to be deployed unto Linux machines, and internally it
uses MySQL as its database - Allowing you to easily put it on a Linux box, behind for instance Nginx, using 100%
open source platform software to run it. Notice though, you will need a Magic license to run it in production though.

Its easy to understand templating system, allows you to create designs in any HTML editor of your choice, and
dynamically substitute the dynamic portions of your page.

It is also async in nature, allowing for an insane amount of throughput, easily scaling to a _lot_ of simultaneous
users. And it has a modern Angular based dashboard for editing items and settings in the system.

## BETA

Notice, Magic Publishing is BETA at the moment. But if you want to you can subscribe to when it's released in
a stable version.
