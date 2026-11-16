import test from "node:test";
import assert from "node:assert/strict";
import {
  validateRegister,
  validateVerifyEmail,
  validateLogin
} from "../src/validators/auth.validator.js";
import {
  validateAngParams,
  validateIdParam
} from "../src/validators/gurbani.validator.js";
import {
  validateSearchParams,
  validateSearchQuery
} from "../src/validators/search.validator.js";
import {
  validateBookmark,
  validateCollection,
  validateNote
} from "../src/validators/user-library.validator.js";

test("Validation - Auth Validators", () => {
  // Register with weak password and bad email
  const regErrors = validateRegister({
    name: "A",
    email: "not-an-email",
    password: "weak"
  });
  assert.ok(regErrors.length >= 3, "Should catch short name, invalid email, and weak password");

  // Valid registration
  const validReg = validateRegister({
    name: "Gurmukh Singh",
    email: "user@example.com",
    password: "StrongPassword123!"
  });
  assert.equal(validReg.length, 0, "Valid registration should have no errors");

  // Verify email with invalid OTP
  const otpErrors = validateVerifyEmail({
    email: "user@example.com",
    otp: "123" // Only 3 digits
  });
  assert.ok(otpErrors.length > 0, "Should reject non-6-digit OTP");
});

test("Validation - Gurbani & Search Validators", () => {
  const angErrors = validateAngParams({ page: "invalid" });
  assert.ok(angErrors.length > 0, "Should reject non-numeric ang page");

  const idErrors = validateIdParam({ id: "-5" });
  assert.ok(idErrors.length > 0, "Should reject negative ID");

  const searchParamErrors = validateSearchParams({ query: "   " });
  assert.ok(searchParamErrors.length > 0, "Should reject empty query");

  const searchQueryErrors = validateSearchQuery({ type: "99" });
  assert.ok(searchQueryErrors.length > 0, "Should reject search type > 7");
});

test("Validation - User Library Validators", () => {
  const bookmarkErrors = validateBookmark({ type: "unknown_type" });
  assert.ok(bookmarkErrors.length > 0, "Should reject invalid bookmark type");

  const collectionErrors = validateCollection({ title: "" });
  assert.ok(collectionErrors.length > 0, "Should reject empty collection title");

  const noteErrors = validateNote({ content: "   " });
  assert.ok(noteErrors.length > 0, "Should reject empty note content");
});
