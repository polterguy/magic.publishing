
/*
 * Creating Magic database.
 */
CREATE DATABASE `magic`;
USE `magic`;







/*
 * Creating all things associated with authorisation and authentication first.
 */

/*
 * Creating users table.
 */
CREATE TABLE `users` (
  `username` varchar(256) NOT NULL,
  `password` varchar(256) NOT NULL,
  PRIMARY KEY (`username`),
  UNIQUE KEY `username_UNIQUE` (`username`)
);

/*
 * Creating roles table.
 */
CREATE TABLE `roles` (
  `name` varchar(45) NOT NULL,
  `description` varchar(256) NULL,
  PRIMARY KEY (`name`),
  UNIQUE KEY `name_UNIQUE` (`name`)
);

/*
 * Creating association between roles and users through users_roles table.
 */
CREATE TABLE `users_roles` (
  `role` varchar(45) NOT NULL,
  `user` varchar(256) NOT NULL,
  PRIMARY KEY (`role`, `user`),
  KEY `roles_fky_idx` (`role`),
  KEY `users_fky_idx` (`user`),
  CONSTRAINT `roles_fky` FOREIGN KEY (`role`) REFERENCES `roles` (`name`) ON DELETE CASCADE,
  CONSTRAINT `users_fky` FOREIGN KEY (`user`) REFERENCES `users` (`username`) ON DELETE CASCADE
);

/*
 * Inserting some few roles into our roles table.
 */
insert into roles (name, description) values ('root', 'This is a root account in your system, and it has complete access to do anything.');
insert into roles (name, description) values ('admin', 'This is an administrator account in your system, and can administrate most parts of the site.');
insert into roles (name, description) values ('user', 'This is a normal user in your system, and it does not have elevated rights in general.');
insert into roles (name, description) values ('guest', 'This is just a guest visitor to your system, and does not have elevated rights in general.');







/*
 * Creating tables associated with your content.
 */

/*
 * Creating items type table. This defines the different types of
 * items you can have in your database, in addition to its root URL resolver.
 */
CREATE TABLE `item_types` (
  `name` varchar(50) NOT NULL,
  `root_resolve_url` varchar(50) NOT NULL,
  PRIMARY KEY (`name`)
);

/*
 * Inserting some few default item_types into our above table.
 */
insert into item_types (name, root_resolve_url) values ('page', '/');
insert into item_types (name, root_resolve_url) values ('article', '/articles/');

/*
 * Creating templates table, which contains the HTML templates for your content.
 * Basically the equivalent of "themes" or "skins".
 */
CREATE TABLE `templates` (
  `name` varchar(50) NOT NULL,
  `content` longtext,
  PRIMARY KEY (`name`)
);

/*
 * Inserting our default template.
 */
insert into templates (name, content) values ('default', '<html>
  <head>
    <title>![[title]]!</title>
  </head>
  <body>
![[content]]!
  </body>
</html>');

/*
 * Creating our items table, that contains the published items in your system.
 */
CREATE TABLE `items` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `url` varchar(256) NOT NULL,
  `author` varchar(256) NOT NULL,
  `template` varchar(50) NOT NULL,
  `item_type` varchar(50) NOT NULL,
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `title` varchar(512),
  `content` longtext,
  UNIQUE KEY `url_UNIQUE` (`url`),
  CONSTRAINT `author_fky` FOREIGN KEY (`author`) REFERENCES `users` (`username`),
  CONSTRAINT `item_type_fky` FOREIGN KEY (`item_type`) REFERENCES `item_types` (`name`),
  CONSTRAINT `template_fky` FOREIGN KEY (`template`) REFERENCES `templates` (`name`),
  PRIMARY KEY (`id`)
);







/*
 * Creating meta data types of table(s).
 */

/*
 * Creating settings table.
 */
CREATE TABLE `settings` (
  `name` varchar(50) NOT NULL,
  `value` varchar(512) NOT NULL,
  PRIMARY KEY (`name`),
  UNIQUE KEY `name_UNIQUE` (`name`)
);
