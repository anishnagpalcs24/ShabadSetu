import test from "node:test";
import assert from "node:assert/strict";
import crypto from "node:crypto";
import authService from "../src/services/auth.service.js";
import authRepository from "../src/repositories/auth.repository.js";
import userRepository from "../src/repositories/user.repository.js";
import tokenService from "../src/services/token.service.js";
import otpService from "../src/services/otp.service.js";
import emailService from "../src/services/email.service.js";
import { closePool } from "../src/config/db.js";

test.after(async () => {
  await closePool();
});

// Mock emailService so no external calls are made during tests
let lastDispatchedOtp = null;
emailService.sendOtpEmail = async ({ to, otp, type }) => {
  lastDispatchedOtp = otp;
  return { delivered: true, mode: "mocked" };
};

const generateTestEmail = () => `testuser_${Date.now()}_${crypto.randomInt(1000, 9999)}@example.com`;

test("Auth - Full Registration & OTP Flow", async (t) => {
  const email = generateTestEmail();
  const password = "StrongPassword123!";
  const name = "Gurmukh Singh";

  await t.test("1. Registration sends OTP and creates pending record", async () => {
    const regResult = await authService.register({ name, email, password });
    assert.match(regResult.message, /verification code has been sent/i);

    const pending = await authRepository.findLatestPendingVerification(email);
    assert.ok(pending, "Pending verification should exist");
    assert.equal(pending.email, email);
    assert.equal(pending.name, name);
    assert.ok(lastDispatchedOtp, "OTP should have been captured by mock");
  });

  await t.test("2. OTP resend cooldown prevents immediate re-request", async () => {
    await assert.rejects(
      async () => {
        await authService.resendOtp({ email });
      },
      (err) => {
        assert.equal(err.statusCode, 429);
        assert.match(err.message, /Please wait/i);
        return true;
      }
    );
  });

  await t.test("3. OTP attempt limits increment on wrong OTP", async () => {
    // Attempt wrong OTP
    await assert.rejects(
      async () => {
        await authService.verifyEmail({ email, otp: "000000" });
      },
      (err) => {
        assert.equal(err.statusCode, 400);
        assert.match(err.message, /Invalid verification code/i);
        return true;
      }
    );

    const pending = await authRepository.findLatestPendingVerification(email);
    assert.equal(pending.attempts, 1, "Attempts should be 1");
  });

  await t.test("4. OTP expiration rejects expired OTPs", async () => {
    // Create an expired pending verification
    const expiredEmail = generateTestEmail();
    const expiredDate = new Date(Date.now() - 10000); // 10s in past
    await authRepository.createPendingVerification({
      email: expiredEmail,
      name: "Expired User",
      passwordHash: "dummy",
      otpHash: otpService.hashOtp("123456"),
      expiresAt: expiredDate
    });

    await assert.rejects(
      async () => {
        await authService.verifyEmail({ email: expiredEmail, otp: "123456" });
      },
      (err) => {
        assert.equal(err.statusCode, 400);
        assert.match(err.message, /expired/i);
        return true;
      }
    );
  });

  await t.test("5. Successful OTP verification creates active user and issues tokens", async () => {
    const verifyResult = await authService.verifyEmail({
      email,
      otp: lastDispatchedOtp
    });

    assert.ok(verifyResult.user, "User should be returned");
    assert.equal(verifyResult.user.email, email);
    assert.equal(verifyResult.user.isVerified, true);
    assert.ok(verifyResult.accessToken, "Access token should be issued");
    assert.ok(verifyResult.refreshToken, "Refresh token should be issued");

    // Verify user exists in database
    const dbUser = await userRepository.findByEmail(email);
    assert.ok(dbUser, "User must exist in users table");
    assert.equal(dbUser.is_verified, true);
  });

  let activeUser = null;
  let activeAccessToken = null;
  let activeRefreshToken = null;

  await t.test("6. Login with valid credentials succeeds", async () => {
    const loginResult = await authService.login({ email, password });
    assert.ok(loginResult.accessToken);
    assert.ok(loginResult.refreshToken);
    activeUser = loginResult.user;
    activeAccessToken = loginResult.accessToken;
    activeRefreshToken = loginResult.refreshToken;
  });

  await t.test("7. Login with invalid password fails", async () => {
    await assert.rejects(
      async () => {
        await authService.login({ email, password: "WrongPassword123!" });
      },
      (err) => {
        assert.equal(err.statusCode, 401);
        return true;
      }
    );
  });

  let rotatedRefreshToken = null;

  await t.test("8. Refresh token rotation issues new tokens and revokes previous", async () => {
    const refreshResult = await authService.refresh({ refreshToken: activeRefreshToken });
    assert.ok(refreshResult.accessToken);
    assert.ok(refreshResult.refreshToken);
    assert.notEqual(refreshResult.refreshToken, activeRefreshToken, "Token should be rotated");
    rotatedRefreshToken = refreshResult.refreshToken;
  });

  await t.test("9. Refresh token reuse detection revokes entire token family", async () => {
    // Attempting to refresh using the previously rotated (now revoked) token
    await assert.rejects(
      async () => {
        await authService.refresh({ refreshToken: activeRefreshToken });
      },
      (err) => {
        assert.equal(err.statusCode, 401);
        assert.match(err.message, /Token reuse detected/i);
        return true;
      }
    );

    // After reuse detection, even the latest rotated token in that family should now be revoked!
    await assert.rejects(
      async () => {
        await authService.refresh({ refreshToken: rotatedRefreshToken });
      },
      (err) => {
        assert.equal(err.statusCode, 401);
        return true;
      }
    );
  });

  await t.test("10. Logout revokes token session", async () => {
    const loginAgain = await authService.login({ email, password });
    const logoutResult = await authService.logout({
      refreshToken: loginAgain.refreshToken,
      accessToken: loginAgain.accessToken
    });
    assert.match(logoutResult.message, /Logged out successfully/i);

    // After logout, token cannot be refreshed
    await assert.rejects(
      async () => {
        await authService.refresh({ refreshToken: loginAgain.refreshToken });
      },
      (err) => {
        assert.equal(err.statusCode, 401);
        return true;
      }
    );
  });

  await t.test("11. Protected routes verify access token", async () => {
    // Valid token
    const loginFresh = await authService.login({ email, password });
    const decoded = await tokenService.verifyAccessToken(loginFresh.accessToken);
    assert.equal(decoded.email, email);

    // Blacklisted or invalid token fails
    await assert.rejects(
      async () => {
        await tokenService.verifyAccessToken("invalid.token.here");
      },
      (err) => {
        assert.equal(err.statusCode, 401);
        return true;
      }
    );
  });
});
