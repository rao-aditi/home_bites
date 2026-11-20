// Files live on local disk (backend/uploads, served at /uploads); only the public URL is
// stored in the database. Swap this for S3/Cloudinary/Supabase Storage in production,
// where server disks are ephemeral — the rest of the app only ever deals in URLs.
function publicUrl(req, filename) {
  const base = process.env.PUBLIC_API_URL || `${req.protocol}://${req.get("host")}`;
  return `${base.replace(/\/+$/, "")}/uploads/${filename}`;
}

const toUrls = (req, files) => files.map((f) => publicUrl(req, f.filename));

module.exports = { toUrls };
