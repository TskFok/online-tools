const FULL_DOCUMENT = /<!doctype|<html(?=$|[\s>/])/i

const shell = (fragment: string) => `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
</head>
<body>
${fragment}
</body>
</html>`

export function prepareHtmlDocument(input: string): string | null {
  const text = input.replace(/^\uFEFF/, '').trim()
  if (!text) return null
  if (FULL_DOCUMENT.test(text)) return text
  return shell(text)
}
