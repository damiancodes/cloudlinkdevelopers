<?php
//nimeadd hii pia to make your code even more secure
const RECEIVING_EMAIL = 'developerscloudlink@gmail.com';
const SMTP_HOST = 'smtp.gmail.com';
const SMTP_USERNAME = 'your-email@gmail.com';
const SMTP_PASSWORD = 'your-app-specific-password';
const SMTP_PORT = 587;
const MAX_REQUESTS_PER_HOUR = 5;

date_default_timezone_set('Africa/Nairobi');

const IS_DEVELOPMENT = true;
if (IS_DEVELOPMENT) {
    error_reporting(E_ALL);
    ini_set('display_errors', 1);
} else {
    error_reporting(0);
    ini_set('display_errors', 0);
}

const ALLOWED_DOMAINS = [
    'gmail.com',
    'yahoo.com',
    'hotmail.com',
    'outlook.com'
];

const SUCCESS_MESSAGES = [
    'contact' => 'Thank you for your message. We will get back to you soon!',
    'newsletter' => 'Thank you for subscribing to our newsletter!'
];

const ERROR_MESSAGES = [
    'rate_limit' => 'Too many requests. Please try again later.',
    'invalid_email' => 'Please enter a valid email address.',
    'server_error' => 'An error occurred. Please try again later.',
    'invalid_token' => 'Invalid security token. Please refresh the page.'
];