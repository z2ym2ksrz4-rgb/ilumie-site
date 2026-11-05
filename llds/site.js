
const SB = "https://pbpaojgrjtolxwbdymad.supabase.co", KEY = "sb_publishable_SrD0r4I2I3O0J4pMAoPlYg_JwO969KZ", SLUG = "llds", BASE = "/llds";
const q = async (view, extra = "") => { try { const r = await fetch(`${SB}/rest/v1/${view}?select=*${extra}`, { headers: { apikey: KEY } }); return r.ok ? await r.json() : []; } catch { return []; } };
const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const MON = ["jan","feb","mar","apr","maj","jun","jul","aug","sep","okt","nov","dec"];
const hm = (iso) => new Date(iso).toLocaleTimeString("da-DK", { hour: "2-digit", minute: "2-digit" });
document.querySelector(".burger")?.addEventListener("click", () => document.querySelector("nav").classList.toggle("open"));
document.querySelectorAll(".daytabs button").forEach((b) => b.addEventListener("click", () => { document.querySelectorAll(".daytabs button").forEach((x) => x.classList.toggle("on", x === b)); document.querySelectorAll(".day").forEach((d) => d.classList.toggle("on", d.dataset.day === b.dataset.day)); }));
(async () => {
  const [school] = await q("school", `&slug=eq.${SLUG}`); const f = school ? `&school_id=eq.${school.id}` : "";
  const eEl = document.getElementById("events");
  if (eEl) { const events = await q("public_events", f + "&order=starts_at");
    eEl.innerHTML = events.length ? events.map((e) => { const d = new Date(e.starts_at); return `<div class="card event"><div class="date">${d.getDate()}<small>${MON[d.getMonth()]}</small></div><div><h3>${esc(e.title)}</h3><div class="tiny">${{competition:"Konkurrence",show:"Show",workshop:"Workshop",social:"Socialt"}[e.kind] || ""}${e.place ? " · " + esc(e.place) : ""}${e.price_dkk ? " · " + e.price_dkk + " kr." : ""}</div>${e.info ? `<p class="small muted">${esc(e.info)}</p>` : ""}</div></div>`; }).join("") : '<p class="empty">Ingen kommende events lige nu – følg med her.</p>'; }
  const nEl = document.getElementById("news");
  if (nEl) { const posts = await q("public_posts", f + "&order=created_at.desc&limit=3");
    nEl.innerHTML = posts.length ? posts.map((p) => { const d = new Date(p.created_at); return `<div class="post"><div class="tiny">${d.getDate()}. ${MON[d.getMonth()]} ${d.getFullYear()}</div>${esc(p.body)}</div>`; }).join("") : ""; if (!posts.length) nEl.closest("section")?.remove(); }
  const pEl = document.getElementById("live-products");
  if (pEl) { const products = await q("public_products", f + "&order=name"); if (products.length) pEl.innerHTML = `<h2>I appen lige nu</h2><div class="grid">${products.map((p) => `<div class="card"><h3>${esc(p.name)}</h3><div class="price">${p.price_dkk} kr.</div>${p.sizes?.length ? `<div class="tiny">${p.sizes.map(esc).join(" · ")}</div>` : ""}</div>`).join("")}</div>`; }
  const sEl = document.getElementById("live-note");
  if (sEl) { const sched = await q("public_schedule", f + "&order=starts_at"); if (sched.length) sEl.innerHTML = `<div class="card"><div class="eyebrow">Denne uge</div>${sched.map((s) => `<div class="small"><span class="price">${hm(s.starts_at)}–${hm(s.ends_at)}</span> ${esc(s.name)}${s.room ? ` <span class="tiny">· ${esc(s.room)}</span>` : ""}</div>`).join("")}<p class="tiny" style="margin:8px 0 0">Aflysninger og vikarer vises i appen.</p></div>`; }
})();
