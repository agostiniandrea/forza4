# Make-public briefing — forza4

Sto per rendere pubblico questo repo. Aiutami a seguire questa scaletta in ordine.

---

## FASE 1 — Controlli di sicurezza

**1. Cerca segreti nel codice:**

```bash
grep -rn --include="*.ts" --include="*.tsx" --include="*.js" --include="*.json" --include="*.env*" -E "(API_KEY|SECRET|PASSWORD|TOKEN|Bearer|DATABASE_URL|PRIVATE_KEY|CLIENT_SECRET)" . --exclude-dir=node_modules --exclude-dir=.next 2>/dev/null | grep -v ".git"
```

```bash
find . -name "*.env*" -o -name ".env" -o -name ".env.local" -o -name ".env.production" | grep -v node_modules | grep -v .git
```

**2. Controlla il .gitignore** (deve coprire `.env*.local`, `node_modules`, `.next`):

```bash
cat .gitignore
```

**3. Controlla le email nella storia git:**

```bash
git log --all --format="%ae" | sort -u
```

L'unica email accettabile è `104834436+agostiniandrea@users.noreply.github.com`.
Se trovi `andrea@thejibe.com` o `andrea.agostini@consoft.it`, devono essere ripulite.

---

## FASE 2 — Ripulitura email (solo se necessario)

Se nella storia ci sono email da rimuovere:

```bash
pip3 install git-filter-repo
```

Crea il mailmap e riscrivi la storia:

```bash
cat > /tmp/mailmap.txt << 'EOF'
Andrea Agostini <104834436+agostiniandrea@users.noreply.github.com> <andrea@thejibe.com>
Andrea Agostini <104834456+agostiniandrea@users.noreply.github.com> <andrea.agostini@consoft.it>
EOF
python3 -m git_filter_repo --mailmap /tmp/mailmap.txt --force
```

Verifica che sia pulita:

```bash
git log --all --format="%ae" | sort -u
```

Poi riaggiungi l'origin e fai force push:

```bash
git remote add origin https://github.com/agostiniandrea/forza4.git
git push origin main --force
```

---

## FASE 3 — Rendi pubblico

```bash
gh repo edit agostiniandrea/forza4 --visibility public --accept-visibility-change-consequences
```

Verifica:

```bash
gh repo view agostiniandrea/forza4 --json visibility -q '.visibility'
```

---

## FASE 4 — Presentazione

Controlla il README:
- C'è il link alla demo live (`https://forza4-game.vercel.app`)?
- Lo stack riflette le dipendenze attuali in `package.json`?
- Le feature principali sono elencate (AI, i18n, fullscreen, WCAG)?

Se manca qualcosa, aggiorna README e pusha.

Poi vai su **github.com/agostiniandrea** → "Customize your pins" e aggiungi forza4 tra i repo in evidenza.

---

## FASE 5 — Workflow CI e branch protection su main

Prima verifica il nome esatto del job nel workflow:

```bash
gh api repos/agostiniandrea/forza4/actions/workflows --jq '.workflows[] | .name'
```

Poi imposta la protezione sul branch (il context `"Typecheck & Lint"` è il `name` del job in `pull-request-test-lint.yml`):

```bash
gh api repos/agostiniandrea/forza4/branches/main/protection \
  --method PUT \
  --header "Accept: application/vnd.github+json" \
  --input - << 'EOF'
{
  "required_status_checks": {
    "strict": true,
    "contexts": ["Typecheck & Lint"]
  },
  "enforce_admins": false,
  "required_pull_request_reviews": {
    "required_approving_review_count": 0,
    "dismiss_stale_reviews": true
  },
  "restrictions": null,
  "allow_force_pushes": false,
  "allow_deletions": false,
  "required_linear_history": true
}
EOF
```

Poi abilita squash merge e auto-delete branch:

```bash
gh repo edit agostiniandrea/forza4 \
  --delete-branch-on-merge \
  --enable-squash-merge \
  --squash-merge-commit-message "pr-title"
```
