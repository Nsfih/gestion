<?php
declare(strict_types=1);

namespace ClasseMetier;

use ClasseTechnique\ColumnDate;
use ClasseTechnique\ColumnInt;
use ClasseTechnique\ColumnText;
use ClasseTechnique\ColumnTextarea;
use ClasseTechnique\Database;
use ClasseTechnique\Select;
use ClasseTechnique\Table;
use Exception;


/**
 * Gestion des annonces.
 */
class Annonce extends Table
{

    /**
     * Configuration de la table.
     */
    protected function configure(): void
    {
        $this->table = 'annonce';
        $this->primaryKey = 'id';

        $this->addColumn('nom', new ColumnText(
            required: true,
            pattern: "^[A-Za-z0-9ÀÂÆÇÈÉÊËÎÏÔŒÙÛÜŸàâæçèéêëîïôœùûüÿ]+([ '-]?[A-Za-z0-9ÀÂÆÇÈÉÊËÎÏÔŒÙÛÜŸàâæçèéêëîïôœùûüÿ]+)*$",
            minLength: 8,
            maxLength: 100
        ));
        $this->addColumn('date', new ColumnDate(
            required: true,
            min: date('Y-m-d'),
            max: date('Y-m-d', strtotime('+1 year'))
        ));
        $this->addColumn('description', new ColumnTextarea(
            required: true,
            encoderHtml: false,
            acceptHtml: true
        ));
        $this->addColumn('actif', new ColumnInt(
            required: false,
            insertable: false,
            min: 0,
            max: 1
        ));
    }

    /**
     * Retourne les annonces.
     */
    public static function getAll(): array
    {
        $sql = <<<SQL
            select id, nom, description, date, actif, date_format(date, '%d/%m/%Y') as dateFr
            from annonce
            order by date
        SQL;
        $select = new Select();
        return $select->getRows($sql);
    }

    /**
     * retourne les annonces actives et dont la date n'est pas dépassée
     * @return array
     */
    public static function getLesAnnoncesActives(): array
    {
        $sql = <<<SQL
          Select nom, description, date, date_format(date, '%d/%m/%Y') as dateFr
          from annonce 
          where date >= curdate()
          order by date;
SQL;
        $select = new Select();
        return $select->getRows($sql);

    }


    /**
     * Retourne l'annonce dont l'id est passé en paramètre.
     * L'id est un identifiant public aléatoire (non séquentiel), il ne nécessite
     * donc pas de méthode d'accès distincte pour un usage externe (URL).
     */
    public static function getById(string $id): ?array
    {
        $sql = <<<SQL
            select id, nom, description, date
            from annonce
            where id = :id
        SQL;
        $select = new Select();
        $ligne = $select->getRow($sql, ['id' => $id]);
        return $ligne ?: null;
    }

    /**
     * Suppression des anciennes annonces : date dépassée.
     *
     * @return array tableau contenant les id des annonces supprimées
     */
    public static function deleteOld(): array
    {
        $db = Database::getInstance();
        $db->beginTransaction();
        try {
            $sql = <<<SQL
                select id
                from annonce
                where date <= curdate()
            SQL;
            $select = new Select();
            $lesIdSupprimes = array_column($select->getRows($sql), 'id');
            if (!empty($lesIdSupprimes)) {
                $sql = <<<SQL
                    delete from annonce
                    where date <= curdate()
                SQL;
                $db->exec($sql);
            }
            $db->commit();
            return $lesIdSupprimes;
        } catch (Exception $e) {
            $db->rollBack();
            throw $e;
        }
    }
}