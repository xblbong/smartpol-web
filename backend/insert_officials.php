<?php
// Database configuration from .env
$host = 'localhost';
$dbname = 'smartpol_chatbot';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Read SQL file content
    $sqlContent = file_get_contents('database/seeds/officials_data.sql');
    
    // Remove comments and split by semicolon
    $lines = explode("\n", $sqlContent);
    $queries = [];
    $currentQuery = '';
    
    foreach ($lines as $line) {
        $line = trim($line);
        if (empty($line) || str_starts_with($line, '--') || str_starts_with($line, 'COMMIT')) {
            continue;
        }
        
        $currentQuery .= $line . ' ';
        
        if (str_ends_with($line, ';')) {
            $queries[] = trim($currentQuery);
            $currentQuery = '';
        }
    }
    
    foreach ($queries as $query) {
        if (!empty($query)) {
            $stmt = $pdo->prepare($query);
            $stmt->execute();
            echo "Query executed successfully: " . substr($query, 0, 50) . "...\n";
        }
    }
    
    echo "\nAll officials data inserted successfully!\n";
    
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>