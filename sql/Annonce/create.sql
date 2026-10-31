set default_storage_engine = innodb;

use gestion;

set foreign_key_checks = 0;

drop table if exists annonce;

create table annonce
(
    -- identifiant public, aléatoire et non séquentiel, généré automatiquement par le
    -- déclencheur avantAjoutAnnonce : sert à la fois de clé primaire et de clé d'accès
    -- externe (URL), afin d'éviter qu'un utilisateur puisse deviner l'id d'une autre annonce
    id               char(64)          not null,
    nom              varchar(100)      not null,
    description      text              not null,
    date             date              not null,
    actif            tinyint           not null default 0,
    dateCreation     timestamp         not null default current_timestamp,
    dateModification timestamp         not null default current_timestamp on update current_timestamp,

    constraint pk_annonce
        primary key (id),

    constraint ck_annonce_nom_format
        check (
            nom collate utf8mb4_bin regexp
            '^[A-Za-zÀ-ÖØ-öø-ÿ0-9][A-Za-zÀ-ÖØ-öø-ÿ0-9''().!?, -]*$'
            ),

    constraint ck_annonce_actif
        check (actif in (0, 1))
)
    engine = innodb
    default character set = utf8mb4
    collate = utf8mb4_unicode_ci;

set foreign_key_checks = 1;