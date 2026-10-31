SET default_storage_engine = InnoDb;

Set foreign_key_checks = 0;

use gestion;


drop table if exists competenceprojet;
drop table if exists projet;

# Gestion des compétences associées à un projet

create table projet
(
    id  int AUTO_INCREMENT primary key,
    nom varchar(150) not null,
    constraint uk_projet_nom unique (nom)
);

create table competenceprojet
(
    id           int auto_increment not null,
    idProjet     int not null,
    idCompetence int not null,

    constraint pk_competenceprojet
        primary key (id),

    constraint uk_competenceprojet_idprojet_idcompetence
        unique (idProjet, idCompetence),

    constraint fk_competenceprojet_projet
        foreign key (idProjet)
            references projet (id)
            on delete cascade,

    constraint fk_competenceprojet_competence
        foreign key (idCompetence)
            references competence (id)
);


Set foreign_key_checks = 1;