export const EVALUATION_PROFILE = {
  email: "rm1354@srmist.edu.in",
  githubUsername: "rahuletto",
  rollNo: "RA2311026010101",
  accessCode: "QkbpxH",
} as const;

export const API_NAME = EVALUATION_PROFILE.rollNo;

export const FALLBACK_CLIENT_ID = "1ed64df8-7a2b-453b-9c1a-72d7dd0ea169";
export const FALLBACK_CLIENT_SECRET = "XXQQScTfyYwcpAYH";

export function randomTenDigitMobile(): string {
  return String(1000000000 + Math.floor(Math.random() * 9000000000));
}

export function ensureClientCredsInStorage(): {
  clientID: string;
  clientSecret: string;
} {
  let id = localStorage.getItem("clientID")?.trim() ?? "";
  let secret = localStorage.getItem("clientSecret")?.trim() ?? "";
  if (!id || !secret) {
    id = FALLBACK_CLIENT_ID;
    secret = FALLBACK_CLIENT_SECRET;
    localStorage.setItem("clientID", id);
    localStorage.setItem("clientSecret", secret);
  }
  return { clientID: id, clientSecret: secret };
}
