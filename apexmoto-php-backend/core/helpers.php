<?php
function json_response(array $data, int $code = 200): void {
    http_response_code($code);
    header('Content-Type: application/json');
    echo json_encode($data);
}

function get_json_input(): array {
    $raw = file_get_contents('php://input');
    $data = json_decode($raw ?: '{}', true);
    return is_array($data) ? $data : [];
}

function validate_required(array $input, array $required): array {
    $missing = [];
    foreach ($required as $field) {
        if (!isset($input[$field]) || $input[$field] === '') $missing[] = $field;
    }
    return $missing;
}
