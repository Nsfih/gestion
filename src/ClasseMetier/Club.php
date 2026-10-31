<?php
declare(strict_types=1);

namespace ClasseMetier;

use PDO;
use ClasseTechnique\Select;
use ClasseTechnique\Database;

// table club : id, nom, fichier

class Club
{

    // répertoire où sont stockés les logos des clubs
    public const string DOSSIER_LOGO_CLUB = DOSSIER_WWW . '/data/club/';

    /**
     * Retourner l'ensemble des clubs
     * Champs à retourner : id, nom, fichier, nb (nombre de licenciés dans le club)
     * @return array
     */
    public static function getAll(): array
    {
        $sql = <<<SQL
           select id, nom, fichier, (select count(*) from coureur where coureur.idClub = club.id) as nb
           from club
           order by nom;
SQL;
        $select = new Select();
        $lesLignes = $select->getRows($sql);

        // ajout d'une colonne permettant de vérifier l'existence du logo
        foreach ($lesLignes as &$ligne) {
            $ligne['present'] = isset($ligne['fichier']) && is_file(self::DOSSIER_LOGO_CLUB . $ligne['fichier']);
        }
        unset($ligne);
        return $lesLignes;
    }

    /**
     * Retourner l'ensemble des clubs pour une liste déroulante (triée par nom)
     * Champs à retourner : id, nom
     * @return array
     */
    public static function getListe(): array
    {
        $sql = <<<SQL
           select id, nom, (select count(*) from coureur where coureur.idClub = club.id) as nb
           from club
           order by nom;
SQL;
        $select = new Select();
        return $select->getRows($sql);
    }

    /**
     * retourner l'ensemble des id des clubs dans un tableau ['080004', ....]
     * @return array
     */
    public static function getLesId(): array
    {
        $sql = "select id from club;";
        $db = Database::getInstance();
        $cmd = $db->query($sql);
        $lesIds = $cmd->fetchAll(PDO::FETCH_COLUMN);
        $cmd->closeCursor();
        return $lesIds;
    }

    /**
     * Retourner les informations sur un club
     * @param string $id
     * @return array | false
     */
    public static function getById(string $id): array|false
    {
        $sql = <<<SQL
             select id, nom, fichier,  (select count(*) from coureur where coureur.idClub = club.id) as nb
             from club
             where id = :id;
SQL;
        $select = new Select();
        return $select->getRow($sql, ['id' => $id]);
    }

}


