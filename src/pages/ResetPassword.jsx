import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import "../styles/auth.css";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setErrorMessage("");
    setSubmitting(true);

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      setErrorMessage(error.message);
      setSubmitting(false);
      return;
    }

    await supabase.auth.signOut();

    setMessage(
      "Mot de passe modifié. Reconnecte-toi avec ton nouveau mot de passe."
    );

    setPassword("");
    setSubmitting(false);

    setTimeout(() => {
      navigate("/");
    }, 1500);
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <img src="/icon-512.png" alt="Logo" className="auth-logo" />

        <h1>Nouveau mot de passe</h1>

        <form onSubmit={handleSubmit} className="auth-form">
          <label>
            Choisis un mot de passe sécurisé

            <input
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Minimum 6 caractères"
              minLength={6}
              required
            />
          </label>

          {errorMessage && <p className="auth-error">{errorMessage}</p>}
          {message && <p className="auth-message">{message}</p>}

          <button
            type="submit"
            disabled={submitting || password.length < 6}
            className="auth-submit"
          >
            {submitting ? "Modification..." : "Modifier le mot de passe"}
          </button>
        </form>
      </section>
    </main>
  );
}