(function(){
const $=id=>document.getElementById(id);
const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const MES=['ene','feb','mar','abr','may','jun','jul','ago','set','oct','nov','dic'];
const MESL=['enero','febrero','marzo','abril','mayo','junio','julio','agosto','setiembre','octubre','noviembre','diciembre'];
const CAT={peru:'Perú',mundo:'Mundo',mercados:'Mercados'};
const fdate=s=>{const[y,m,d]=s.split('-').map(Number);return d+' '+MES[m-1]+' '+y};
const host=u=>{try{return new URL(u).hostname.replace('www.','')}catch(e){return ''}};
const hm=iso=>new Date(iso).toLocaleString('es-PE',{timeZone:'America/Lima',day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'});
const link=a=>'nota.html?id='+encodeURIComponent(a.id);
const page=document.body.dataset.page||'home';

function ph(m,c,t,eager){
  return `<div class="ph" data-c="${esc(c||'peru')}" data-t="${esc(t||'')}">${m?`<img src="${esc(m.u)}" alt="${esc(m.alt)}" loading="${eager?'eager':'lazy'}" decoding="async" onerror="this.remove()"><span class="cr" role="link" tabindex="0" data-href="${esc(m.link)}">${m.by==='Unsplash'?'Foto vía Unsplash':'Foto: '+esc(m.by)+' / Unsplash'}</span>`:''}</div>`;
}

/* ---------- charts (solo cifras publicadas en las notas) ---------- */
const T=(x,y,s,o)=>`<text x="${x}" y="${y}" font-family="Inter,sans-serif" font-size="${s}" ${o||''}>`;
const CH={
 bcrp:()=>`<svg viewBox="0 0 640 220" role="img" aria-label="Tasa de referencia del BCRP: 14 meses en 4,25 % y alza a 4,50 % en noviembre de 2026">
<line x1="40" y1="170" x2="620" y2="170" stroke="currentColor" stroke-opacity=".15"/><line x1="40" y1="70" x2="620" y2="70" stroke="currentColor" stroke-opacity=".15" stroke-dasharray="4 6"/>
<path d="M40 170 H420 V70 H620" fill="none" stroke="var(--red)" stroke-width="5" stroke-linejoin="round" pathLength="1" class="stepline"/><circle cx="420" cy="70" r="8" fill="var(--red)"/>
${T(40,30,20,'fill="currentColor" fill-opacity=".65"')}Tasa de referencia del BCRP</text>
${T(48,154,22,'font-weight="700" fill="currentColor"')}4,25 % · 14 meses sin cambios</text>
<text x="620" y="52" text-anchor="end" font-size="54" font-weight="700" fill="var(--red)" font-family="Newsreader,Georgia,serif">4,50 %</text>
${T(620,104,20,'text-anchor="end" fill="currentColor" fill-opacity=".65"')}nov 2026 · +25 pb</text></svg>`,
 infl:()=>`<svg viewBox="0 0 640 150" role="img" aria-label="Inflación de Lima 5,25 % frente al rango meta del BCRP de 1 % a 3 %">
${T(0,20,16,'fill="currentColor" fill-opacity=".65"')}Inflación anual de Lima vs. rango meta del BCRP</text>
<rect x="0" y="40" width="640" height="34" rx="6" fill="currentColor" fill-opacity=".06"/>
<rect class="bar" x="0" y="44" width="478" height="26" rx="5" fill="var(--red)"/>
<rect x="91" y="36" width="91" height="42" rx="3" fill="#2fb36a" fill-opacity=".45" stroke="#1f8a4c" stroke-width="2"/>
${T(490,64,22,'font-weight="700" fill="var(--red)"')}5,25 %</text>
${T(136,100,14,'text-anchor="middle" fill="currentColor" fill-opacity=".75"')}meta 1 %–3 %</text>
${[0,1,2,3,4,5,6,7].map(v=>T(v*91,135,13,`text-anchor="${v===0?'start':v===7?'end':'middle'}" fill="currentColor" fill-opacity=".5"`)+v+' %</text>').join('')}</svg>`,
 rates:()=>{const rows=[['BCRP (Perú)',4.5,null,'4,50 %'],['Fed (EE. UU.)',4,3.75,'3,75–4,00 %'],['BCE (depósito)',2.5,null,'2,50 %']];const W=420,X=170;
  return `<svg viewBox="0 0 640 200" role="img" aria-label="Tasas de política monetaria: BCRP 4,50 %, Fed 3,75 a 4,00 %, BCE 2,50 %">
${T(0,20,16,'fill="currentColor" fill-opacity=".65"')}Tasas de política monetaria, noviembre de 2026</text>
${rows.map((r,i)=>{const y=44+i*50,w=r[1]/5*W;return `${T(0,y+22,15,'font-weight="600" fill="currentColor"')}${r[0]}</text><rect x="${X}" y="${y}" width="${W}" height="30" rx="5" fill="currentColor" fill-opacity=".06"/><rect class="bar" x="${X}" y="${y}" width="${w}" height="30" rx="5" fill="${i===0?'var(--red)':'currentColor'}" fill-opacity="${i===0?1:.55}"/>${r[2]?`<rect x="${X+r[2]/5*W}" y="${y}" width="${w-r[2]/5*W}" height="30" fill="var(--bg)" fill-opacity=".45"/>`:''}${T(X+w+8,y+21,15,'font-weight="700" fill="currentColor"')}${r[3]}</text>`}).join('')}</svg>`},
 desempleo:()=>`<svg viewBox="0 0 640 170" role="img" aria-label="Desempleo en Lima: 5,7 % hace un año y 4,4 % en julio a setiembre de 2026">
${T(0,20,16,'fill="currentColor" fill-opacity=".65"')}Tasa de desempleo en Lima Metropolitana (jul–set)</text>
${T(0,66,15,'font-weight="600" fill="currentColor"')}2025</text><rect class="bar" x="70" y="44" width="${5.7/7*480}" height="32" rx="5" fill="currentColor" fill-opacity=".35"/>${T(70+5.7/7*480+8,66,16,'font-weight="700" fill="currentColor"')}5,7 %</text>
${T(0,120,15,'font-weight="600" fill="currentColor"')}2026</text><rect class="bar" x="70" y="98" width="${4.4/7*480}" height="32" rx="5" fill="var(--red)"/>${T(70+4.4/7*480+8,120,16,'font-weight="700" fill="var(--red)"')}4,4 % · mínimo histórico</text>
${T(0,160,12,'fill="currentColor" fill-opacity=".55"')}El dato de 2025 se obtiene de la caída de 1,3 puntos reportada por el INEI.</text></svg>`,
 expo:()=>{const p=31309/83785*100,w=p/100*640;return `<svg viewBox="0 0 640 130" role="img" aria-label="China compró el 37 % de las exportaciones peruanas de enero a setiembre de 2026">
${T(0,20,16,'fill="currentColor" fill-opacity=".65"')}Exportaciones peruanas ene–set 2026: US$ 83 785 millones</text>
<rect x="0" y="38" width="640" height="40" rx="6" fill="currentColor" fill-opacity=".12"/><rect class="bar" x="0" y="38" width="${w}" height="40" rx="6" fill="var(--red)"/>
${T(14,64,16,'font-weight="700" fill="#fff"')}China · ${p.toFixed(0)} %</text>${T(626,64,15,'text-anchor="end" font-weight="600" fill="currentColor"')}Resto del mundo</text>
${T(0,104,13,'fill="currentColor" fill-opacity=".6"')}China: US$ 31 309 millones (+31,3 %). Fuente: Mincetur.</text></svg>`}
};
const MINI={'bcrp-tasa':'bcrp','inflacion-oct':'infl','desempleo':'desempleo','exportaciones':'expo','bce':'rates','fed':'rates'};

/* ---------- shell ---------- */
const NAV=[['index.html','Portada','home'],['peru.html','Perú','peru'],['mundo.html','Mundo','mundo'],['mercados.html','Mercados','mercados'],['indicadores.html','Indicadores','indicadores'],['aprende.html','Aprende','aprende'],null,['consumidor.html','Especial: Consumidor','consumidor','special'],['nosotros.html','Nosotros','nosotros']];
function shell(D){
  const hdr=$('hdr');if(!hdr)return;
  const now=new Date();
  const tk=D.ticker.map(t=>`<a class="tk" href="${esc(t.src)}" target="_blank" rel="noopener"><b>${esc(t.k)}</b><span class="v">${esc(t.v)}</span><span class="${t.dir}">${t.dir==='up'?'▲':t.dir==='down'?'▼':'■'} ${esc(t.d)}</span><span class="meta">${esc(t.when)}</span></a>`).join('');
  const cur=page==='nota'?'':page;
  hdr.innerHTML=`<div class="status"><div class="wrap"><span>Lima · ${now.toLocaleDateString('es-PE',{timeZone:'America/Lima',weekday:'long',day:'numeric',month:'long',year:'numeric'})}</span><span class="live"><i></i>Actualizado ${esc(hm(D.updated))}</span></div></div>
<div class="ticker" aria-label="Indicadores del día"><div class="track">${tk}${tk}</div></div>
<header class="top"><div class="wrap"><div class="mast"><a class="logo" href="index.html"><strong>Pulso <i>Económico</i></strong><span>Economía peruana e internacional para estudiantes</span></a>
<div class="search"><input id="q" type="search" placeholder="Buscar: inflación, cobre, empleo…" aria-label="Buscar noticias" autocomplete="off"><div class="sres" id="sres" hidden></div></div></div>
<nav class="sec" aria-label="Secciones">${NAV.map(n=>n?`<a href="${n[0]}"${n[3]?' class="special"':''}${n[2]===cur?' aria-current="page"':''}>${n[1]}</a>`:'<span class="sep"></span>').join('')}</nav></div></header>`;
  const q=$('q'),sr=$('sres');
  q.addEventListener('input',()=>{const t=q.value.trim().toLowerCase();if(t.length<2){sr.hidden=true;return}
    const r=D.articles.filter(a=>(a.title+' '+a.dek+' '+a.tag+' '+a.body.join(' ')).toLowerCase().includes(t)).slice(0,6);
    sr.innerHTML=r.length?r.map(a=>`<a href="${link(a)}"><span class="meta">${CAT[a.cat]} · ${esc(a.tag)}</span><b>${esc(a.title)}</b></a>`).join(''):'<a href="aprende.html">Sin resultados. Prueba en el glosario →</a>';sr.hidden=false});
  document.addEventListener('click',e=>{if(!e.target.closest('.search'))sr.hidden=true});
  const f=$('ftr');if(f)f.innerHTML=`<footer><div class="wrap">
<div><strong>Pulso Económico</strong><p>Proyecto de estudiantes de Economía de la Universidad Científica del Sur. Resúmenes propios, con enlace a cada fuente consultada.</p></div>
<div><h4>Secciones</h4><ul><li><a href="peru.html">Perú</a></li><li><a href="mundo.html">Mundo</a></li><li><a href="mercados.html">Mercados</a></li><li><a href="indicadores.html">Indicadores</a></li></ul></div>
<div><h4>Para estudiar</h4><ul><li><a href="aprende.html">Glosario y guías</a></li><li><a href="consumidor.html">Especial: Consumidor e Indecopi</a></li><li><a href="reclama.html">Reclama con Derecho</a></li><li><a href="nosotros.html">Cómo trabajamos</a></li></ul></div>
<div><h4>Fuentes frecuentes</h4><ul><li><a href="https://www.bcrp.gob.pe">BCRP</a></li><li><a href="https://www.inei.gob.pe">INEI</a></li><li><a href="https://www.gob.pe/mef">MEF</a></li><li><a href="https://www.gob.pe/indecopi">Indecopi</a></li></ul></div>
<p class="fine">Los textos son resúmenes elaborados por el equipo a partir de las fuentes citadas. Para trabajos académicos o decisiones financieras, consulta siempre el documento original. Fotos: Unsplash, con crédito a cada autor.</p></div></footer>`;
}

/* ---------- blocks ---------- */
const card=a=>`<a class="card rv" href="${link(a)}">${ph(a.img,a.cat,a.tag)}<span class="tx"><span class="row"><span class="region">${CAT[a.cat]}</span><span class="meta">${fdate(a.date)}</span></span><h3>${esc(a.title)}</h3><p>${esc(a.dek)}</p><span class="go">Leer + ${a.sources.length} fuentes →</span></span></a>`;
const rowCard=a=>`<a class="row-card" href="${link(a)}"><span><span class="kick">${esc(a.tag)}</span><h3>${esc(a.title)}</h3><p>${esc(a.dek)}</p><span class="meta">${fdate(a.date)}</span></span>${ph(a.img,a.cat,a.tag)}</a>`;
const big=a=>`<a class="big rv" href="${link(a)}">${ph(a.img,a.cat,a.tag)}<span class="kick">${esc(a.tag)} · ${fdate(a.date)}</span><h3>${esc(a.title)}</h3><p>${esc(a.dek)}</p></a>`;
const byDate=(a,b)=>b.date.localeCompare(a.date);
function feat(list){if(!list.length)return '';const[f,...r]=list;return `<div class="feat">${big(f)}<div class="stack">${r.slice(0,3).map(rowCard).join('')}</div></div>`}
const ic=(t,x)=>`<a class="ic" href="${esc(t.src)}" target="_blank" rel="noopener"><span class="k">${esc(t.k)}</span><span class="v">${esc(t.v)}</span><span class="d ${t.dir}">${t.dir==='up'?'▲':t.dir==='down'?'▼':'■'} ${esc(t.d)}</span>${x?`<span class="x">${esc(x)}</span>`:''}<span class="s">${esc(t.when)} · ${esc(host(t.src))} ↗</span></a>`;
const EXPL={'Tasa BCRP':'Costo del dinero que fija el BCRP. Si sube, préstamos y tarjetas se encarecen.','Inflación Lima (12 m)':'Cuánto subieron los precios en Lima en un año. La meta del BCRP es de 1 % a 3 %.','PBI Perú':'Crecimiento de la producción del país frente al mismo mes del año anterior.','Desempleo Lima':'Parte de la fuerza laboral de Lima que busca trabajo y no lo encuentra.','Dólar':'Precio del dólar en soles. Si baja, el sol se aprecia.','Cobre':'Primer producto de exportación del Perú: su precio mueve los ingresos del país.','Oro':'Otro gran producto de exportación; funciona como refugio en épocas de incertidumbre.','Brent':'Precio internacional del petróleo: influye en combustibles, pasajes y fletes.','Fed':'Tasa de la Reserva Federal: mueve el dólar y los capitales en todo el mundo.'};

/* ---------- pages ---------- */
const P={};
P.home=(D,m)=>{
  const arts=[...D.articles].sort(byDate),L=D.articles.find(a=>a.lead)||arts[0];
  const rest=arts.filter(a=>a!==L);
  const sec=c=>rest.filter(a=>a.cat===c);
  const pg=D.pages||{};
  m.innerHTML=`<section class="hero3d"><div class="bgph">${ph(D.hero||L.img,'peru','',true)}</div><canvas id="globe" aria-hidden="true"></canvas><div class="wrap in">
<a class="eyebrow" href="consumidor.html"><b>Nuevo</b>Especial Consumidor: prueba el simulador del Indecopi →</a>
<p class="kick" style="margin-top:26px">${esc(L.tag)} · ${fdate(L.date)} · Nota principal</p><h1>${esc(L.title)}</h1><p class="dek">${esc(L.dek)}</p>
<div class="row"><a class="pill" href="${link(L)}">Leer la nota →</a><a class="pill ghost" href="indicadores.html">Ver indicadores</a></div>
<div class="legend"><span><i></i>Lima</span><span><i></i>Washington · Fed</span><span><i></i>Fráncfort · BCE</span><span><i></i>Shanghái · China</span></div></div></section>
<div class="wrap"><div class="latest">${rest.slice(0,4).map(a=>`<a href="${link(a)}">${ph(a.img,a.cat,'')}<span><span class="meta">${CAT[a.cat]} · ${fdate(a.date)}</span><h3>${esc(a.title)}</h3></span></a>`).join('')}</div></div>
<section class="band"><div class="wrap"><div class="sh"><div><p class="kick">Datos clave</p><h2>Indicadores del día</h2></div><a class="more" href="indicadores.html">Ver gráficos y explicación →</a></div>
<div class="ind five">${D.ticker.slice(0,5).map(t=>ic(t)).join('')}</div></div></section>
<section class="band"><div class="wrap"><div class="sh"><div><p class="kick">Economía nacional</p><h2>Perú</h2></div><a class="more" href="peru.html">Todas las noticias de Perú →</a></div>${feat(sec('peru'))}</div></section>
<section class="band alt"><div class="wrap"><a class="spx rv" href="consumidor.html"><div class="tx"><span class="badge"><i></i>Demo en vivo</span><p class="kick">Especial · Protección al consumidor</p><h2>¿Te fallaron? Reclama con el simulador del Indecopi</h2><p>Banca, turismo, autos y el Libro de Reclamaciones: tus derechos, casos reales sancionados y un simulador que calcula tu plazo de 15 días hábiles y te escribe el reclamo.</p><span class="pill" style="margin-top:6px">Abrir el especial →</span></div>
<div class="mosaic">${ph(pg.banca,'consumo','Banca')}${ph(pg.turismo,'consumo','Turismo')}${ph(pg.autos,'consumo','Autos')}${ph(pg.libro,'consumo','Libro de Reclamaciones')}</div></a></div></section>
<section class="band"><div class="wrap"><div class="sh"><div><p class="kick">Economía internacional</p><h2>Mundo</h2></div><a class="more" href="mundo.html">Todas las noticias del mundo →</a></div>${feat(sec('mundo'))}</div></section>
<section class="band"><div class="wrap"><div class="sh"><div><p class="kick">Dólar, metales y bolsas</p><h2>Mercados</h2></div><a class="more" href="mercados.html">Ver mercados →</a></div><div class="grid">${sec('mercados').slice(0,3).map(card).join('')}</div></div></section>
<section class="band alt"><div class="wrap learn">${ph(pg.aprende,'peru','Aprende')}<div class="rv"><p class="kick">Aprende</p><h2 style="font-size:clamp(28px,3vw,40px);margin:8px 0 10px">Entiende las noticias en una línea</h2><p style="color:var(--soft);font-size:17px">Glosario, guías para leer los reportes del BCRP y el INEI, y dónde encontrar datos oficiales para tus trabajos.</p>
<div class="terms">${Object.entries(D.glossary).slice(0,10).map(([k,g])=>`<a href="aprende.html#g-${k}">${esc(g[0])}</a>`).join('')}</div><a class="btn" href="aprende.html">Ir a Aprende →</a></div></div></section>`;
};
function section(c,title,sub){return (D,m)=>{
  const list=D.articles.filter(a=>a.cat===c).sort(byDate);
  const tags=[...new Set(list.map(a=>a.tag))];
  const others=D.articles.filter(a=>a.cat!==c).sort(byDate).slice(0,3);
  m.innerHTML=`<section class="banner">${ph((D.pages||{})[c],c,'',true)}<div class="wrap in"><p class="kick">Sección</p><h1>${title}</h1><p class="sub">${sub}</p></div></section>
<section class="band"><div class="wrap">${feat(list)}</div></section>
<section class="band alt"><div class="wrap"><div class="sh"><div><p class="kick">${list.length} notas</p><h2>Todas las noticias de ${title}</h2></div></div>
<div class="tags" id="tags"><button type="button" class="tag" data-t="" aria-pressed="true">Todo</button>${tags.map(t=>`<button type="button" class="tag" data-t="${esc(t)}" aria-pressed="false">${esc(t)}</button>`).join('')}</div><div class="grid" id="feed"></div></div></section>
<section class="band"><div class="wrap"><div class="sh"><div><p class="kick">Sigue leyendo</p><h2>En otras secciones</h2></div></div><div class="grid">${others.map(card).join('')}</div></div></section>`;
  const draw=t=>{$('feed').innerHTML=list.filter(a=>!t||a.tag===t).map(card).join('')||'<p class="empty">Sin notas en este tema.</p>';reveal()};
  $('tags').addEventListener('click',e=>{const b=e.target.closest('[data-t]');if(!b)return;document.querySelectorAll('#tags .tag').forEach(x=>x.setAttribute('aria-pressed',x===b));draw(b.dataset.t)});
  draw('');
}}
P.peru=section('peru','Perú','Política monetaria, precios, producción, empleo y comercio exterior del Perú, explicados para estudiantes.');
P.mundo=section('mundo','Mundo','Bancos centrales, grandes economías y materias primas: lo que pasa afuera y por qué nos afecta.');
P.mercados=section('mercados','Mercados','Tipo de cambio, metales y cotizaciones: los precios que mueven la economía peruana.');
P.nota=(D,m)=>{
  const id=new URLSearchParams(location.search).get('id')||location.hash.slice(1);
  const a=D.articles.find(x=>x.id===id);
  if(!a){m.innerHTML=`<section class="band"><div class="wrap"><h1>No encontramos esa nota</h1><p style="margin:12px 0 20px;color:var(--soft)">Puede que haya sido retirada en la última actualización.</p><a class="btn" href="index.html">Volver a la portada</a></div></section>`;return}
  document.title=a.title+' · Pulso Económico';
  const rel=D.articles.filter(x=>x!==a&&x.cat===a.cat).sort(byDate).concat(D.articles.filter(x=>x!==a&&x.cat!==a.cat).sort(byDate)).slice(0,3);
  const g=a.concepts.filter(c=>D.glossary[c]).map(c=>`<button type="button" class="chip" data-def="${c}" aria-pressed="false">${esc(D.glossary[c][0])}</button>`).join('');
  const sec={peru:'peru.html',mundo:'mundo.html',mercados:'mercados.html'}[a.cat];
  m.innerHTML=`<article><div class="wrap art-head"><p class="crumbs"><a href="index.html">Portada</a> / <a href="${sec}">${CAT[a.cat]}</a> / ${esc(a.tag)}</p>
<p class="kick">${esc(a.tag)}</p><h1>${esc(a.title)}</h1><p class="dek">${esc(a.dek)}</p>
<div class="byline"><span>Redacción Pulso Económico</span><span>·</span><span>${fdate(a.date)}</span><span>·</span><span>${Math.max(1,Math.round(a.body.join(' ').split(' ').length/200))} min de lectura</span></div>
<figure class="art-ph" style="margin:26px 0 0">${ph(a.img,a.cat,a.tag,true)}${a.img?`<figcaption>${esc(a.img.alt)}. Imagen ilustrativa.</figcaption>`:''}</figure></div>
<div class="wrap art"><div><div class="body">${a.body.map(p=>`<p>${esc(p)}</p>`).join('')}</div>${MINI[a.id]?`<div class="mini">${CH[MINI[a.id]]()}</div>`:''}<div class="why"><b>¿Por qué importa?</b>${esc(a.why)}</div>
<div class="tools"><button class="btn ghost" type="button" id="cite">Copiar cita para tu trabajo</button><button class="btn ghost" type="button" id="share">Copiar enlace</button></div></div>
<aside class="side"><div class="box"><h3>Datos clave</h3><table class="dtab"><tbody>${a.data.map(r=>`<tr><td>${esc(r[0])}</td><td>${esc(r[1])}</td></tr>`).join('')}</tbody></table></div>
${g?`<div class="box"><h3>Conceptos</h3><div class="chips">${g}</div><p class="def" id="def">Toca un concepto para ver su definición.</p></div>`:''}
<div class="box"><h3>Fuentes consultadas</h3><ul class="srcs">${a.sources.map(s=>`<li><a href="${esc(s.u)}" target="_blank" rel="noopener">${esc(s.n)}<span>${esc(host(s.u))} ↗</span></a></li>`).join('')}</ul></div></aside></div></article>
<section class="band alt"><div class="wrap"><div class="sh"><div><p class="kick">Sigue leyendo</p><h2>Notas relacionadas</h2></div></div><div class="grid">${rel.map(card).join('')}</div></div></section>`;
  m.querySelectorAll('[data-def]').forEach(b=>b.onclick=()=>{m.querySelectorAll('[data-def]').forEach(x=>x.setAttribute('aria-pressed',x===b));const d=D.glossary[b.dataset.def];$('def').innerHTML='<b style="color:var(--ink)">'+esc(d[0])+':</b> '+esc(d[1])});
  $('cite').onclick=async e=>{const s=a.sources[0];const[y,mo,d]=a.date.split('-').map(Number);const txt=`${s.n}. (${y}, ${d} de ${MESL[mo-1]}). ${a.title}. ${s.u}`;try{await navigator.clipboard.writeText(txt);e.target.textContent='Cita copiada'}catch(err){e.target.textContent=txt}};
  $('share').onclick=async e=>{try{await navigator.clipboard.writeText(location.href);e.target.textContent='Enlace copiado'}catch(err){e.target.textContent='Copia la dirección del navegador'}};
};
P.indicadores=(D,m)=>{
  m.innerHTML=`<section class="banner">${ph((D.pages||{}).indicadores,'mercados','',true)}<div class="wrap in"><p class="kick">Datos</p><h1>Indicadores</h1><p class="sub">Las cifras que mueven la economía peruana, con su explicación y el enlace a la fuente oficial o al medio que la reportó.</p></div></section>
<section class="band"><div class="wrap"><div class="sh"><div><p class="kick">${D.ticker.length} indicadores</p><h2>El tablero</h2></div><p>Haz clic en cualquier indicador para verificarlo en su fuente.</p></div><div class="ind">${D.ticker.map(t=>ic(t,EXPL[t.k])).join('')}</div></div></section>
<section class="band alt"><div class="wrap"><div class="sh"><div><p class="kick">Gráficos</p><h2>Cuatro gráficos para entender el momento</h2></div></div><div class="charts">
<div class="chart rv"><h3>El BCRP rompe la pausa</h3><p class="meta">Tasa de referencia</p>${CH.bcrp()}<div class="cap"><span>Primera alza desde enero de 2023</span><a href="nota.html?id=bcrp-tasa">Leer la nota →</a></div></div>
<div class="chart rv"><h3>La inflación, lejos de la meta</h3><p class="meta">Lima, últimos 12 meses a octubre</p>${CH.infl()}<div class="cap"><span>Fuente: INEI</span><a href="nota.html?id=inflacion-oct">Leer la nota →</a></div></div>
<div class="chart rv"><h3>Tres bancos centrales</h3><p class="meta">Perú, EE. UU. y la eurozona</p>${CH.rates()}<div class="cap"><span>Fuentes: BCRP, Fed y BCE</span><a href="nota.html?id=bce">Leer la nota del BCE →</a></div></div>
<div class="chart rv"><h3>Desempleo en mínimo histórico</h3><p class="meta">Lima Metropolitana</p>${CH.desempleo()}<div class="cap"><span>Fuente: INEI vía Gestión</span><a href="nota.html?id=desempleo">Leer la nota →</a></div></div>
</div></div></section>`;
};
P.aprende=(D,m)=>{
  const gl=$('gl');
  const draw=t=>{const r=Object.entries(D.glossary).filter(([k,g])=>!t||(g[0]+' '+g[1]).toLowerCase().includes(t));gl.innerHTML=r.map(([k,g])=>`<details id="g-${k}"><summary>${esc(g[0])}</summary><p>${esc(g[1])}</p></details>`).join('')||'<p class="empty">Sin términos con esa palabra.</p>'};
  draw('');$('glq').addEventListener('input',e=>draw(e.target.value.trim().toLowerCase()));
  const h=location.hash.slice(1);if(h){const d=$(h);if(d){d.open=true;setTimeout(()=>d.scrollIntoView(),60)}}
};
P.nosotros=()=>{const c=$('clock');if(!c)return;const h=Number(new Date().toLocaleString('en-US',{timeZone:'America/Lima',hour:'numeric',hour12:false}))%24;
  c.innerHTML=[0,6,12,18].map(x=>`<div class="slot${h>=x&&h<x+6?' on':''}"><b>${String(x).padStart(2,'0')}:00</b><span class="meta">${h>=x&&h<x+6?'bloque actual':'revisión'}</span></div>`).join('')};
P.consumidor=()=>{const f=$('sim');if(!f)return;const fit=()=>{try{const h=f.contentDocument.documentElement.scrollHeight;if(h>200)f.style.height=h+'px'}catch(e){}};f.addEventListener('load',()=>{fit();setTimeout(fit,400)});window.addEventListener('resize',()=>setTimeout(fit,200))};

/* ---------- photo slots in static pages ---------- */
function slots(D){document.querySelectorAll('[data-ph]').forEach(el=>{const k=el.dataset.ph;const m=(D.pages||{})[k]||(D.articles.find(a=>a.id===k)||{}).img;el.outerHTML=ph(m,el.dataset.c||'consumo',el.dataset.t||'',el.hasAttribute('data-eager'))})}

let io=null;
function reveal(){const els=document.querySelectorAll('.rv:not(.in)');if(!('IntersectionObserver' in window)){els.forEach(e=>e.classList.add('in'));return}
  io=io||new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{rootMargin:'0px 0px -40px 0px'});els.forEach(e=>io.observe(e))}

function credits(){const go=e=>{const c=e.target.closest('.cr[data-href]');if(!c)return;if(e.type==='keydown'&&e.key!=='Enter')return;e.preventDefault();e.stopPropagation();window.open(c.dataset.href,'_blank','noopener')};document.addEventListener('click',go,true);document.addEventListener('keydown',go,true)}
function globe(){const c=$('globe');if(!c||!c.getContext)return;const x=c.getContext('2d');let W,H,R,dpr;
 const size=()=>{dpr=Math.min(2,window.devicePixelRatio||1);W=c.clientWidth*dpr;H=c.clientHeight*dpr;c.width=W;c.height=H;R=Math.min(W,H)*.42};size();window.addEventListener('resize',size);
 const rad=Math.PI/180,v=(la,lo)=>[Math.cos(la*rad)*Math.sin(lo*rad),Math.sin(la*rad),Math.cos(la*rad)*Math.cos(lo*rad)];
 const pts=[];for(let la=-75;la<=75;la+=15)for(let lo=-180;lo<180;lo+=4)pts.push(v(la,lo));for(let lo=-180;lo<180;lo+=20)for(let la=-84;la<=84;la+=4)pts.push(v(la,lo));
 const C={lima:[-12.05,-77.04],was:[38.9,-77.04],fra:[50.11,8.68],sha:[31.23,121.47]};const P0=v(...C.lima);
 const arc=(b)=>{const B=v(...b),d=Math.acos(Math.max(-1,Math.min(1,P0[0]*B[0]+P0[1]*B[1]+P0[2]*B[2]))),o=[];for(let i=0;i<=64;i++){const t=i/64,s=Math.sin(d),k1=Math.sin((1-t)*d)/s,k2=Math.sin(t*d)/s,h=1+.22*Math.sin(Math.PI*t)*Math.min(1,d);o.push([(k1*P0[0]+k2*B[0])*h,(k1*P0[1]+k2*B[1])*h,(k1*P0[2]+k2*B[2])*h])}return o};
 const arcs=[arc(C.was),arc(C.fra),arc(C.sha)];const tilt=18*rad;
 const pr=(p,a)=>{const X=p[0]*Math.cos(a)+p[2]*Math.sin(a),Z=-p[0]*Math.sin(a)+p[2]*Math.cos(a),Y=p[1]*Math.cos(tilt)-Z*Math.sin(tilt),Z2=p[1]*Math.sin(tilt)+Z*Math.cos(tilt);return[W/2+X*R,H/2-Y*R,Z2]};
 const draw=t=>{x.clearRect(0,0,W,H);const a=(77+38*Math.sin(t*.00012))*rad;
  const g=x.createRadialGradient(W/2-R*.3,H/2-R*.35,R*.1,W/2,H/2,R*1.15);g.addColorStop(0,'rgba(120,140,255,.10)');g.addColorStop(1,'rgba(120,140,255,0)');x.fillStyle=g;x.beginPath();x.arc(W/2,H/2,R*1.15,0,7);x.fill();
  x.strokeStyle='rgba(160,175,255,.18)';x.lineWidth=dpr;x.beginPath();x.arc(W/2,H/2,R,0,7);x.stroke();
  for(const p of pts){const q=pr(p,a);if(q[2]<0)continue;x.fillStyle=`rgba(200,210,255,${.08+.5*q[2]})`;x.fillRect(q[0],q[1],1.4*dpr,1.4*dpr)}
  arcs.forEach((A,i)=>{const prog=((t/2600)+i*.33)%1;let prev=null;for(let k=0;k<A.length;k++){const q=pr(A[k],a);if(prev){x.strokeStyle=`rgba(${i?'143,166,255':'255,90,103'},${q[2]>0?.55:.08})`;x.lineWidth=1.4*dpr;x.beginPath();x.moveTo(prev[0],prev[1]);x.lineTo(q[0],q[1]);x.stroke()}prev=q}
   const h=pr(A[Math.floor(prog*(A.length-1))],a);if(h[2]>0){x.fillStyle='#fff';x.shadowColor='#8FA6FF';x.shadowBlur=12*dpr;x.beginPath();x.arc(h[0],h[1],2.6*dpr,0,7);x.fill();x.shadowBlur=0}});
  Object.entries(C).forEach(([k,c2])=>{const q=pr(v(...c2),a);if(q[2]<0)return;const lima=k==='lima';x.fillStyle=lima?'#FF5A67':'#8FA6FF';x.shadowColor=x.fillStyle;x.shadowBlur=16*dpr;x.beginPath();x.arc(q[0],q[1],(lima?5:3.5)*dpr,0,7);x.fill();x.shadowBlur=0;
   if(lima){const r=(t/18%40)*dpr;x.strokeStyle=`rgba(255,90,103,${1-r/(40*dpr)})`;x.beginPath();x.arc(q[0],q[1],6*dpr+r,0,7);x.stroke()}})};
 const still=matchMedia('(prefers-reduced-motion: reduce)').matches;let on=true,raf=0;
 const loop=t=>{draw(t);if(on&&!still)raf=requestAnimationFrame(loop)};
 if('IntersectionObserver' in window)new IntersectionObserver(e=>{on=e[0].isIntersecting;cancelAnimationFrame(raf);if(on)raf=requestAnimationFrame(loop)}).observe(c);
 document.addEventListener('visibilitychange',()=>{cancelAnimationFrame(raf);if(!document.hidden&&on)raf=requestAnimationFrame(loop)});
 raf=requestAnimationFrame(loop)}
function tilt(){if(!matchMedia('(pointer:fine)').matches||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
 document.addEventListener('pointermove',e=>{const c=e.target.closest&&e.target.closest('.card,.spx,.sector');document.querySelectorAll('[data-tilt]').forEach(el=>{if(el!==c){el.style.transform='';el.removeAttribute('data-tilt')}});if(!c)return;const r=c.getBoundingClientRect(),px=(e.clientX-r.left)/r.width-.5,py=(e.clientY-r.top)/r.height-.5;c.setAttribute('data-tilt','');c.style.transform=`perspective(900px) rotateX(${(-py*4).toFixed(2)}deg) rotateY(${(px*5).toFixed(2)}deg) translateY(-2px)`},{passive:true})}
function start(D){credits();shell(D);slots(D);const m=$('main');(P[page]||(()=>{}))(D,m);reveal();globe();tilt()}
const seed=window.PULSO;
fetch('data/news.json',{cache:'no-store'}).then(r=>{if(!r.ok)throw 0;return r.json()}).then(d=>start(seed&&seed.updated>d.updated?seed:d)).catch(()=>{if(seed)start(seed)});
})();
