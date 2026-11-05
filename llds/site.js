
const SB = "https://pbpaojgrjtolxwbdymad.supabase.co", KEY = "sb_publishable_SrD0r4I2I3O0J4pMAoPlYg_JwO969KZ", SLUG = "llds";
const q = async (view, extra = "") => { try { const r = await fetch(`${SB}/rest/v1/${view}?select=*${extra}`, { headers: { apikey: KEY } }); return r.ok ? await r.json() : []; } catch { return []; } };
const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const DAYS = ["Mandag","Tirsdag","Onsdag","Torsdag","Fredag","Lørdag","Søndag"]; const MON = ["jan","feb","mar","apr","maj","jun","jul","aug","sep","okt","nov","dec"];
const hm = (iso) => new Date(iso).toLocaleTimeString("da-DK", { hour: "2-digit", minute: "2-digit" });
const CAT = { mini: "Mini (3–6 år)", kids: "Børn", junior: "Junior", adult: "Voksen", mixed: "Junior & Voksen" };
(async () => {
  const [school] = await q("school", `&slug=eq.${SLUG}`); const sid = school?.id;
  if (school) { const s = school.settings || {}; document.querySelectorAll("[data-contact]").forEach((el) => { el.textContent = s[el.dataset.contact] || ""; }); }
  const f = sid ? `&school_id=eq.${sid}` : "";
  // teams by category
  const teams = await q("public_teams", f + "&order=sort");
  const tEl = document.getElementById("teams");
  if (teams.length) {
    const cats = ["mini", "kids", "junior", "adult", "mixed"].filter((c) => teams.some((t) => t.category === c));
    tEl.innerHTML = cats.map((c) => `<div class="cat"><h3>${CAT[c]}</h3><div class="grid">${teams.filter((t) => t.category === c).map((t) => `<div class="card"><h3>${esc(t.name)}</h3><div class="tiny">${esc(t.style || "")}${t.level ? " · " + esc(t.level) : ""}</div>${t.description ? `<p class="small muted">${esc(t.description)}</p>` : ""}<div>${t.closed ? '<span class="chip gold">Lukket hold – audition</span>' : '<span class="chip">Åbent for tilmelding</span>'}${t.punch_card_open ? '<span class="chip">Klippekort</span>' : ""}</div></div>`).join("")}</div></div>`).join("");
  } else tEl.innerHTML = '<p class="empty">Holdene for sæsonen er på vej.</p>';
  // timetable
  const sched = await q("public_schedule", f + "&order=starts_at");
  const sEl = document.getElementById("timetable");
  if (sched.length) {
    const byDay = {}; for (const s of sched) { const d = (new Date(s.starts_at).getDay() + 6) % 7; (byDay[d] ||= []).push(s); }
    sEl.innerHTML = Object.keys(byDay).sort().map((d) => `<div class="day"><h4>${DAYS[d]}</h4>${byDay[d].map((s) => `<div class="blk"><b>${esc(s.name)}</b><span>${hm(s.starts_at)}–${hm(s.ends_at)}${s.room ? " · " + esc(s.room) : ""}</span></div>`).join("")}</div>`).join("");
  } else sEl.innerHTML = '<p class="empty">Ugeskemaet offentliggøres, når sæsonplanen er lagt.</p>';
  // events
  const events = await q("public_events", f + "&order=starts_at");
  const eEl = document.getElementById("events");
  eEl.innerHTML = events.length ? events.map((e) => { const d = new Date(e.starts_at); return `<div class="card event"><div class="date">${d.getDate()}<small>${MON[d.getMonth()]}</small></div><div><h3>${esc(e.title)}</h3><div class="tiny">${{competition:"Konkurrence",show:"Show",workshop:"Workshop",social:"Socialt"}[e.kind] || ""}${e.place ? " · " + esc(e.place) : ""}${e.team_names?.length ? " · " + e.team_names.map(esc).join(", ") : ""}</div>${e.info ? `<p class="small muted">${esc(e.info)}</p>` : ""}</div></div>`; }).join("") : '<p class="empty">Ingen kommende events lige nu.</p>';
  // news
  const posts = await q("public_posts", f + "&order=created_at.desc&limit=4");
  const nEl = document.getElementById("news");
  nEl.innerHTML = posts.length ? posts.map((p) => { const d = new Date(p.created_at); return `<div class="post"><div class="tiny">${d.getDate()}. ${MON[d.getMonth()]} ${d.getFullYear()}${p.team_name ? " · " + esc(p.team_name) : ""}</div>${esc(p.body)}</div>`; }).join("") : '<p class="empty">Følg med her – nyheder fra studiet kommer løbende.</p>';
  // shop
  const products = await q("public_products", f + "&order=name");
  const pEl = document.getElementById("shop");
  pEl.innerHTML = products.length ? products.map((p) => `<div class="card product"><div class="img">${p.image_path ? `<img src="${SB}/storage/v1/object/public/public/${esc(p.image_path)}" alt="">` : esc(p.name[0])}</div><h3>${esc(p.name)}</h3><div class="price">${p.price_dkk} kr.</div>${p.sizes?.length ? `<div class="tiny">${p.sizes.map(esc).join(" · ")}</div>` : ""}</div>`).join("") : '<p class="empty">Merchandise kommer snart.</p>';
})();
