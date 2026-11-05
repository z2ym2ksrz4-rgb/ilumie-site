
const SB="https://pbpaojgrjtolxwbdymad.supabase.co",KEY="sb_publishable_SrD0r4I2I3O0J4pMAoPlYg_JwO969KZ",SLUG="llds",BASE="/llds";
const q=async(v,x="")=>{try{const r=await fetch(`${SB}/rest/v1/${v}?select=*${x}`,{headers:{apikey:KEY}});return r.ok?await r.json():[]}catch{return[]}};
const esc=s=>String(s??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const MON=["jan","feb","mar","apr","maj","jun","jul","aug","sep","okt","nov","dec"];
const hm=iso=>new Date(iso).toLocaleTimeString("da-DK",{hour:"2-digit",minute:"2-digit"});
const artFor=s=>{let h=0;for(const c of s)h=(h*31+c.charCodeAt(0))>>>0;return `${BASE}/art/${[1,3,4,5][h%4]}.jpg`};
// header + menu
const hd=document.querySelector("header.top");const onS=()=>hd.classList.toggle("solid",scrollY>40);onS();addEventListener("scroll",onS,{passive:true});
document.querySelectorAll(".burger").forEach(b=>b.addEventListener("click",()=>document.body.classList.toggle("navopen")));
addEventListener("keydown",e=>{if(e.key==="Escape")document.body.classList.remove("navopen")});
// reveal
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target)}}),{rootMargin:"0px 0px -8% 0px"});document.querySelectorAll(".rv").forEach((el,i)=>{el.style.transitionDelay=(i%4)*60+"ms";io.observe(el)});
// hero parallax
const hb=document.querySelector(".hero .bg");if(hb&&matchMedia("(prefers-reduced-motion:no-preference)").matches)addEventListener("scroll",()=>{hb.style.translate=`0 ${scrollY*.18}px`},{passive:true});
// video
document.querySelectorAll(".vid").forEach(v=>v.addEventListener("click",()=>{const m=v.querySelector("video");v.classList.add("play");m.muted=false;m.play()}));
// holdplan: day bar + age filter
document.querySelectorAll(".bar button[data-day]").forEach(b=>b.addEventListener("click",()=>{document.querySelectorAll(".bar button[data-day]").forEach(x=>x.classList.toggle("on",x===b));document.querySelectorAll(".day").forEach(d=>d.classList.toggle("on",d.dataset.day===b.dataset.day))}));
const applyAge=a=>{document.querySelectorAll("[data-ages]").forEach(el=>el.classList.toggle("hid",a!=="all"&&!el.dataset.ages.split(" ").includes(a)));document.querySelectorAll(".chips button[data-age]").forEach(x=>x.classList.toggle("on",x.dataset.age===a))};
document.querySelectorAll(".plan .chips button[data-age]").forEach(b=>b.addEventListener("click",()=>applyAge(b.dataset.age)));
// find dit hold (forside)
const fd=document.getElementById("finder-cards");if(fd){const T=JSON.parse(document.getElementById("teams-data").textContent);const render=a=>{const l=T.filter(t=>a==="all"||t.ages.includes(a)).slice(0,8);fd.innerHTML=l.map(t=>`<a class="tcard" href="${BASE}/${t.slug}/">${t.img?`<img src="${t.img}" alt="" loading="lazy">`:`<div class="ph" style="background-image:url(${artFor(t.slug)})"></div>`}${t.closed?'<span class="closed">Lukket hold</span>':""}<div class="in"><div class="t">${esc(t.style)}</div><h4>${esc(t.title)}</h4><div class="m">${esc(t.years||"")}${t.level?" · "+esc(t.level):""}</div></div></a>`).join("")};render("all");document.querySelectorAll("#finder .chips button").forEach(b=>b.addEventListener("click",()=>{document.querySelectorAll("#finder .chips button").forEach(x=>x.classList.toggle("on",x===b));render(b.dataset.age)}))}
// sticky cta
if(document.querySelector(".stickycta a"))document.body.classList.add("hasstk");
// live data
(async()=>{const[school]=await q("school",`&slug=eq.${SLUG}`);const f=school?`&school_id=eq.${school.id}`:"";
const eEl=document.getElementById("events");if(eEl){const ev=await q("public_events",f+"&order=starts_at");eEl.innerHTML=ev.length?ev.map(e=>{const d=new Date(e.starts_at);return`<div class="card event" style="background-image:url(${artFor(e.title)})"><div class="date">${d.getDate()}<small>${MON[d.getMonth()]}</small></div><div><h3>${esc(e.title)}</h3><div class="tiny">${{competition:"Konkurrence",show:"Show",workshop:"Workshop",social:"Socialt"}[e.kind]||""}${e.place?" · "+esc(e.place):""}${e.price_dkk?" · "+e.price_dkk+" kr.":""}</div>${e.info?`<p class="small muted">${esc(e.info)}</p>`:""}</div></div>`}).join(""):'<p class="empty">Ingen kommende events lige nu – julebal, workshops og shows annonceres her.</p>'}
const nEl=document.getElementById("news");if(nEl){const ps=await q("public_posts",f+"&order=created_at.desc&limit=3");if(ps.length)nEl.innerHTML=ps.map(p=>{const d=new Date(p.created_at);return`<div class="post"><div class="tiny">${d.getDate()}. ${MON[d.getMonth()]} ${d.getFullYear()}</div>${esc(p.body)}</div>`}).join("");else nEl.closest("section")?.remove()}
const pEl=document.getElementById("live-products");if(pEl){const pr=await q("public_products",f+"&order=name");if(pr.length)pEl.innerHTML=`<div class="eyebrow">I appen lige nu</div><div class="prods">${pr.map((p,i)=>`<div class="prod" data-i="${i+1}"><h4>${esc(p.name)}</h4>${p.sizes?.length?`<div class="tiny">${p.sizes.map(esc).join(" · ")}</div>`:""}<div class="price">${p.price_dkk} kr.</div></div>`).join("")}</div>`}
const sEl=document.getElementById("live-note");if(sEl){const sc=await q("public_schedule",f+"&order=starts_at");if(sc.length)sEl.innerHTML=`<div class="card"><div class="eyebrow">Denne uge – live fra appen</div>${sc.map(s=>`<div class="small"><span style="color:var(--gold2)">${hm(s.starts_at)}–${hm(s.ends_at)}</span> ${esc(s.name)}${s.room?` <span class="tiny">· ${esc(s.room)}</span>`:""}</div>`).join("")}<p class="tiny" style="margin:8px 0 0">Aflysninger og vikarer vises i appen.</p></div>`}
})();
