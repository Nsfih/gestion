<?php
declare(strict_types=1);

namespace ClasseMetier;

use ClasseTechnique\ColumnDate;
use ClasseTechnique\ColumnEmail;
use ClasseTechnique\ColumnInt;
use ClasseTechnique\ColumnList;
use ClasseTechnique\ColumnText;
use ClasseTechnique\Select;
use ClasseTechnique\Table;
use ClasseTechnique\TextCase;

/**
 * Gestion des coureurs.
 *
 * Les opérations CRUD génériques sont assurées par Table.
 *
 * Cette classe conserve uniquement les règles métier
 * propres aux coureurs.
 *
 * @author Guy Verghote
 * @version 2026.6
 */
class Coureur extends Table
{
    /**
     * Configuration de la table.
     */
    protected function configure(): void
    {
        $this->table = 'coureur';
        $this->primaryKey = 'licence';

        $this->addColumn('licence', new ColumnText(
            required: true,
            insertable: true,
            updatable: false,
            pattern: '^[0-9]{6,7}$',
            minLength: 6,
            maxLength: 7
        ));

        $this->addColumn('nom', new ColumnText(
            required: true,
            pattern: '^[A-Z]( ?[A-Z]+)*$',
            maxLength: 30,
            casse: TextCase::Upper,
            supprimerAccent: true,
            supprimerEspaceSuperflu: true
        ));

        $this->addColumn('prenom', new ColumnText(
            required: true,
            pattern: '^[A-Z]( ?[A-Z]+)*$',
            maxLength: 30,
            casse: TextCase::Upper,
            supprimerAccent: true,
            supprimerEspaceSuperflu: true
        ));

        $this->addColumn('sexe', new ColumnList(
            values: ['M', 'F'],
            casse: TextCase::Upper
        ));

        $this->addColumn('dateNaissance', new ColumnDate(
            required: true,
            min: Categorie::getDateNaissanceMin(),
            max: Categorie::getDateNaissanceMax()
        ));

        $this->addColumn('idClub', new ColumnList(
            values: Club::getLesId()
        ));

        $this->addColumn('ffa', new ColumnInt(
            required: false,
            min: 0,
            max: 1
        ));

        $this->addColumn('email', new ColumnEmail(
            required: false,
            maxLength: 100
        ));

        $this->addColumn('telephone', new ColumnText(
            required: false,
            pattern: '^0(6|7)[0-9]{8}$',
            maxLength: 10
        ));

    }



    /**
     * Retourne tous les coureurs.
     */
    public static function getAll(): array
    {
        $sql = <<<SQL
            select licence, coureur.nom, prenom, concat(coureur.nom, ' ', prenom) as nomPrenom, sexe,
                   date_format(dateNaissance, '%d/%m/%Y') as dateNaissanceFr, idCategorie, club.nom as nomClub,
                   idClub, email, telephone, ffa
            from coureur
            join club on coureur.idClub = club.id
            order by coureur.nom, prenom
SQL;

        $select = new Select();
        return $select->getRows($sql);
    }

    /**
     * Recherche des coureurs par nom/prénom.
     */
    public static function getByNomPrenom(string $nomPrenom): array
    {
        $sql = <<<SQL
            select licence, coureur.nom, prenom, concat(coureur.nom, ' ', prenom) as nomPrenom, sexe,
                   date_format(dateNaissance, '%d/%m/%Y') as dateNaissanceFr, dateNaissance, idCategorie,
                   club.nom as nomClub, ffa, telephone, email, idClub
            from coureur
            join club on coureur.idClub = club.id
            where concat(coureur.nom, ' ', prenom) like :terme
            order by coureur.nom, prenom
            limit 10
SQL;

        $select = new Select();
        return $select->getRows($sql, ['terme' => "%$nomPrenom%"]);
    }
}