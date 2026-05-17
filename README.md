# Anesthésie Pédiatrique

Application React/Vite avec authentification Supabase obligatoire.

## Configuration Supabase

1. Installe les dépendances :

```bash
npm install
```

2. Copie le fichier d'environnement :

```bash
cp .env.example .env.local
```

3. Renseigne tes clés Supabase dans `.env.local` :

```bash
VITE_SUPABASE_URL=https://ton-projet.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=ta_publishable_key
```

4. Dans Supabase, active l'authentification email/password :

`Authentication` → `Providers` → `Email`.

Si la confirmation email est activée, l'utilisateur devra valider son email avant de pouvoir se connecter.

## Lancer le projet

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Confidentialité patient

L'authentification utilise Supabase Auth pour gérer les comptes et les sessions.

Les données patient saisies dans l'application, comme l'âge et le poids, restent uniquement dans l'état local React du navigateur. Elles ne sont pas envoyées à Supabase et ne sont pas stockées côté serveur.
