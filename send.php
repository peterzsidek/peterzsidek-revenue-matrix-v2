<?php
// CORS – csak a saját domainről engedélyezve
header('Access-Control-Allow-Origin: https://brandfabrik.hu');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=utf-8');

// OPTIONS preflight kérés kezelése
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Csak POST kérés engedélyezett
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'Method not allowed']);
    exit;
}

// Adatok beolvasása (JSON body vagy form-data)
$input = json_decode(file_get_contents('php://input'), true);
if (!$input) {
    $input = $_POST;
}

$name      = trim($input['name']      ?? '');
$phone     = trim($input['phone']     ?? '');
$challenge = trim($input['challenge'] ?? '');
$company   = trim($input['company']   ?? '');
$email     = trim($input['email']     ?? '');

// Kötelező mező ellenőrzés
if (empty($name) || empty($phone)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Hiányzó kötelező mezők']);
    exit;
}

// Spam védelem – alapszintű hossz ellenőrzés
if (strlen($name) > 200 || strlen($phone) > 50 || strlen($challenge) > 2000) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Érvénytelen adatok']);
    exit;
}

// E-mail összeállítása
$to      = 'brandfabrik.email@gmail.com';
$subject = '=?UTF-8?B?' . base64_encode('Új visszahívási kérelem – Revenue Matrix') . '?=';

$body  = "Új visszahívási kérelem érkezett a Revenue Matrix oldalról.\n\n";
$body .= "Név:            " . $name . "\n";
$body .= "Telefon:        " . $phone . "\n";
if (!empty($company)) {
    $body .= "Vállalkozás:    " . $company . "\n";
}
if (!empty($email)) {
    $body .= "Email:          " . $email . "\n";
}
if (!empty($challenge)) {
    $body .= "Kihívás:        " . $challenge . "\n";
}
$body .= "\n---\nBeküldés ideje: " . date('Y-m-d H:i:s') . "\n";
$body .= "IP: " . ($_SERVER['REMOTE_ADDR'] ?? 'ismeretlen') . "\n";

$headers  = "From: noreply@brandfabrik.hu\r\n";
$headers .= "Reply-To: noreply@brandfabrik.hu\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
$headers .= "Content-Transfer-Encoding: 8bit\r\n";

$sent = mail($to, $subject, $body, $headers);

if ($sent) {
    echo json_encode(['ok' => true]);
} else {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'E-mail küldés sikertelen']);
}
