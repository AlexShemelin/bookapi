export function consoleGreen(text: string) {
  console.log("\x1b[32m%s\x1b[0m", text);
}

export function consoleRed(text: string) {
  console.log("\x1b[31m%s\x1b[0m", text);
}
