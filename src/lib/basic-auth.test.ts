import { afterEach, describe, expect, it } from "vitest";

import {
  getBasicAuthCredentials,
  isAuthorizedBasicAuth,
} from "@/lib/basic-auth";

describe("basic-auth", () => {
  const originalUser = process.env.BASIC_AUTH_USER;
  const originalPassword = process.env.BASIC_AUTH_PASSWORD;

  afterEach(() => {
    process.env.BASIC_AUTH_USER = originalUser;
    process.env.BASIC_AUTH_PASSWORD = originalPassword;
  });

  it("skips auth when credentials are unset", () => {
    delete process.env.BASIC_AUTH_USER;
    delete process.env.BASIC_AUTH_PASSWORD;
    expect(getBasicAuthCredentials()).toBeNull();
    expect(isAuthorizedBasicAuth(null)).toBe(true);
  });

  it("accepts matching basic credentials", () => {
    process.env.BASIC_AUTH_USER = "shop";
    process.env.BASIC_AUTH_PASSWORD = "secret";
    const header = `Basic ${Buffer.from("shop:secret").toString("base64")}`;
    expect(isAuthorizedBasicAuth(header)).toBe(true);
  });

  it("rejects invalid credentials", () => {
    process.env.BASIC_AUTH_USER = "shop";
    process.env.BASIC_AUTH_PASSWORD = "secret";
    const header = `Basic ${Buffer.from("shop:wrong").toString("base64")}`;
    expect(isAuthorizedBasicAuth(header)).toBe(false);
  });
});
