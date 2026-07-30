import test from "node:test";
import assert from "node:assert/strict";
import { validateCheckoutForm } from "./checkoutValidation.js";

test("accepts a valid checkout payload", () => {
  const result = validateCheckoutForm({
    country: "United States",
    address: "123 Main Street Apt 4",
    phoneNumber: "12345678901",
  });

  assert.equal(result.isValid, true);
  assert.deepEqual(result.errors, {});
  assert.equal(result.sanitizedValues.country, "United States");
  assert.equal(result.sanitizedValues.address, "123 Main Street Apt 4");
  assert.equal(result.sanitizedValues.phoneNumber, "12345678901");
});

test("rejects invalid country values", () => {
  const result = validateCheckoutForm({ country: "U1", address: "123 Main Street", phoneNumber: "12345678901" });

  assert.equal(result.isValid, false);
  assert.match(result.errors.country, /Country/);
});

test("rejects address values that are too short or single-word", () => {
  const shortAddress = validateCheckoutForm({ country: "United States", address: "Short", phoneNumber: "12345678901" });
  const singleWordAddress = validateCheckoutForm({ country: "United States", address: "MainStreet", phoneNumber: "12345678901" });

  assert.equal(shortAddress.isValid, false);
  assert.match(shortAddress.errors.address, /at least 10/i);
  assert.equal(singleWordAddress.isValid, false);
  assert.match(singleWordAddress.errors.address, /single word|only numbers/i);
});

test("rejects phone numbers that are not exactly 11 digits", () => {
  const result = validateCheckoutForm({ country: "United States", address: "123 Main Street", phoneNumber: "1234567890" });

  assert.equal(result.isValid, false);
  assert.match(result.errors.phoneNumber, /11 digits/i);
});
