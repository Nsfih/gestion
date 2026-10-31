<?php
declare(strict_types=1);

namespace ClasseMetier;

use ClasseTechnique\ColumnInt;
use ClasseTechnique\ColumnText;
use ClasseTechnique\ContrainteUnique;
use ClasseTechnique\Select;
use ClasseTechnique\Table;
use PDO;

/**
 * Gestion des catégories de coureurs.
 *
 * Cette classe représente la table categorie.
 *
 * Responsabilités :
 *  définition des colonnes et de leurs règles de validation ;
 *  contrôle des règles métier spécifiques aux catégories ;
 *  gestion des opérations CRUD ;
 *  consultations des catégories.
 *
 * @author Guy Verghote
 * @version 2026.3
 */
class Categorie extends Table
{

    /**
     * Configuration de la table.
     */
    protected function configure(): void
    {
        $this->table = 'categorie';
        $this->primaryKey = 'id';

        $this->addColumn('id', new ColumnText(
            required: true,
            pattern: '^(M(10|[0-9])|[A-Z]{2})$',
            minLength: 2,
            maxLength: 3
        ));
        $this->addColumn('nom', new ColumnText(
            required: true,
            pattern: '^[A-Za-z][A-Za-z]*(?: \d{1,2})?$',
            minLength: 5,
            maxLength: 20
        ));
        $this->addColumn('ageMin', new ColumnInt(required: true, min: 4, max: 99));
        $this->addColumn('ageMax', new ColumnInt(required: true, min: 4, max: 99));
    }



    /**
     * Contrôle métier avant suppression.
     */
    protected function beforeDelete(mixed $id): bool
    {
        $sql = "select 1 from coureur where idCategorie = :id";
        $select = new Select();
        if ($select->getRow($sql, ['id' => $id]) !== null) {
            $this->addError('global', 'Cette catégorie possède des coureurs et ne peut pas être supprimée.');
            return false;
        }
        return true;
    }

    /**
     * Retourne l'année sportive de référence.
     */
    private static function getAnneeReference(): int
    {
        $annee = (int)date('Y');
        if ((int)date('m') >= 9) {
            $annee++;
        }
        return $annee;
    }

    /**
     * Retourne toutes les catégories.
     */
    public static function getAll(): array
    {
        $annee = self::getAnneeReference();
        $sql = <<<SQL
            select categorie.id,
                   categorie.nom,
                   categorie.ageMin,
                   categorie.ageMax,
                   concat(categorie.ageMin, '-', categorie.ageMax) as age,
                   $annee - categorie.ageMax as anneeMin,
                   $annee - categorie.ageMin as anneeMax,
                   concat($annee - categorie.ageMax, '-', $annee - categorie.ageMin) as annee,
                   count(coureur.idCategorie) as nb
            from categorie
            left join coureur on coureur.idCategorie = categorie.id
            group by categorie.id, categorie.nom, categorie.ageMin, categorie.ageMax
            order by categorie.ageMin
SQL;
        $select = new Select();
        return $select->getRows($sql);
    }


    /**
     * Retourne la date de naissance minimale autorisée.
     */
    public static function getDateNaissanceMin(): string
    {
        $annee = self::getAnneeReference();
        $sql = <<<SQL
            select concat($annee - max(ageMax), '-01-01') as dateMin
            from categorie
SQL;
        $select = new Select();
        $ligne = $select->getRow($sql);
        return $ligne['dateMin'];
    }

    /**
     * Retourne la date de naissance maximale autorisée.
     */
    public static function getDateNaissanceMax(): string
    {
        $annee = self::getAnneeReference();
        $sql = <<<SQL
            select concat($annee - min(ageMin), '-12-31') as dateMax
            from categorie
SQL;
        $select = new Select();
        $ligne = $select->getRow($sql);
        return $ligne['dateMax'];
    }
}