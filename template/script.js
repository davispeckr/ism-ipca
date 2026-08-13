const RECORTES=[["cheio","IPCA cheio"],["sem_alimentacao","Ex-alimentos"],["servicos","Serviços"],["bens","Bens"]];
const ARS=[[1,"AR(1)"],[3,"AR(3)"],[12,"AR(12)"]];
const KS=[[2,"2"],[3,"3"],[4,"4"]];
const VIEWS=[["indice","Índice"],["comp","Índice + componentes"],["soComp","Componentes"]];
const BENCHES=[["ipca","IPCA 12m"],["selic","Selic 12m"],["nada","Nenhum"]];
const FMTS=[["linha","Linha"],["barras","Barras"]];
let sel={rec:"cheio",ar:1,k:3,view:"indice",fmt:"linha"}, MM=false, BENCH="ipca";
let W=1100,H1=400,P={l:52,r:60,t:16,b:28};
const $=id=>document.getElementById(id);
const S=()=>D.series[`${sel.rec}|${sel.ar}|${sel.k}`];
const pct=v=>(v*100).toFixed(1).replace(".",",")+"%";
const num=v=>v.toFixed(3).replace(".",",");
const MESES=["jan","fev","mar","abr","mai","jun","jul","ago","set","out","nov","dez"];
const rot=s=>{const[a,m]=s.split("-");return MESES[+m-1]+"/"+a};

let R={a:0,b:D.datas.length-1};

function mm6(arr){
  const out=arr.map(()=>null);
  for(let i=0;i<arr.length;i++){let s=0,n=0;
    for(let j=Math.max(0,i-5);j<=i;j++){if(arr[j]!=null){s+=arr[j];n++}}
    if(n>=4)out[i]=s/n}
  return out;
}
const sIsm=()=>MM?mm6(S().ism):S().ism;
const sSp=()=>MM?mm6(S().sp):S().sp;
const sSm=()=>MM?mm6(S().sm):S().sm;
function mediaHist(){const v=S().ism.filter(x=>x!=null);return v.reduce((a,b)=>a+b,0)/v.length}
function dominio(arrs,pad){
  let lo=Infinity,hi=-Infinity;
  arrs.forEach(vals=>{for(let i=R.a;i<=R.b;i++){const v=vals[i];
    if(v!=null){lo=Math.min(lo,v);hi=Math.max(hi,v)}}});
  if(!isFinite(lo))return[0,1];
  const m=(hi-lo)*pad||.1; return[lo-m,hi+m];
}
function ticks(lo,hi,alvos){
  const passos=[.02,.05,.1,.2,.5,1,2,4,5];
  const passo=passos.find(p=>(hi-lo)/p<=alvos)||10;
  const t=[]; for(let v=Math.ceil(lo/passo)*passo;v<=hi+1e-9;v+=passo)t.push(+v.toFixed(4));
  return t;
}
const esc=(i,w)=>P.l+(i-R.a)*(w-P.l-P.r)/Math.max(R.b-R.a,1);
const escY=(v,lo,hi,h)=>P.t+(hi-v)/(hi-lo)*(h-P.t-P.b);

function linha(vals,lo,hi,w,h){
  let d="",pen=false;
  for(let i=R.a;i<=R.b;i++){const v=vals[i];
    if(v==null){pen=false;continue}
    d+=(pen?"L":"M")+esc(i,w).toFixed(1)+","+escY(v,lo,hi,h).toFixed(1);pen=true}
  return d;
}
function areaSigno(vals,lo,hi,w,h,clip){
  let d="",open=false; const y0=escY(0,lo,hi,h);
  for(let i=R.a;i<=R.b;i++){let v=vals[i];
    if(v==null){if(open){d+=`L${esc(i-1,w)},${y0}Z`;open=false}continue}
    let y=escY(v,lo,hi,h);
    if(clip==="up")y=Math.min(y,y0); if(clip==="down")y=Math.max(y,y0);
    if(!open){d+=`M${esc(i,w)},${y0}L${esc(i,w)},${y}`;open=true}else d+=`L${esc(i,w)},${y}`}
  if(open)d+=`L${esc(R.b,w)},${y0}Z`;
  return d;
}
function barras(vals,lo,hi,w,h,corFn,op){
  const y0=escY(0,lo,hi,h), bw=Math.max(1,(w-P.l-P.r)/(R.b-R.a+1)*.72);
  let s="";
  for(let i=R.a;i<=R.b;i++){const v=vals[i]; if(v==null)continue;
    const y=escY(v,lo,hi,h);
    s+=`<rect x="${(esc(i,w)-bw/2).toFixed(1)}" y="${Math.min(y,y0).toFixed(1)}" width="${bw.toFixed(1)}" `+
       `height="${Math.max(Math.abs(y-y0),.5).toFixed(1)}" fill="${corFn(v)}" opacity="${op||1}"/>`}
  return s;
}
function eixoX(w,h){
  const nA=+D.datas[R.b].slice(0,4)-+D.datas[R.a].slice(0,4)+1;
  const passo=Math.max(1,Math.ceil(nA/(W<700?5:9)));
  let s="";
  for(let i=R.a;i<=R.b;i++){const d=D.datas[i];
    if(d.endsWith("-01")&&(+d.slice(0,4))%passo===0){
      s+=`<line x1="${esc(i,w)}" y1="${h-P.b}" x2="${esc(i,w)}" y2="${h-P.b+4}" stroke="#9CA1A7"/>`+
         `<text class="eixo" x="${esc(i,w)}" y="${h-P.b+17}" text-anchor="middle">${d.slice(0,4)}</text>`}}
  return s;
}
const endLabel=(x,y,txt,cor)=>`<text class="endlab" x="${x}" y="${y}" fill="${cor}">${txt}</text>`;
const ultimoValido=a=>{let i=R.b;while(i>R.a&&a[i]==null)i--;return i};

let dom1={lo:-.4,hi:.3,ilo:0,ihi:13};
function desenhar(){
  const w=W,h=H1,ism=sIsm(),sp=sSp(),sm=sSm(),v=sel.view;
  const bench=(v==="indice"&&BENCH!=="nada")?(BENCH==="selic"?D.selic:D.ipca):null;
  const benchLbl=BENCH==="selic"?"Selic 12m":"IPCA 12m";
  const benchCor="var(--ink)";
  const comIpca=bench!=null;
  // dominio do eixo esquerdo por visao
  let lo,hi;
  if(v==="indice"){[lo,hi]=dominio([ism],.15);lo=Math.min(lo,-.02);hi=Math.max(hi,.02)}
  else if(v==="comp"){[lo,hi]=dominio([ism,sp,sm],.12);lo=Math.min(lo,-.02)}
  else{const[,m]=dominio([sp,sm],.12);hi=m;lo=-m}
  let ilo=0,ihi=13;
  if(comIpca){[ilo,ihi]=dominio([bench],.1);ilo=Math.min(0,ilo);ihi=Math.max(ihi,4)}
  dom1={lo,hi,ilo,ihi};
  let g=eixoX(w,h);
  ticks(lo,hi,5).forEach(t=>{const y=escY(t,lo,hi,h);
    const lbl=v==="soComp"?Math.round(Math.abs(t)*100)+"%":t.toFixed(1).replace(".",",");
    g+=`<line class="${Math.abs(t)<1e-9?"zero":"grade"}" x1="${P.l}" y1="${y}" x2="${w-P.r}" y2="${y}"/>`+
       `<text class="eixo" x="${P.l-8}" y="${y+4}" text-anchor="end">${lbl}</text>`});
  if(comIpca)ticks(ilo,ihi,5).forEach(t=>{const y=escY(t,ilo,ihi,h);
    g+=`<text class="eixo" x="${w-P.r+10}" y="${y+4}">${t}%</text>`});
  // media historica (visoes com indice)
  const mh=mediaHist();
  if(v!=="soComp"&&mh>lo&&mh<hi){const ym=escY(mh,lo,hi,h);
    g+=`<line x1="${P.l}" y1="${ym}" x2="${w-P.r}" y2="${ym}" stroke="#9CA1A7" stroke-width="1" stroke-dasharray="5 4"/>`+
       `<text class="eixo b" x="${P.l-8}" y="${ym+4}" text-anchor="end" fill="#6E7278">média</text>`}
  const corSigno=x=>x>=0?"var(--alta)":"var(--baixa)";
  const corBarra=x=>x>=0?"var(--alta)":"#B6C4D6";
  if(v==="indice"){
    if(sel.fmt==="barras"){g+=barras(ism,lo,hi,w,h,corBarra,1)}
    else{
      g+=`<path d="${areaSigno(ism,lo,hi,w,h,"up")}" fill="var(--alta-t)"/>`;
      g+=`<path d="${areaSigno(ism,lo,hi,w,h,"down")}" fill="var(--baixa-t)"/>`;
      const yz=escY(0,lo,hi,h),pl=linha(ism,lo,hi,w,h);
      g+=`<defs><clipPath id="cU"><rect x="0" y="0" width="${w}" height="${yz}"/></clipPath>`+
         `<clipPath id="cD"><rect x="0" y="${yz}" width="${w}" height="${h-yz}"/></clipPath></defs>`;
      g+=`<path d="${pl}" fill="none" stroke="var(--alta)" stroke-width="1.6" clip-path="url(#cU)"/>`;
      g+=`<path d="${pl}" fill="none" stroke="var(--baixa)" stroke-width="1.6" clip-path="url(#cD)"/>`;
    }
    const li=ultimoValido(ism);
    g+=endLabel(esc(li,w)-40,escY(ism[li],lo,hi,h)-10,"ISMI",corSigno(ism[li]));
  }else if(v==="comp"){
    if(sel.fmt==="barras")g+=barras(ism,lo,hi,w,h,corBarra,.85);
    g+=`<path d="${linha(sp,lo,hi,w,h)}" fill="none" stroke="var(--alta)" stroke-width="1.3" opacity=".85"/>`;
    g+=`<path d="${linha(sm,lo,hi,w,h)}" fill="none" stroke="var(--baixa)" stroke-width="1.3" opacity=".85"/>`;
    if(sel.fmt!=="barras")g+=`<path d="${linha(ism,lo,hi,w,h)}" fill="none" stroke="var(--ink)" stroke-width="2.1"/>`;
    const l1=ultimoValido(sp);
    g+=endLabel(esc(l1,w)-24,escY(sp[l1],lo,hi,h)-9,"S⁺","var(--alta)");
    g+=endLabel(esc(l1,w)-24,escY(sm[l1],lo,hi,h)+16,"S⁻","var(--baixa)");
    if(sel.fmt!=="barras")g+=endLabel(esc(l1,w)-46,escY(ism[l1],lo,hi,h)+16,"ISMI","var(--ink)");
  }else{ // soComp espelhado
    const smNeg=sm.map(x=>x==null?null:-x);
    if(sel.fmt==="barras"){
      g+=barras(sp,lo,hi,w,h,()=>"var(--alta)",1);
      g+=barras(smNeg,lo,hi,w,h,()=>"#B6C4D6",1);
    }else{
      g+=`<path d="${areaSigno(sp,lo,hi,w,h)}" fill="var(--alta)" opacity=".78"/>`;
      g+=`<path d="${areaSigno(smNeg,lo,hi,w,h)}" fill="var(--baixa)" opacity=".78"/>`;
    }
    g+=`<line class="zero" x1="${P.l}" y1="${escY(0,lo,hi,h)}" x2="${w-P.r}" y2="${escY(0,lo,hi,h)}"/>`;
    const l1=ultimoValido(sp);
    g+=endLabel(esc(l1,w)-24,escY(sp[l1],lo,hi,h)-9,"S⁺","var(--alta)");
    g+=endLabel(esc(l1,w)-24,escY(smNeg[l1],lo,hi,h)+16,"S⁻","var(--baixa)");
  }
  if(comIpca){
    g+=`<path d="${linha(bench,ilo,ihi,w,h)}" fill="none" stroke="${benchCor}" stroke-width="2"/>`;
    const pi=ultimoValido(bench);
    g+=endLabel(esc(pi,w)-62,escY(bench[pi],ilo,ihi,h)-11,benchLbl,benchCor);
  }
  g+=`<line class="crosshair" id="ch1" x1="0" y1="${P.t}" x2="0" y2="${h-P.b}"/>`;
  g+=`<circle id="d1a" r="3.4" opacity="0"/><circle id="d1b" r="3.4" fill="var(--ink)" opacity="0"/>`;
  g+=`<rect id="hit" x="${P.l}" y="0" width="${w-P.l-P.r}" height="${h}" fill="transparent" style="cursor:crosshair"/>`;
  $("g1").setAttribute("viewBox",`0 0 ${w} ${h}`); $("g1").innerHTML=g;
  $("figtit").textContent=v!=="indice"?(v==="comp"?"Índice e componentes S⁺ e S⁻":"Componentes S⁺ e S⁻"):
    (BENCH==="nada"?"Índice de momentum":BENCH==="selic"?"Índice e Selic em 12 meses":"Índice e IPCA em 12 meses");
}

function hero(i){
  const s=S();
  const bd=BENCH==="selic"?D.selic:D.ipca, bl=BENCH==="selic"?"Selic":"IPCA";
  $("ref").textContent=rot(D.datas[i])+(BENCH==="nada"?"":" · "+bl+" "+(bd[i]??0).toFixed(2).replace(".",",")+"% em 12m");
  $("fa").style.width=Math.min(s.sp[i]/.55,1)*100+"%";
  $("fb").style.width=Math.min(s.sm[i]/.55,1)*100+"%";
  $("vsp").textContent=pct(s.sp[i]); $("vsm").textContent=pct(s.sm[i]);
  $("vism").textContent=(s.ism[i]>0?"+":"")+num(s.ism[i]);
}
function hud(i){
  const s=S(),v=sIsm()[i];
  $("hud1").innerHTML=`<span><b>${rot(D.datas[i])}</b></span>`+
    `<span>ISMI <b>${v==null?"—":(v>0?"+":"")+num(v)}</b>${MM?" <i style='font-style:normal;font-size:10px'>(mm6)</i>":""}</span>`+
    `<span class="a">S⁺ <b class="a">${pct(s.sp[i])}</b></span>`+
    `<span class="b2">S⁻ <b class="b2">${pct(s.sm[i])}</b></span>`+
    (BENCH==="nada"?"":`<span>${BENCH==="selic"?"Selic":"IPCA"} <b>${((BENCH==="selic"?D.selic:D.ipca)[i]??0).toFixed(2).replace(".",",")}%</b></span>`);
}
function marcar(i,cross){
  i=Math.max(R.a,Math.min(R.b,i));
  const x=esc(i,W),ism=sIsm();
  const e=$("ch1");if(e){e.setAttribute("x1",x);e.setAttribute("x2",x);e.style.opacity=cross?.7:0}
  const a=$("d1a"),b=$("d1b");
  if(sel.view==="indice"&&sel.fmt==="linha"&&ism[i]!=null){
    a.setAttribute("cx",x);a.setAttribute("cy",escY(ism[i],dom1.lo,dom1.hi,H1));
    a.setAttribute("fill",ism[i]>=0?"var(--alta)":"var(--baixa)");a.style.opacity=1}
  else a.style.opacity=0;
  if(sel.view==="indice"&&BENCH!=="nada"){const bd=BENCH==="selic"?D.selic:D.ipca;
    if(bd[i]!=null){b.setAttribute("cx",x);b.setAttribute("cy",escY(bd[i],dom1.ilo,dom1.ihi,H1));b.style.opacity=1}else b.style.opacity=0}
  else b.style.opacity=0;
  hud(i);hero(i);
}
function ligarHover(){
  const svg=$("g1"),hit=$("hit");
  const idx=ev=>{const r=svg.getBoundingClientRect();
    const x=(ev.clientX-r.left)/r.width*W;
    return Math.round(R.a+(x-P.l)/(W-P.l-P.r)*(R.b-R.a))};
  hit.addEventListener("mousemove",e=>marcar(idx(e),true));
  hit.addEventListener("touchmove",e=>{marcar(idx(e.touches[0]),true);e.preventDefault()},{passive:false});
  svg.addEventListener("mouseleave",()=>marcar(R.b,false));
}
function dims(){const m=innerWidth<700;W=m?430:1100;H1=m?310:400;P.l=m?40:52;P.r=m?52:60}
function render(){dims();desenhar();ligarHover();marcar(R.b,false)}

function segs(el,opts,key){
  el.innerHTML="";
  opts.forEach(([v,l])=>{const b=document.createElement("button");
    b.textContent=l;b.setAttribute("aria-pressed",sel[key]==v);
    b.onclick=()=>{sel[key]=v;segs(el,opts,key);render()};el.appendChild(b)});
}
function initSlider(){
  const rA=$("rA"),rB=$("rB"),N=D.datas.length-1,GAP=11; // minimo 12 meses visiveis
  rA.max=rB.max=N; rA.value=0; rB.value=N;
  const upd=()=>{
    let a=Math.min(+rA.value,+rB.value), b=Math.max(+rA.value,+rB.value);
    if(b-a<GAP){ if(a+GAP<=N)b=a+GAP; else a=b-GAP; }
    $("y0").textContent=rot(D.datas[a]);$("y1").textContent=rot(D.datas[b]);
    const pc=x=>x/N*100;
    $("fillr").style.left=pc(a)+"%";$("fillr").style.width=(pc(b)-pc(a))+"%";
    R={a,b};
    render();
  };
  rA.addEventListener("input",upd);rB.addEventListener("input",upd);upd();
}
$("tMM").addEventListener("change",e=>{MM=e.target.checked;render()});
$("dl").onclick=()=>{
  let csv="data,recorte,ar,k,S_alta,S_baixa,ISMI,IPCA_12m\n";
  Object.keys(D.series).forEach(key=>{const[r,a,k]=key.split("|"),s=D.series[key];
    D.datas.forEach((d,i)=>{if(s.ism[i]==null)return;
      csv+=`${d},${r},${a},${k},${s.sp[i]},${s.sm[i]},${s.ism[i]},${D.ipca[i]??""}\n`})});
  const u=URL.createObjectURL(new Blob([csv],{type:"text/csv;charset=utf-8"}));
  const a=document.createElement("a");a.href=u;a.download="ismi_ipca.csv";a.click();URL.revokeObjectURL(u);
};
function renderKatex(){
  if(!window.katex){setTimeout(renderKatex,120);return}
  document.querySelectorAll(".eqrow").forEach(el=>{
    katex.render(el.dataset.eq,el,{displayMode:true,throwOnError:false})});
  document.querySelectorAll(".ktx").forEach(el=>{
    katex.render(el.dataset.eq,el,{displayMode:false,throwOnError:false})});
}
function segsBench(){
  const el=$("cBench");el.innerHTML="";
  BENCHES.forEach(([v,l])=>{const b=document.createElement("button");
    b.textContent=l;b.setAttribute("aria-pressed",BENCH==v);
    b.onclick=()=>{BENCH=v;segsBench();render()};el.appendChild(b)});
}
segs($("cView"),VIEWS,"view");segs($("cFmt"),FMTS,"fmt");segsBench();
segs($("cRec"),RECORTES,"rec");segs($("cAr"),ARS,"ar");segs($("cK"),KS,"k");
initSlider();renderKatex();
let tmr;addEventListener("resize",()=>{clearTimeout(tmr);tmr=setTimeout(render,180)});
