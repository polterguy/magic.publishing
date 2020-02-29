
# Static files

This is where you would want to save your static files. Notice, all requests that are requests for
files with file extensions, will be automatically resolved to this folder. This means that all
files in this folder, and its sub folders, are publicly served to anyone having its URL. Hence, don't
put anything of private character into this folder.

For instance, a request to _"favicon.ico"_ will resolve to _"/static/favicon.ico"_ and so on. This
allows you to put CSS files, images, and JavaScript files inside of this folder, and have them resolved
as static files to the client.
