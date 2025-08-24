export interface DeviceInfo {
  type: "mobile" | "desktop" | "tablet"
  os: string
  browser: string
}

export const detectDevice = (userAgent: string): DeviceInfo => {
  const ua = userAgent.toLowerCase()

  // Detect device type
  let type: "mobile" | "desktop" | "tablet" = "desktop"
  if (/tablet|ipad|playbook|silk/i.test(ua)) {
    type = "tablet"
  } else if (/mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(ua)) {
    type = "mobile"
  }

  // Detect OS
  let os = "Unknown"
  if (/windows/i.test(ua)) os = "Windows"
  else if (/macintosh|mac os x/i.test(ua)) os = "macOS"
  else if (/linux/i.test(ua)) os = "Linux"
  else if (/android/i.test(ua)) os = "Android"
  else if (/iphone|ipad|ipod/i.test(ua)) os = "iOS"

  // Detect browser
  let browser = "Unknown"
  if (/chrome/i.test(ua) && !/edge/i.test(ua)) browser = "Chrome"
  else if (/firefox/i.test(ua)) browser = "Firefox"
  else if (/safari/i.test(ua) && !/chrome/i.test(ua)) browser = "Safari"
  else if (/edge/i.test(ua)) browser = "Edge"
  else if (/opera/i.test(ua)) browser = "Opera"

  return { type, os, browser }
}
