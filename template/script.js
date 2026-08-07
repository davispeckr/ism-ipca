const RECORTES=[["cheio","Cheio"],["sem_alimentacao","Ex-alimentos"],["servicos","Serviços"],["bens","Bens"]];
const ARS=[[1,"AR(1)"],[3,"AR(3)"],[12,"AR(12)"]];
const KS=[[2,"2"],[3,"3"],[4,"4"]];
let sel={rec:"cheio",ar:1,k:3};
const $=id=>document.getElementById(id);
const S=()=>D.series[`${sel.rec}|${sel.ar}|${sel.k}`];
const pct=v=>(v*100).toFixed(1).replace(".",",")+"%";
const num=v=>v.toFixed(3).replace(".",",");
const MES=["jan","fev","mar","abr","mai","jun","jul","ago","set","out","nov","dez"];
const rot=s=>{const[a,m]=s.split("-");return MES[+m-1]+"/"+a};

function segs(el,opts,key){
  el.innerHTML="";
  opts.forEach(([v,l])=>{const b=document.createElement("button");
    b.textContent=l;b.setAttribute("aria-pressed",sel[key]==v);
    b.onclick=()=>{sel[key]=v;segs(el,opts,key);render()};el.appendChild(b)});
}

/* ---------- geometria ---------- */
const P={l:44,r:46,t:14,b:26};
let W=900,H1=300,H2=210;
function dims(){const m=innerWidth<680;W=m?430:900;H1=m?300:300;H2=m?200:210;
  P.l=m?34:44;P.r=m?36:46;}
function esc(i,w){return P.l+i*(w-P.l-P.r)/(D.datas.length-1)}
function escY(v,min,max,h){return P.t+(max-v)/(max-min)*(h-P.t-P.b)}

function area(vals,min,max,w,h,clip){ // clip: "up" | "down" | null
  let d="",open=false;
  const y0=escY(0,min,max,h);
  vals.forEach((v,i)=>{
    if(v==null){if(open){d+=`L${esc(i-1,w)},${y0}Z`;open=false}return}
    let y=escY(v,min,max,h);
    if(clip==="up")y=Math.min(y,y0); if(clip==="down")y=Math.max(y,y0);
    if(!open){d+=`M${esc(i,w)},${y0}L${esc(i,w)},${y}`;open=true}
    else d+=`L${esc(i,w)},${y}`;
  });
  if(open)d+=`L${esc(vals.length-1,w)},${y0}Z`;
  return d;
}
function linha(vals,min,max,w,h){
  let d="",pen=false;
  vals.forEach((v,i)=>{if(v==null){pen=false;return}
    d+=(pen?"L":"M")+esc(i,w)+","+escY(v,min,max,h);pen=true});
  return d;
}
function anos(w,h){
  let s="";
  D.datas.forEach((dt,i)=>{if(dt.endsWith("-01")&&+dt.slice(0,4)%2===0){
    s+=`<line class="grade" x1="${esc(i,w)}" y1="${P.t}" x2="${esc(i,w)}" y2="${h-P.b}"/>`+
       `<text class="eixo" x="${esc(i,w)}" y="${h-P.b+15}" text-anchor="middle">${dt.slice(0,4)}</text>`}});
  return s;
}

/* ---------- gráfico 1 ---------- */
function mediaHist(){const v=S().ism.filter(x=>x!=null);
  return v.reduce((a,b)=>a+b,0)/v.length}
function g1(){
  const w=W,h=H1,s=S(),ip=D.ipca;
  const lo=-.40,hi=.30, ipMax=13;
  let g=anos(w,h);
  [-.4,-.2,0,.2].forEach(v=>{const y=escY(v,lo,hi,h);
    g+=`<line class="${v===0?"zero":"grade"}" x1="${P.l}" y1="${y}" x2="${w-P.r}" y2="${y}"/>`+
       `<text class="eixo" x="${P.l-7}" y="${y+3}" text-anchor="end">${v.toFixed(1).replace(".",",")}</text>`});
  [0,4,8,12].forEach(v=>{const y=escY(v,0,ipMax,h);
    g+=`<text class="eixo" x="${w-P.r+7}" y="${y+3}">${v}%</text>`});
  g+=`<path d="${area(s.ism,lo,hi,w,h,"up")}" fill="var(--alta-t)"/>`;
  g+=`<path d="${area(s.ism,lo,hi,w,h,"down")}" fill="var(--baixa-t)"/>`;
  const yz=escY(0,lo,hi,h);
  g+=`<defs><clipPath id="cima"><rect x="0" y="0" width="${w}" height="${yz}"/></clipPath>`+
     `<clipPath id="baixo"><rect x="0" y="${yz}" width="${w}" height="${h-yz}"/></clipPath></defs>`;
  const pl=linha(s.ism,lo,hi,w,h);
  g+=`<path d="${pl}" fill="none" stroke="var(--alta)" stroke-width="1.3" clip-path="url(#cima)"/>`;
  g+=`<path d="${pl}" fill="none" stroke="var(--baixa)" stroke-width="1.3" clip-path="url(#baixo)"/>`;
  g+=`<path d="${linha(ip,0,ipMax,w,h)}" fill="none" stroke="var(--tinta)" stroke-width="1.9"/>`;
  const mh=mediaHist(),ym=escY(mh,lo,hi,h);
  g+=`<line x1="${P.l}" y1="${ym}" x2="${w-P.r}" y2="${ym}" stroke="var(--tinta-3)" stroke-width=".9" stroke-dasharray="5 4"/>`;
  const lbl=`média histórica ${mh.toFixed(2).replace(".",",")}`;
  g+=`<rect x="${P.l+3}" y="${ym-13}" width="${lbl.length*5.6+8}" height="13" fill="var(--papel)"/>`;
  g+=`<text class="eixo" x="${P.l+7}" y="${ym-3}">${lbl}</text>`;
  g+=`<line class="crosshair" id="ch1" x1="0" y1="${P.t}" x2="0" y2="${h-P.b}"/>`;
  g+=`<circle id="d1a" r="3.2" fill="var(--alta)" opacity="0"/><circle id="d1b" r="3.2" fill="var(--tinta)" opacity="0"/>`;
  g+=`<rect id="hit" x="${P.l}" y="0" width="${w-P.l-P.r}" height="${h}" fill="transparent" style="cursor:crosshair"/>`;
  $("g1").setAttribute("viewBox",`0 0 ${w} ${h}`);$("g1").innerHTML=g;
}
/* ---------- gráfico 2 ---------- */
function g2(){
  const w=W,h=H2,s=S(),lo=-.55,hi=.55;
  let g=anos(w,h);
  const y0=escY(0,lo,hi,h);
  g+=`<path d="${area(s.sp,lo,hi,w,h)}" fill="var(--alta)" opacity=".72"/>`;
  g+=`<path d="${area(s.sm.map(v=>v==null?null:-v),lo,hi,w,h)}" fill="var(--baixa)" opacity=".72"/>`;
  g+=`<line class="zero" x1="${P.l}" y1="${y0}" x2="${w-P.r}" y2="${y0}"/>`;
  [.5,.25,-.25,-.5].forEach(v=>{const y=escY(v,lo,hi,h);
    g+=`<text class="eixo" x="${P.l-7}" y="${y+3}" text-anchor="end">${Math.abs(v*100)}%</text>`});
  g+=`<line class="crosshair" id="ch2" x1="0" y1="${P.t}" x2="0" y2="${h-P.b}"/>`;
  $("g2").setAttribute("viewBox",`0 0 ${w} ${h}`);$("g2").innerHTML=g;
}

/* ---------- hero + hud ---------- */
function hero(i){
  const s=S(),sp=s.sp[i],sm=s.sm[i],ism=s.ism[i];
  $("ref").textContent=rot(D.datas[i])+" · IPCA "+D.ipca[i].toFixed(2).replace(".",",")+"% em 12m";
  $("fa").style.width=Math.min(sp/.55,1)*100+"%";
  $("fb").style.width=Math.min(sm/.55,1)*100+"%";
  $("vsp").textContent=pct(sp);$("vsm").textContent=pct(sm);
  $("vism").textContent=(ism>0?"+":"")+num(ism);
  const mh=mediaHist();
  const dir=ism<mh-.03?"mais inclinada para baixo do que o usual":
            ism>mh+.03?"mais inclinada para cima do que o usual":"em linha com o padrão histórico";
  $("frase").innerHTML=`Em ${rot(D.datas[i])}, <b>${pct(sm)}</b> da cesta do IPCA vinha registrando `+
    `${sel.k} meses seguidos de inflação abaixo do previsto pelo modelo, contra <b>${pct(sp)}</b> acima. `+
    `O índice líquido está em <b>${(ism>0?"+":"")+num(ism)}</b>, ${dir} de ${num(mh)}.`;
}
function hud(i){
  const s=S();
  $("hud1").innerHTML=`<span><b>${rot(D.datas[i])}</b></span>`+
    `<span>índice <b>${(s.ism[i]>0?"+":"")+num(s.ism[i])}</b></span>`+
    `<span class="a">alta <b class="a">${pct(s.sp[i])}</b></span>`+
    `<span class="b">baixa <b class="b">${pct(s.sm[i])}</b></span>`+
    `<span>IPCA <b>${D.ipca[i].toFixed(2).replace(".",",")}%</b></span>`;
}
function marcar(i,cross){
  const x=esc(i,W),s=S();
  ["ch1","ch2"].forEach(id=>{const e=$(id);if(e){e.setAttribute("x1",x);e.setAttribute("x2",x);
    e.style.opacity=cross?.75:0}});
  const a=$("d1a"),b=$("d1b");
  a.setAttribute("cx",x);a.setAttribute("cy",escY(s.ism[i],-.40,.30,H1));a.style.opacity=1;
  b.setAttribute("cx",x);b.setAttribute("cy",escY(D.ipca[i],0,13,H1));b.style.opacity=1;
  hud(i);hero(i);
}
function ligarHover(){
  const svg=$("g1"),hit=$("hit"),n=D.datas.length;
  const idx=ev=>{const r=svg.getBoundingClientRect();
    const x=(ev.clientX-r.left)/r.width*W;
    return Math.max(0,Math.min(n-1,Math.round((x-P.l)/(W-P.l-P.r)*(n-1))))};
  hit.addEventListener("mousemove",e=>marcar(idx(e),true));
  hit.addEventListener("touchmove",e=>{marcar(idx(e.touches[0]),true);e.preventDefault()},{passive:false});
  svg.addEventListener("mouseleave",()=>marcar(n-1,false));
}
function render(){dims();g1();g2();ligarHover();marcar(D.datas.length-1,false)}

$("dl").onclick=()=>{
  let csv="data,recorte,ar,k,S_alta,S_baixa,ISM,IPCA_12m\n";
  Object.keys(D.series).forEach(key=>{const[r,a,k]=key.split("|"),s=D.series[key];
    D.datas.forEach((d,i)=>{if(s.ism[i]==null)return;
      csv+=`${d},${r},${a},${k},${s.sp[i]},${s.sm[i]},${s.ism[i]},${D.ipca[i]??""}\n`})});
  const u=URL.createObjectURL(new Blob([csv],{type:"text/csv;charset=utf-8"}));
  const a=document.createElement("a");a.href=u;a.download="ism_ipca.csv";a.click();URL.revokeObjectURL(u);
};

segs($("cRec"),RECORTES,"rec");segs($("cAr"),ARS,"ar");segs($("cK"),KS,"k");
render();
let tmr;addEventListener("resize",()=>{clearTimeout(tmr);tmr=setTimeout(render,180)});
