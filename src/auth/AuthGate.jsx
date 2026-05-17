import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "./AuthProvider";
import "../styles/auth.css";
import CGUModal from "../components/CGUModal";

function AuthScreen() {
  const [mode, setMode] = useState("connexion");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [acceptCGU, setAcceptCGU] = useState(false);
  const [showCGU, setShowCGU] = useState(false);

  const isSignup = mode === "inscription";

  const canSubmit =
    email.trim() !== "" &&
    password.length >= 6 &&
    !submitting &&
    (!isSignup || acceptCGU);

  async function handleForgotPassword() {
    if (!email.trim()) {
      setErrorMessage("Entre ton email d’abord.")
      return
    }

    setErrorMessage("")
    setMessage("")

    const { error } = await supabase.auth.resetPasswordForEmail(
      email.trim(),
      {
        redirectTo: `${window.location.origin}/reset-password`,
      }
    )

    if (error) {
      setErrorMessage(error.message)
    } else {
      setMessage("Email de récupération envoyé.")
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setErrorMessage("");
    setSubmitting(true);

    try {
      if (isSignup) {
        const { error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
        });

        if (error) throw error;

        setMessage(
          "Compte créé. Vérifie ta boîte mail avant de te connecter."
        );
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (error) throw error;
      }
    } catch (error) {
      setErrorMessage(error.message ?? "Une erreur est survenue.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card" aria-label="Authentification">
        <img src="/icon-512.png" alt="Logo" className="auth-logo" />

        <h1>Anesthésie Pédiatrique</h1>

        <p className="auth-intro">
          Connexion obligatoire. Les informations patient saisies ensuite restent
          uniquement dans le navigateur et ne sont pas enregistrées côté serveur.
        </p>

        <div
          className="auth-tabs"
          role="tablist"
          aria-label="Mode d'authentification"
        >
          <button
            type="button"
            className={mode === "connexion" ? "active" : ""}
            onClick={() => {
              setMode("connexion");
              setMessage("");
              setErrorMessage("");
              setAcceptCGU(false);
            }}
          >
            Connexion
          </button>

          <button
            type="button"
            className={mode === "inscription" ? "active" : ""}
            onClick={() => {
              setMode("inscription");
              setMessage("");
              setErrorMessage("");
              setAcceptCGU(false);
            }}
          >
            Inscription
          </button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <label>
            Email

            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="nom@exemple.fr"
              required
            />
          </label>

          <label>
            Mot de passe

            <input
              type="password"
              autoComplete={isSignup ? "new-password" : "current-password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Minimum 6 caractères"
              minLength={6}
              required
            />
          </label>

          {isSignup && (
            <label className="auth-cgu">
              <input
                type="checkbox"
                checked={acceptCGU}
                onChange={(event) => setAcceptCGU(event.target.checked)}
              />

              <span>
                J’accepte les{" "}

                <button
                  type="button"
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    setShowCGU(true);
                  }}
                  className="auth-cgu-link"
                >
                  conditions d’utilisation
                </button>

                {" "}et reconnais que cette application constitue une aide à la pratique
                clinique destinée aux professionnels de santé.
              </span>
            </label>
          )}

          {errorMessage && <p className="auth-error">{errorMessage}</p>}

          {message && <p className="auth-message">{message}</p>}
          {!isSignup && (
            <button
              type="button"
              onClick={handleForgotPassword}
              style={{
                background: "none",
                border: "none",
                color: "#555",
                textDecoration: "underline",
                marginBottom: 12,
                cursor: "pointer",
              }}
            >
              Mot de passe oublié ?
            </button>
          )}
          <button
            type="submit"
            disabled={!canSubmit}
            className="auth-submit"
          >
            {submitting
              ? "Traitement..."
              : isSignup
                ? "Créer mon compte"
                : "Se connecter"}
          </button>
        </form>
      </section>
      <CGUModal
        open={showCGU}
        onClose={() => setShowCGU(false)}
      />      
    </main>
  );
}

function AuthLoading() {
  return (
    <main className="auth-page">
      <section className="auth-card auth-loading">
        <img src="/icon-512.png" alt="Logo" className="auth-logo" />
        <p>Vérification de la session...</p>
      </section>
    </main>
  );
}

export default function AuthGate({ children }) {
  const { loading, user } = useAuth();

  if (loading) return <AuthLoading />;
  if (!user) return <AuthScreen />;

  return children;
}