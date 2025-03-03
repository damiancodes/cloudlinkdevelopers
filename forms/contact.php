<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    die(json_encode([
        'success' => false,
        'errors' => ['Invalid request method']
    ]));
}

$errors = [];
$name = htmlspecialchars(strip_tags($_POST['name'] ?? ''));
$email = filter_input(INPUT_POST, 'email', FILTER_SANITIZE_EMAIL);
$subject = htmlspecialchars(strip_tags($_POST['subject'] ?? ''));
$message = htmlspecialchars(strip_tags($_POST['message'] ?? ''));

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'Invalid email format';
}

if (empty($name) || strlen($name) < 2 || strlen($name) > 50) {
    $errors[] = 'Name must be between 2 and 50 characters';
}

if (empty($subject) || strlen($subject) < 3 || strlen($subject) > 100) {
    $errors[] = 'Subject must be between 3 and 100 characters';
}

if (empty($message) || strlen($message) < 10 || strlen($message) > 2000) {
    $errors[] = 'Message must be between 10 and 2000 characters';
}

if (!empty($errors)) {
    die(json_encode([
        'success' => false,
        'errors' => $errors
    ]));
}

$headers = [
    'From' => $email,
    'Reply-To' => $email,
    'X-Mailer' => 'PHP/' . phpversion(),
    'Content-Type' => 'text/plain; charset=utf-8',
    'MIME-Version' => '1.0'
];

$emailContent = "New Contact Form Submission\n\n";
$emailContent .= "Name: $name\n";
$emailContent .= "Email: $email\n";
$emailContent .= "Subject: $subject\n\n";
$emailContent .= "Message:\n$message\n";

try {
    $mailSent = mail(
        'developerscloudlink@gmail.com',
        "New Contact Form Message: $subject",
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
        echo json_encode([
            'success' => true,
            'message' => 'Message sent successfully!'
        ]);
    } else {
        throw new Exception('Failed to send email');
    }
} catch (Exception $e) {
    error_log("Contact form error: " . $e->getMessage());
    echo json_encode([
        'success' => false,
        'errors' => ['An error occurred while sending the message. Please try again later.']
    ]);
}