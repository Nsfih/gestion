set default_storage_engine = innodb;

use gestion;

set foreign_key_checks = 0;

drop table if exists categorie;

create table categorie
(
    id     char(3)     not null,
    nom    varchar(20) not null,
    ageMin tinyint     not null,
    ageMax tinyint     not null,

    constraint pk_categorie
        primary key (id),

    constraint uk_categorie_nom
        unique (nom),

    constraint ck_categorie_id
        check ( id regexp '^(M(11|10|[0-9])|[A-Z]{2})$' ),

    constraint ck_categorie_nom_longueur
        check ( char_length(nom) between 5 and 20 ),

    constraint ck_categorie_nom_format
        check ( nom regexp '^[A-Za-z]+(?: [A-Za-z]+)*(?: [0-9]{1,2})?$' ),

    constraint ck_categorie_ageMin
        check ( ageMin between 3 and 99 ),

    constraint ck_categorie_ageMax
        check ( ageMax between 3 and 99 ),

    constraint ck_categorie_age
        check ( ageMin < ageMax )
)
    engine = innodb
    default character set = utf8mb4
    collate = utf8mb4_unicode_ci;

set foreign_key_checks = 1;