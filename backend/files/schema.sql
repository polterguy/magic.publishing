
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
  `description` varchar(512) NULL,
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
insert into roles (name, description) values ('admin', 'This is an administrator account in your system, and can administrate all parts of the system.');
insert into roles (name, description) values ('editor', 'This is an editor in your system, and allowed to update, delete, and publish content in your system.');
insert into roles (name, description) values ('author', 'This is an elevated user in your system, and allowed to create new content, that an editor must explicitly accept before it is being published.');
insert into roles (name, description) values ('guest', 'This is just a guest visitor to your system, and does not have elevated rights in general, and cannot change the state of your system in any ways.');

/*
 * Inserting a default user with username "admin" and password of "admin".
 * Notice, password is hashed with BlowFish hashing algorithm.
 * We also add this user to the admin role.
 */
insert into users (`username`, `password`) values ('admin', '$2b$10$aaoyEYvWhlePmjufMRIfeOAJrhB/qTvWIAlAIpUI.TXIbySBKbB02');
insert into users_roles (role, user) values ('admin', 'admin');







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
  UNIQUE KEY `root_resolve_url_UNIQUE` (`root_resolve_url`),
  PRIMARY KEY (`name`)
);

/*
 * Inserting some few default item_types into our above table.
 */
insert into item_types (name, root_resolve_url) values ('page', '');
insert into item_types (name, root_resolve_url) values ('article', 'articles');

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
 * Inserting default page into database.
 */
insert into items (`url`, `author`, `template`, `item_type`, `title`, `content`) values ('', 'admin', 'default', 'page', 'Hello World', '# Hello World

This is your first page. Feel free to edit it according to your needs.');







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
