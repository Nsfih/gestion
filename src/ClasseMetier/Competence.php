<?php
declare(strict_types=1);

namespace ClasseMetier;

use ClasseTechnique\Select;

class Competence
{

    /**
     * retourne les projets du portfolio de l'utilisateur
     * @return array
     */
    public static function getAll(): array
    {
        $sql = <<<SQL
            select concat('C.', idBloc, '.', idDomaine, '.', idCompetence) as code, libelle
            from competence
            order by code;
SQL;
        $select = new Select();
        return $select->getRows($sql);
    }

    /**
     * retourne les compétences
     * @param string $idBloc
     * @param string $idDomaine
     * @return array
     */
    public static function getLesCompetences(string $idBloc, string $idDomaine = '*'): array
    {
        $lesParametres['idBloc'] = $idBloc;
        $sql = <<<SQL
            select id, concat('C.', idBloc, '.', idDomaine, '.', idCompetence) as code, libelle
            from competence
            where idBloc = :idBloc
SQL;
        // prise en compte du domaine si l'idDomaine n'a pas la valeur par défaut
        if ($idDomaine !== '*') {
            $sql .= " and  idDomaine = :idDomaine";
            $lesParametres['idDomaine'] = $idDomaine;
        }

        $select = new Select();
        return $select->getRows($sql, $lesParametres);
    }

    /**
     * retourne les blocs
     * @return array
     */
    public static function getLesBlocs(): array
    {
        $sql = <<<SQL
            select id, libelle
            from bloc
            order by libelle;
SQL;
        $select = new Select();
        return $select->getRows($sql);
    }

    /**
     * retourne les domaines du bloc
     * @param int $idBloc
     * @return array
     */
    public static function getLesDomaines(int $idBloc): array
    {
        $sql = <<<SQL
            select idDomaine, libelle
            from domaine
            where idBloc = :idBloc
            order by libelle;   
SQL;
        $select = new Select();
        return $select->getRows($sql, ['idBloc' => $idBloc]);
    }


    public static function getById(int $id): mixed
    {
        $sql = <<<SQL
            select id, libelle, idBloc, idDomaine, idCompetence
            from competence
            where id = :id;
SQL;
        $select = new Select();
        return $select->getRow($sql, ['id' => $id]);
    }

    /**
     * Indique si une compétence existe.
     *
     * @param int $id Identifiant de la compétence.
     *
     * @return bool
     */
    public static function existe(int $id): bool
    {
        $sql = <<<SQL
        select 1
        from competence
        where id = :id;
SQL;

        $select = new Select();

        return $select->getRow($sql, ['id' => $id]) !== null;
    }

    /**
     * Indique si une compétence appartient au bloc indiqué.
     *
     * @param int $idCompetence Identifiant de la compétence.
     * @param int $idBloc        Bloc recherché.
     *
     * @return bool
     */
    public static function appartientAuBloc(int $idCompetence, int $idBloc): bool
    {
        $sql = <<<SQL
        select 1
        from competence
        where id = :idCompetence
          and idBloc = :idBloc;
SQL;
        $select = new Select();
        return $select->getRow($sql, ['idCompetence' => $idCompetence, 'idBloc'       => $idBloc]) !== null;
    }

}


