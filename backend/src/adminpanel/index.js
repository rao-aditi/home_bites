// Admin Panel backend entry. Mounted by src/routes/index.js:
//   /api/admin/*  -> adminRouter  (admin-only, role verified against the database)
//   /api/*        -> publicRouter (banners, homepage sections, reviews for the customer site)
module.exports = require("./routes");
