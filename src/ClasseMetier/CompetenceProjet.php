<?php
declare(strict_types=1);

namespace ClasseMetier;

use ClasseTechnique\ColumnInt;
use ClasseTechnique\Select;
use ClasseTechnique\Table;

/**
 * Association entre un projet et une compétence.
 *
 * @author Guy Verghote
 * @version 2026.2
 */
class CompetenceProjet extends Table
{
    /**
     * Configuration de la table.
     */
    protected function configure(): void
    {
        $this->table = 'competenceprojet';
        $this->primaryKey = 'id';

        $this->addColumn('idProjet', new ColumnInt(required: true, insertable: true, updatable: false));
        $this->addColumn('idCompetence', new ColumnInt(required: true, insertable: true, updatable: false));
    }



    /**
     * Retourne les compétences d'un projet.
     */
    public static function getLesCompetences(int $idProjet): array
    {
        $sql = <<<SQL
            select competence.id,
                   concat('C.', idBloc, '.', idDomaine, '.', competence.idCompetence) as code,
                   libelle
            from competenceprojet
            join competence on competence.id = competenceprojet.idCompetence
            where idProjet = :idProjet
            order by libelle
SQL;
        $select = new Select();
        return $select->getRows($sql, ['idProjet' => $idProjet]);
    }

    /**
     * Retourne les identifiants des compétences d'un projet.
     */
    public static function getLesIdCompetences(int $idProjet): array
    {
        $sql = <<<SQL
            select id, idCompetence
            from competenceprojet
            where idProjet = :idProjet
            order by idCompetence
SQL;
        $select = new Select();
        return $select->getRows($sql, ['idProjet' => $idProjet]);
    }

    /**
     * Vérifie si une compétence est déjà associée à un projet.
     */
    public static function existe(int $idProjet, int $idCompetence): bool
    {
        $sql = <<<SQL
            select 1
            from competenceprojet
            where idProjet = :idProjet
              and idCompetence = :idCompetence
SQL;
        $select = new Select();
        return $select->getRow($sql, ['idProjet' => $idProjet, 'idCompetence' => $idCompetence]) !== null;
    }
}