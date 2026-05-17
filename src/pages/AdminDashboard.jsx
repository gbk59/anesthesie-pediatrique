import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { Link } from "react-router-dom";

const cardStyle = {
  border: "1px solid #e5e7eb",
  borderRadius: 18,
  padding: 16,
  background: "#ffffff",
  boxShadow: "0 4px 14px rgba(0,0,0,0.04)",
};

export default function AdminDashboard() {
  const [stats, setStats] = useState([]);
  const [dailyStats, setDailyStats] = useState([]);
  const [uniqueUsers, setUniqueUsers] = useState(0);
  const [lastActivity, setLastActivity] = useState(null);
  const [topUsers, setTopUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    async function loadDashboard() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      const { data: adminData, error: adminError } = await supabase
        .from("admin_users")
        .select("user_id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (adminError || !adminData) {
        setLoading(false);
        return;
      }

      setIsAdmin(true);

      const { data: statsData } = await supabase.from("open_tab_stats").select("*");
      setStats(statsData || []);

      const { data: dailyData } = await supabase.from("open_tab_daily_stats").select("*");
      setDailyStats(dailyData || []);

      const { data: usersData } = await supabase
        .from("unique_users_stats")
        .select("*")
        .maybeSingle();

      setUniqueUsers(usersData?.total_users || 0);

      const { data: lastData } = await supabase
        .from("last_activity_stats")
        .select("*")
        .maybeSingle();

      setLastActivity(lastData?.last_activity || null);

      const { data: topUsersData } = await supabase
        .from("top_users_stats")
        .select("*");

      setTopUsers(topUsersData || []);

      setLoading(false);
    }

    loadDashboard();
  }, []);

  const totalOpenings = stats.reduce((sum, item) => sum + item.total, 0);
  const maxTotal = stats[0]?.total || 1;
  const topTab = stats[0]?.event_value || "Aucun";

  if (loading) {
    return (
      <main style={{ padding: 24 }}>
        <p>Chargement...</p>
      </main>
    );
  }

  if (!isAdmin) {
    return (
      <main style={{ padding: 24 }}>
        <h1>Accès refusé</h1>
        <p>Tu n’as pas les droits administrateur.</p>
      </main>
    );
  }

  return (
    <main
      style={{
        padding: 16,
        maxWidth: 900,
        margin: "0 auto",
        background: "#f8fafc",
        minHeight: "100vh",
      }}
    >
    <div
    style={{
        position: "sticky",
        top: 0,
        zIndex: 10,
        background: "#f8fafc",
        paddingTop: 12,
        paddingBottom: 16,
        marginBottom: 20,
        borderBottom: "1px solid #e5e7eb",
    }}
    >
    <h1 style={{ margin: 0 }}>
        Dashboard admin
    </h1>

    <p style={{ color: "#64748b", marginTop: 6, marginBottom: 14 }}>
        Vue synthétique de l’utilisation de l’application.
    </p>

    <Link
        to="/"
        style={{
        display: "inline-block",
        textDecoration: "none",
        background: "#2563eb",
        color: "white",
        padding: "8px 12px",
        borderRadius: 12,
        fontWeight: 700,
        fontSize: 14,
        }}
    >
        ← Retour à l’application
    </Link>
    </div>

      <p style={{ color: "#64748b", marginTop: 0, marginBottom: 20 }}>
        Vue synthétique de l’utilisation de l’application.
      </p>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: 12,
          marginBottom: 20,
        }}
      >
        <div style={cardStyle}>
          <p style={{ margin: 0, color: "#64748b", fontSize: 13 }}>
            Total ouvertures
          </p>
          <strong style={{ fontSize: 28 }}>{totalOpenings}</strong>
        </div>

        <div style={cardStyle}>
          <p style={{ margin: 0, color: "#64748b", fontSize: 13 }}>
            Utilisateurs uniques
          </p>
          <strong style={{ fontSize: 28 }}>{uniqueUsers}</strong>
        </div>

        <div style={cardStyle}>
          <p style={{ margin: 0, color: "#64748b", fontSize: 13 }}>
            Top onglet
          </p>
          <strong style={{ fontSize: 22 }}>{topTab}</strong>
        </div>

        <div style={cardStyle}>
          <p style={{ margin: 0, color: "#64748b", fontSize: 13 }}>
            Dernière activité
          </p>
          <strong style={{ fontSize: 16 }}>
            {lastActivity
              ? new Date(lastActivity).toLocaleString("fr-FR")
              : "Aucune"}
          </strong>
        </div>
      </section>

      {stats.length > 0 && (
        <section style={{ ...cardStyle, marginBottom: 20 }}>
          <h2 style={{ fontSize: 18, marginTop: 0 }}>
            Répartition des ouvertures
          </h2>

          {stats.map((item) => {
            const percent = Math.round((item.total / maxTotal) * 100);

            return (
              <div key={`bar-${item.event_value}`} style={{ marginBottom: 14 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 13,
                    marginBottom: 6,
                  }}
                >
                  <span>{item.event_value}</span>
                  <strong>{item.total}</strong>
                </div>

                <div
                  style={{
                    height: 10,
                    background: "#e5e7eb",
                    borderRadius: 999,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${percent}%`,
                      height: "100%",
                      background: "#2563eb",
                      borderRadius: 999,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </section>
      )}

      {topUsers.length > 0 && (
        <section style={{ ...cardStyle, marginBottom: 20 }}>
          <h2 style={{ fontSize: 18, marginTop: 0 }}>
            Top 10 utilisateurs
          </h2>

          {topUsers
            .filter((user) => user.user_label.includes("@"))
            .slice(0, 10)
            .map((user) => (
              <div
                key={`user-${user.user_label}`}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 12,
                  padding: "10px 0",
                  borderTop: "1px solid #f1f5f9",
                }}
              >
                <span style={{ overflowWrap: "anywhere" }}>
                  {user.user_label}
                </span>
                <strong>{user.total}</strong>
              </div>
            ))}
        </section>
      )}

      {dailyStats.length > 0 && (
        <section style={{ ...cardStyle, marginBottom: 20 }}>
          <h2 style={{ fontSize: 18, marginTop: 0 }}>
            Ouvertures par jour
          </h2>

          {dailyStats.map((item) => (
            <div
              key={`daily-${item.day}`}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "10px 0",
                borderTop: "1px solid #f1f5f9",
              }}
            >
              <span>{new Date(item.day).toLocaleDateString("fr-FR")}</span>
              <strong>{item.total}</strong>
            </div>
          ))}
        </section>
      )}
    </main>
  );
}