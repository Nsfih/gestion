-- jeu de caractères utf8mb4 sur 4 octets intégrant les émoticônes
-- collation insensible à la casse et aux accents et non spécifique à MySQL

set default_storage_engine=InnoDb;

drop database if exists gestion;

create database gestion
  	    character set utf8mb4
	    collate utf8mb4_unicode_ci;

use gestion;






