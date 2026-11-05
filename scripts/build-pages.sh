#!/usr/bin/env bash
# Builds the Cloudflare Pages upload folder (.cf-dist) from the site root.
# Deploy: npx wrangler pages deploy .cf-dist --project-name alirazatech
set -euo pipefail

cd "$(dirname "$0")/.."
rm -rf .cf-dist
mkdir .cf-dist

rsync -a \
  --exclude '.*' \
  --exclude 'scripts/' \
  --exclude 'netlify.toml' \
  --exclude 'style-guide.md' \
  ./ .cf-dist/

cat > .cf-dist/_headers <<'EOF'
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff

/assets/Ali-Raza-CV.pdf
  Cache-Control: no-store

/portfolio-section*
  X-Robots-Tag: noindex

/google715ebba8b613028b*
  X-Robots-Tag: noindex

/google8d33dcbe2c5ffda3*
  X-Robots-Tag: noindex

/BingSiteAuth.xml
  X-Robots-Tag: noindex
EOF

echo "Built .cf-dist ($(find .cf-dist -type f | wc -l | tr -d ' ') files, $(du -sh .cf-dist | cut -f1))"
