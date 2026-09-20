module.exports.MSG = {
    // Admin Registration
    ADMIN_REGISTRATION_SUCCESS: "Admin registered successfully.",
    ADMIN_REGISTRATION_FAILED: "Admin registration failed.",
    ADMIN_ALREADY_EXISTS: "Admin already exists.",

    // Admin Login
    ADMIN_LOGIN_SUCCESS: "Admin logged in successfully.",
    ADMIN_LOGIN_FAILED: "Admin login failed.",
    ADMIN_LOGIN_ATTEMPT_REACHED: "Admin login attempt reached. Please try again after 1 hour.",
    ADMIN_INVALID_CREDENTIALS: "Invalid email or password.",

    // Admin OTP
    ADMIN_OTP_SENT_SUCCESS: "OTP sent successfully.",
    ADMIN_OTP_SENT_FAILED: "Failed to send OTP.",
    ADMIN_INVALID_OTP: "Invalid OTP.",
    ADMIN_OTP_EXPIRED: "OTP has expired.",
    ADMIN_OTP_VERIFIED: "OTP verified successfully.",
    ADMIN_OTP_VERIFICATION_FAILED: "OTP verification failed.",
    ADMIN_OTP_ATTEMPT_REACHED: "OTP verification attempt limit reached. Please try again after 1 hour.",
    ADMIN_OTP_SEND_ATTEMPT_REACHED: "OTP request limit reached. Please try again after 1 hour.",
    ADMIN_OTP_VERIFY_ATTEMPT_REACHED: "OTP verification attempt limit reached. Please try again after 1 hour.",
    ADMIN_OTP_SEND_ATTEMPT_REACHED: "OTP request limit reached. Please try again after 1 hour.",
    ADMIN_OTP_VERIFICATION_REQUIRED: "OTP verification is required before changing the password.",

    // Admin Password Reset
    ADMIN_PASSWORD_RESET_SUCCESS: "Password reset successfully.",
    ADMIN_PASSWORD_RESET_FAILED: "Password reset failed.",
    ADMIN_PASSWORD_RESET_REQUIRED: "Password reset is required.",
    ADMIN_PASSWORD_MISMATCH: "Passwords do not match.",
    ADMIN_OLD_PASSWORD_INCORRECT: "Old password is incorrect.",

    // Admin Token
    ADMIN_TOKEN_REQUIRED: "Authentication token is required.",
    ADMIN_TOKEN_INVALID: "Invalid authentication token.",
    ADMIN_TOKEN_EXPIRED: "Authentication token has expired. Please login again.",
    ADMIN_TOKEN_VERIFICATION_FAILED: "Token verification failed.",
    ADMIN_UNAUTHORIZED: "Unauthorized access.",
    ADMIN_ACCESS_DENIED: "Access denied.",

    // Resident
    RESIDENT_REQUIRED_FIELDS: "All required fields are required.",
    RESIDENT_EMAIL_ALREADY_EXISTS: "Resident already exists.",
    RESIDENT_NUMBER_ALREADY_EXISTS: "Resident with this mobile number already exists.",
    RESIDENT_HOUSE_ALREADY_ASSIGNED: "This house is already assigned to a resident.",
    RESIDENT_CREATED_SUCCESS: "Resident created successfully.",
    RESIDENT_CREATION_FAILED: "Resident creation failed.",


    // Common
    ADMIN_REQUIRED_FIELDS: "Required fields are missing.",
    ADMIN_NOT_FOUND: "Admin not found.",

    // Server
    INTERNAL_SERVER_ERROR: "Internal server error.",

    // Admin CRUD
    ADMIN_REQUIRED_FIELDS: "Required fields are missing.",
    ADMIN_NOT_FOUND: "Admin not found.",

    ADMIN_CREATED_SUCCESS: "Admin created successfully.",
    ADMIN_CREATION_FAILED: "Admin creation failed.",

    ADMIN_FETCH_ALL_SUCCESS: "Admins fetched successfully.",
    ADMIN_FETCH_ALL_FAILED: "Failed to fetch admins.",

    ADMIN_FETCH_SINGLE_SUCCESS: "Admin fetched successfully.",
    ADMIN_FETCH_SINGLE_FAILED: "Failed to fetch admin.",

    ADMIN_UPDATED_SUCCESS: "Admin updated successfully.",
    ADMIN_UPDATE_FAILED: "Admin update failed.",

    ADMIN_DELETED_SUCCESS: "Admin deleted successfully.",
    ADMIN_DELETION_FAILED: "Admin deletion failed.",

    // Refresh Token
    REFRESH_TOKEN_REQUIRED: "Refresh token is required.",
    REFRESH_TOKEN_INVALID: "Invalid refresh token.",
    REFRESH_TOKEN_EXPIRED: "Refresh token has expired.",
    REFRESH_TOKEN_GENERATED: "Access token generated successfully.",
    REFRESH_TOKEN_GENERATION_FAILED: "Failed to generate access token.",
    REFRESH_TOKEN_REVOKED: "Refresh token has been revoked.",

    // Refresh Token Access Validation
    ACCESS_TOKEN_REQUIRED: "Access token is required.",
    ACCESS_TOKEN_INVALID: "Invalid access token.",
    ACCESS_TOKEN_EXPIRED: "Access token has expired.",
    ACCESS_TOKEN_VERIFICATION_FAILED: "Access token verification failed.",
    ACCESS_TOKEN_PAYLOAD_INVALID: "Access token payload is invalid.",
    ACCESS_TOKEN_USER_MISMATCH: "Access token user mismatch.",
    ACCESS_TOKEN_ROLE_MISMATCH: "Access token role mismatch.",
}