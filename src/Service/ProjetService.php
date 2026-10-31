<?php
declare(strict_types=1);

namespace Service;

use ClasseMetier\CompetenceProjet;
use ClasseMetier\Projet;
use ClasseTechnique\Database;
use ClasseTechnique\ReponseJson;
use Exception;

/**
 * Service métier pour les projets.
 *
 * Utilisé uniquement pour les opérations nécessitant
 * plusieurs objets métier dans une même transaction.
 *
 * @author Guy Verghote
 * @version 2026.6
 */
class ProjetService
{
    public function enregistrer(string $nom, array $lesCompetences): int|array
    {
        $db = Database::getInstance();
        $db->beginTransaction();

        $projet = new Projet();

        if (!$projet->add(['nom' => $nom])) {
            $db->rollBack();
            ReponseJson::envoyerLesErreurs($projet->getErrors());
        }

        $idProjet = (int)$projet->getLastInsertId();

        $competenceProjet = new CompetenceProjet();

        foreach ($lesCompetences as $idCompetence) {
            if (!$competenceProjet->add(['idProjet' => $idProjet, 'idCompetence' => $idCompetence])) {
                $db->rollBack();
                ReponseJson::envoyerLesErreurs($competenceProjet->getErrors());
            }
        }

        $db->commit();

        return $idProjet;
    }

}