<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

require_once 'config.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    die(json_encode([
        'success' => false,
        'errors' => ['Invalid request method']
    ]));
}
  //Hii nimeeka juu ya rate limiting-security here and there, you can comment it out to test the form
if (isset($_SESSION['last_newsletter_submission'])) {
    $timeSinceLastSubmission = time() - $_SESSION['last_newsletter_submission'];
    if ($timeSinceLastSubmission < 3600 / MAX_REQUESTS_PER_HOUR) {
        die(json_encode([
            'success' => false,
            'errors' => [ERROR_MESSAGES['rate_limit']]
        ]));
    }
}

$email = filter_input(INPUT_POST, 'email', FILTER_SANITIZE_EMAIL);

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    die(json_encode([
        'success' => false,
        'errors' => [ERROR_MESSAGES['invalid_email']]
    ]));
}

$domain = strtolower(substr(strrchr($email, "@"), 1));
if (!empty(ALLOWED_DOMAINS) && !in_array($domain, ALLOWED_DOMAINS)) {
    die(json_encode([
        'success' => false,
        'errors' => ['Invalid email domain']
    ]));
}

$headers = [
    'From' => RECEIVING_EMAIL,
    'Reply-To' => $email,
    'X-Mailer' => 'PHP/' . phpversion(),
    'Content-Type' => 'text/plain; charset=utf-8',
    'MIME-Version' => '1.0'
];

$emailContent = "New Newsletter Subscription\n\n";
$emailContent .= "Email: $email\n";
$emailContent .= "Date: " . date('Y-m-d H:i:s') . "\n";
$emailContent .= "IP Address: " . $_SERVER['REMOTE_ADDR'] . "\n";

try {
    $mailSent = mail(
        RECEIVING_EMAIL,
        "New Newsletter Subscription",
        $emailContent,
        implode("\r\n", array_map(
            function ($k, $v) {
                return "$k: $v";
            },
            array_keys($headers),
            $headers
        ))
    );

    if ($mailSent) {
        $_SESSION['last_newsletter_submission'] = time();
        
        echo json_encode([
            'success' => true,
            'message' => SUCCESS_MESSAGES['newsletter']
        ]);
    } else {
        throw new Exception('Failed to send email');
    }
} catch (Exception $e) {
    error_log("Newsletter subscription error: " . $e->getMessage());
    
    echo json_encode([
        'success' => false,
        'errors' => [ERROR_MESSAGES['server_error']]
    ]);
}