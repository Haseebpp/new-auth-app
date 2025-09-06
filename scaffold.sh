#!/usr/bin/env bash
set -euo pipefail

# Usage: ./scaffold.sh [target-directory]
ROOT="${1:-.}"

echo "Scaffolding project in: $ROOT"

# --- Directories ---
dirs=(
  "$ROOT/backend"
  "$ROOT/backend/config"
  "$ROOT/backend/controllers"
  "$ROOT/backend/middleware"
  "$ROOT/backend/models"
  "$ROOT/backend/routes"
  "$ROOT/backend/validation"

  "$ROOT/frontend"
  "$ROOT/frontend/public"
  "$ROOT/frontend/src"
  "$ROOT/frontend/src/state"
  "$ROOT/frontend/src/state/slices"
  "$ROOT/frontend/src/state/services"
  "$ROOT/frontend/src/components"
  "$ROOT/frontend/src/components/site"
  "$ROOT/frontend/src/components/ui"
  "$ROOT/frontend/src/lib"
  "$ROOT/frontend/src/pages"
  "$ROOT/frontend/src/pages/profile"
)

# --- Files ---
files=(
  "$ROOT/AGENTS.md"

  "$ROOT/backend/config/db.js"
  "$ROOT/backend/config/__placeholder.txt"

  "$ROOT/backend/controllers/auth.controller.js"
  "$ROOT/backend/controllers/__placeholder.txt"

  "$ROOT/backend/middleware/auth.middleware.js"
  "$ROOT/backend/middleware/error.middleware.js"
  "$ROOT/backend/middleware/__placeholder.txt"

  "$ROOT/backend/models/user.model.js"
  "$ROOT/backend/models/__placeholder.txt"

  "$ROOT/backend/routes/auth.routes.js"
  "$ROOT/backend/routes/__placeholder.txt"

  "$ROOT/backend/validation/auth.validation.js"
  "$ROOT/backend/validation/__placeholder.txt"

  "$ROOT/backend/server.js"

  "$ROOT/frontend/index.html"

  "$ROOT/frontend/public/favicon.ico"
  "$ROOT/frontend/public/__placeholder.txt"

  "$ROOT/frontend/src/state/store.ts"
  "$ROOT/frontend/src/state/slices/authSlice.ts"
  "$ROOT/frontend/src/state/slices/__placeholder.txt"
  "$ROOT/frontend/src/state/services/authService.ts"
  "$ROOT/frontend/src/state/services/__placeholder.txt"

  "$ROOT/frontend/src/components/site/SiteFooter.tsx"
  "$ROOT/frontend/src/components/site/SiteHeader.tsx"
  "$ROOT/frontend/src/components/site/__placeholder.txt"

  "$ROOT/frontend/src/components/ui/button.tsx"
  "$ROOT/frontend/src/components/ui/card.tsx"
  "$ROOT/frontend/src/components/ui/__placeholder.txt"

  "$ROOT/frontend/src/lib/utlis.ts"
  "$ROOT/frontend/src/lib/constants.ts"
  "$ROOT/frontend/src/lib/__placeholder.txt"

  "$ROOT/frontend/src/pages/Home.tsx"
  "$ROOT/frontend/src/pages/Register.tsx"
  "$ROOT/frontend/src/pages/Login.tsx"
  "$ROOT/frontend/src/pages/profile/profileCard.tsx"
  "$ROOT/frontend/src/pages/profile/profileEdit.tsx"
  "$ROOT/frontend/src/pages/profile/__placeholder.txt"

  "$ROOT/frontend/src/App.tsx"
  "$ROOT/frontend/src/main.tsx"
  "$ROOT/frontend/src/package.json"

  "$ROOT/.env"
  "$ROOT/.gitignore"
  "$ROOT/package.json"
)

# Create directories
for d in "${dirs[@]}"; do
  if [[ -d "$d" ]]; then
    printf 'dir  exists   %s\n' "$d"
  else
    mkdir -p "$d"
    printf 'dir  created  %s\n' "$d"
  fi
done

# Create files (without overwriting existing)
for f in "${files[@]}"; do
  dirpath="$(dirname "$f")"
  [[ -d "$dirpath" ]] || mkdir -p "$dirpath"
  if [[ -e "$f" ]]; then
    printf 'file exists   %s\n' "$f"
  else
    : > "$f"
    printf 'file created  %s\n' "$f"
  fi
done

echo "Done."
