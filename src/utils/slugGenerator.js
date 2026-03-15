const { randomBytes } = require("crypto");

function generateSlug(title) {
  if (!title || typeof title !== "string") {
    return null;
  }

  let slug = title.toLowerCase().trim();
  slug = slug.replace(/[^\w\s-]/g, "");
  slug = slug.replace(/\s+/g, "-");
  slug = slug.substring(0, 50);

  const randomSuffix = randomBytes(3).toString("hex");

  return `${slug}-${randomSuffix}`;
}

module.exports = { generateSlug };
