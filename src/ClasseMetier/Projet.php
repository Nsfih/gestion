<?php
declare(strict_types=1);

namespace ClasseMetier;

use ClasseTechnique\ColumnText;
use ClasseTechnique\Select;
use ClasseTechnique\Table;

/**
 * Classe métier représentant un projet.
 *
 * Cette classe hérite de Table qui fournit :
 *
 * - l'ajout ;
 * - la modification ;
 * - la suppression ;
 * - les contrôles génériques ;
 * - la validation des colonnes ;
 * - les contraintes d'unicité.
 *
 * La classe Projet contient uniquement :
 *
 * - la configuration de la table ;
 * - la définition des colonnes ;
 * - les règles métier spécifiques ;
 * - les méthodes de consultation.
 *
 * @author Guy Verghote
 * @version 2026.2
 */
class Projet extends Table
{
    /**
     * Configuration de la table.
     */
    protected function configure(): void
    {
        $this->table = 'projet';
        $this->primaryKey = 'id';

        $this->addColumn('nom', new ColumnText(
            required: true,
            minLength: 10,
            maxLength: 150
        ));

    }

    /**
     * Retourne tous les projets.
     */
    public static function getAll(): array
    {
        $sql = <<<SQL
            select id, nom
            from projet
            order by nom
SQL;
        $select = new Select();
        return $select->getRows($sql);
    }

    /**
     * retourne les projets avec ses compétences
     * @return array
     */
    public static function getProjetEtCompetences(): array
    {
        $sql = <<<SQL
            select projet.id, nom, competenceprojet.idCompetence, concat('C.', idBloc, '.', idDomaine, '.', competence.idCompetence) as code, libelle
            from projet
             join competenceprojet on projet.id = competenceprojet.idProjet
             join competence on competence.id = competenceprojet.idCompetence
            order by nom;
SQL;
        $select = new Select();
        return $select->getRows($sql);
    }


    /**
     * Retourne un projet par son identifiant.
     */
    public static function getById(int $id): ?array
    {
        $sql = <<<SQL
            select id, nom
            from projet
            where id = :id
SQL;
        $select = new Select();
        return $select->getRow($sql, ['id' => $id]);
    }

    /**
     * Vérifie l'existence d'un projet.
     */
    public static function existe(int $idProjet): bool
    {
        $sql = <<<SQL
            select 1
            from projet
            where id = :id
SQL;
        $select = new Select();
        return $select->getRow($sql, ['id' => $idProjet]) !== null;
    }
}