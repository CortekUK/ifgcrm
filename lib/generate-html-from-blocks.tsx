type Block =
  | { type: "image"; src: string; alt: string }
  | { type: "text"; value: string }
  | { type: "button"; label: string; url: string }
  | { type: "spacer" }
  | { type: "video"; url: string }
  | { type: "social"; links: { platform: string; url: string }[] }
  | { type: "divider" }
  | { type: "html"; code: string }

interface GenerateOptions {
  fromName?: string
  fromEmail?: string
}

export function generateHtmlFromBlocks(blocks: Block[], options?: GenerateOptions): string {
  const fromName = options?.fromName || "The International Football Group"
  const fromEmail = options?.fromEmail || "info@theinternationalfootballgroup.com"

  const blocksHtml = blocks
    .map((block) => {
      switch (block.type) {
        case "image":
          return `<img src="${block.src}" alt="${block.alt}" style="max-width: 100%; height: auto; display: block;" />`

        case "text":
          return `<p style="font-size: 16px; line-height: 1.6; color: #374151; margin: 16px 0;">${block.value}</p>`

        case "button":
          return `<div style="text-align: center; margin: 24px 0;">
            <a href="${block.url}" style="display: inline-block; background: linear-gradient(to right, #2563eb, #1d4ed8); color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 500;">
              ${block.label}
            </a>
          </div>`

        case "spacer":
          return `<div style="height: 32px;"></div>`

        case "divider":
          return `<hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />`

        case "video":
          return `<div style="margin: 24px 0;">
            <a href="${block.url}" style="color: #2563eb;">Watch Video</a>
          </div>`

        case "social":
          const socialLinks = block.links
            .map(
              (link) =>
                `<a href="${link.url}" style="margin: 0 8px; color: #2563eb; text-decoration: none;">${link.platform}</a>`,
            )
            .join("")
          return `<div style="text-align: center; margin: 24px 0;">${socialLinks}</div>`

        case "html":
          return block.code

        default:
          return ""
      }
    })
    .join("\n")

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email Template</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
  <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 40px;">
    <!-- Header -->
    <div style="text-align: center; margin-bottom: 32px;">
      <div style="width: 64px; height: 64px; margin: 0 auto 16px; background: linear-gradient(135deg, #2563eb, #1e40af); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
        <svg viewBox="0 0 24 24" style="width: 32px; height: 32px; fill: white;">
          <circle cx="12" cy="12" r="10" />
        </svg>
      </div>
      <h1 style="margin: 0; font-size: 24px; font-weight: bold; color: #111827;">THE INTERNATIONAL</h1>
      <h2 style="margin: 4px 0 0; font-size: 20px; font-weight: 600; color: #111827;">FOOTBALL GROUP</h2>
    </div>

    <!-- Content Blocks -->
    <div>
      ${blocksHtml}
    </div>

    <!-- Footer -->
    <div style="margin-top: 40px; padding-top: 24px; border-top: 1px solid #e5e7eb; text-align: center; font-size: 12px; color: #6b7280;">
      ${fromName} | ${fromEmail}
    </div>
  </div>
</body>
</html>
  `.trim()
}
