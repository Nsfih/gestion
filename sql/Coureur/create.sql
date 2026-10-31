set default_storage_engine = innodb;

use gestion;

set foreign_key_checks = 0;

drop table if exists coureur;
drop table if exists club;

create table club
(
    id      char(6)      not null,
    nom     varchar(70)  not null,
    fichier varchar(100) null,

    constraint pk_club
        primary key (id),

    constraint uk_club_nom
        unique (nom),

    constraint ck_club_id
        check (id regexp '^080[0-9]{3}$'),

    constraint ck_club_nom
        check (
            char_length(nom) between 3 and 60
                and nom regexp '^[A-Za-z]+([ .-][A-Za-z]+)*$'
            )
)
    engine = innodb
    default character set = utf8mb4
    collate = utf8mb4_unicode_ci;


create table coureur
(
    licence       char(7)      not null,
    nom           varchar(30)  not null,
    prenom        varchar(30)  not null,
    sexe          char(1)      not null default 'M',
    dateNaissance date         not null,
    idCategorie   char(3)      not null,
    idClub        char(6)      not null,
    ffa           tinyint(1)   not null default 0,
    email         varchar(100) null,
    telephone     char(10)     null,

    constraint pk_coureur
        primary key (licence),

    constraint uk_coureur_nom_prenom_dateNaissance
        unique (nom, prenom, dateNaissance),

    constraint uk_coureur_email
        unique (email),

    constraint fk_coureur_categorie
        foreign key (idCategorie)
            references categorie (id)
            on update cascade,

    constraint fk_coureur_club
        foreign key (idClub)
            references club (id)
            on update cascade
            on delete restrict,

    constraint ck_coureur_nom
        check ( char_length(nom) between 3 and 30 and nom regexp '^[A-Z]+([ -][A-Z]+)*$' ),

    constraint ck_coureur_prenom
        check ( char_length(prenom) between 3 and 30 and prenom regexp '^[A-Z]+([ -][A-Z]+)*$' ),

    constraint ck_coureur_sexe
        check (sexe in ('M', 'F')),

    constraint ck_coureur_ffa
        check (ffa in (0, 1)),

    constraint ck_coureur_telephone
        check ( telephone is null or telephone regexp '^0[67][0-9]{8}$' ),

    constraint ck_coureur_email
        check ( email is null or email regexp '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$' )
)
    engine = innodb
    default character set = utf8mb4
    collate = utf8mb4_unicode_ci;

set foreign_key_checks = 1;