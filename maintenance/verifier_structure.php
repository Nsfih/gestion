<?php

declare(strict_types=1);

// ==========================================================
// Lecture de la configuration
// ==========================================================

$configuration = json_decode(
    file_get_contents(__DIR__ . '/structure.json'),
    true,
    512,
    JSON_THROW_ON_ERROR
);

$config = $configuration['database'];
$structure = $configuration['tables'];


// ==========================================================
// Connexion à la base
// ==========================================================

$dsn = "mysql:host={$config['host']};dbname={$config['name']};port={$config['port']};charset=utf8mb4";

$pdo = new PDO(
    $dsn,
    $config['user'],
    $config['password'],
    [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false
    ]
);


echo "Base courante : " . $pdo->query("SELECT DATABASE()")->fetchColumn() . "\n";
echo "Utilisateur : " . $pdo->query("SELECT USER()")->fetchColumn() . "\n";

echo "Tables visibles :\n";

$cmd = $pdo->query("SHOW TABLES");

foreach ($cmd as $ligne) {
    echo "- " . reset($ligne) . "\n";
}

echo "\n";

echo "Vérification de la structure de la base '{$config['name']}'...\n\n";

$tables = $pdo->query("SHOW TABLES")->fetchAll(PDO::FETCH_COLUMN);

$nombreErreurs = 0;

foreach ($structure as $table => $colonnesAttendues) {

    // Vérification de l'existence de la table.
    if (!in_array($table, $tables, true)) {
        echo "[ERREUR] Table absente : $table\n";
        $nombreErreurs++;
        continue;
    }

    // Récupération des colonnes de la table.
    $cmd = $pdo->query("SHOW COLUMNS FROM `$table`");

    $colonnesBase = array_column(
        $cmd->fetchAll(),
        'Field'
    );

    $erreurTable = false;

    // Vérification des colonnes attendues.
    foreach ($colonnesAttendues as $colonne) {

        if (!in_array($colonne, $colonnesBase, true)) {
            echo "[ERREUR] Colonne absente : $table.$colonne\n";
            $nombreErreurs++;
            $erreurTable = true;
        }
    }

    if (!$erreurTable) {
        echo "[OK] $table\n";
    }
}

echo "\n";

if ($nombreErreurs === 0) {
    echo "Structure conforme.\n";
    exit(0);
}

echo "$nombreErreurs erreur(s) détectée(s).\n";
exit(1);
