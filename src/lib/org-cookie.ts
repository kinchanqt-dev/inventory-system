export const ACTIVE_ORG_COOKIE = "active_organization_id";

function isDigitCode(code: number) {
  return code >= 48 && code <= 57;
}

function isLetterCode(code: number) {
  return code >= 97 && code <= 122;
}

function isSlugChar(char: string) {
  const code = char.codePointAt(0);
  if (code === undefined) {
    return false;
  }
  if (isDigitCode(code)) {
    return true;
  }
  return isLetterCode(code);
}

function appendSlugChar(result: string, char: string) {
  if (isSlugChar(char)) {
    return `${result}${char}`;
  }
  if (result.length === 0) {
    return result;
  }
  if (result.endsWith("-")) {
    return result;
  }
  return `${result}-`;
}

export function slugifyOrgName(name: string): string {
  let result = "";
  for (const char of name.trim().toLowerCase()) {
    result = appendSlugChar(result, char);
  }
  if (result.endsWith("-")) {
    return result.slice(0, -1).slice(0, 48);
  }
  return result.slice(0, 48);
}
