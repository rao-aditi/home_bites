/**
 * Dedupes the inline `style={{ backgroundImage: "var(--gradient-glow)" }}`
 * div that used to be repeated across the login page, home hero and about
 * page.
 */
export function GlowBackground({ className = "absolute inset-0" }) {
  return <div className={className} style={{ backgroundImage: "var(--gradient-glow)" }} />;
}
