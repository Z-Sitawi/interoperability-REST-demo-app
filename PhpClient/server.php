<?php
// Run with:  php -S localhost:3002 server.php

$jsonString = file_get_contents('../users.json');

$users = json_decode($jsonString, true);

const PHONE_VALIDATOR_URL =
    "http://localhost:8080/RestPhoneValidatorService-1.0-SNAPSHOT/api/phonevalidator/isvalid";

// Enable CORS so the frontend can communicate with this server
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

function json_response(int $status, array $data): void
{
    http_response_code($status);
    header("Content-Type: application/json");
    echo json_encode($data);
    exit;
}

$method = $_SERVER["REQUEST_METHOD"];
$path = parse_url($_SERVER["REQUEST_URI"], PHP_URL_PATH);

// CORS preflight (sent by browsers before a JSON POST)
if ($method === "OPTIONS") {
    http_response_code(204);
    exit;
}

if ($method === "POST" && $path === "/login") {
    // Parse the incoming JSON body (empty array if missing or malformed)
    $body = json_decode(file_get_contents("php://input"), true);
    if (!is_array($body)) {
        $body = [];
    }

    $phone = $body["phone"] ?? null;
    $pwd = $body["password"] ?? null;

    if (!is_string($phone) || $phone === "") {
        json_response(400, ["success" => false, "message" => "Invalid phone number"]);
    }

    // http_build_query URL-encodes the query parameter
    $url = PHONE_VALIDATOR_URL . "?" . http_build_query(["pNum" => $phone]);
    $context = stream_context_create([
        "http" => [
            "method" => "GET",
            "timeout" => 5,
            "ignore_errors" => true, // read the body even on non-2xx responses
        ],
    ]);

    $data = @file_get_contents($url, false, $context);

    if ($data === false) {
        error_log("Error validating phone number: could not reach " . PHONE_VALIDATOR_URL);
        json_response(500, ["success" => false, "message" => "Error validating phone number"]);
    }

    $isValidPhone = trim($data) === "true";

    if (!$isValidPhone) {
        json_response(400, ["success" => false, "message" => "Invalid phone number"]);
    }

    $found = false;
    foreach ($users as $user) {
        if ($user["phone"] === $phone && $user["password"] === $pwd) {
            $found = true;
            break;
        }
    }

    if ($found) {
        json_response(200, ["success" => true, "message" => "Phone is valid. User is authenticated"]);
    }

    json_response(401, ["success" => false, "message" => "Phone is valid. But invalid credentials"]);
}

json_response(404, ["success" => false, "message" => "Not found"]);
