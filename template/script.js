let LANG="pt";
const I18N={
 pt:{
  standfirst:'A construção deste dashboard segue a metodologia proposta por <a href="https://www.frbsf.org/wp-content/uploads/wp2026-10.pdf" target="_blank" rel="noopener">Lansing e Shapiro (2026)</a>, adaptada ao Brasil.',
  comoler:'<b>Como ler.</b> O índice mede a difusão dos choques de inflação: a fração da cesta, ponderada pelo peso de cada subitem, cujos desvios em relação ao padrão estimado se acumulam na mesma direção. Um índice em elevação indica que a pressão inflacionária vem se espalhando pela cesta; um índice em queda indica que a inflação vem perdendo tração.',
  "lbl-serie":"Série exibida","lbl-formato":"Formato","lbl-bench":"Comparar com","lbl-ar":"Modelo AR","lbl-k":"k","lbl-mm":"média móvel 6m",
  "press-baixa":"Momentum negativo","press-alta":"Momentum positivo",
  "sm-lab":"S⁻ · da cesta","ismi-lab":"ISMI · S⁺ menos S⁻","sp-lab":"S⁺ · da cesta",
  "h-sobre":"Sobre o índice",
  "sobre-1":"Distinguir em tempo real choques transitórios de choques persistentes é um problema central da política monetária. O reconhecimento tardio de uma pressão persistente arrisca desancorar expectativas, enquanto a reação a um choque passageiro impõe custos desnecessários em produto e emprego. Disso surge a necessidade de analisar com profundidade a persistência e a difusão da inflação na economia.",
  "sobre-2":"Proposto por Lansing e Shapiro (2026), o Inflation Shock Momentum Index representa a diferença entre a fração da cesta em momentum positivo e a fração em momentum negativo de inflação. A ideia parte de um modelo que descreve o comportamento habitual da inflação de cada categoria. Em condições normais, o que esse modelo não prevê são apenas ruídos, que ora ficam acima, ora abaixo do esperado, sem direção definida. Quando esses desvios passam a se repetir sistematicamente para o mesmo lado, e isso ocorre em muitas categorias ao mesmo tempo, é sinal de que o ambiente inflacionário está mudando.",
  "h-interp":"Interpretação e limitações",
  "interp-1":"O índice deve ser lido pelo seu movimento, e não pelo seu nível absoluto. Um índice em elevação indica que os choques de inflação estão se tornando mais persistentes e difundidos pela cesta; um índice em queda indica o contrário. Por isso, ele capta mudanças no regime inflacionário, e não o nível da inflação em si: um aumento permanente do patamar de preços eleva o índice apenas durante a transição, e assim que a janela de estimação incorpora o novo regime como o novo normal, o índice retorna ao seu ponto de partida.",
  "h-metod":"Metodologia",
  "metod-1":"Para cada subitem <i>i</i>, estima-se por mínimos quadrados, em janela móvel de 120 meses, uma regressão autorregressiva com controles de sazonalidade:",
  "metod-2":'em que <span class="ktx" data-eq="\\pi_{i,t}"></span> é a variação mensal do subitem, <span class="ktx" data-eq="D_{m,t}"></span> são variáveis binárias de mês-calendário e <i>P</i> é a ordem do modelo. A surpresa de inflação é o resíduo do mês <span class="ktx" data-eq="t"></span> na regressão ajustada sobre a janela que o contém:',
  "metod-3":"Um subitem exibe momentum quando as últimas <i>k</i> surpresas têm o mesmo sinal:",
  "metod-4":'As frações da cesta sob momentum positivo e negativo agregam os sinais pelos pesos <span class="ktx" data-eq="\\omega_{i,t}"></span> de cada subitem no IPCA, e o índice é a diferença entre elas:',
  "metod-5":"Quando ativada, a média móvel suaviza o índice sobre os seis meses mais recentes:",
  "h-params":"Parâmetros do painel",
  "par-serie":"<b>Série exibida.</b> Alterna entre o índice líquido, o índice acompanhado dos componentes e os componentes isolados.",
  "par-formato":"<b>Formato.</b> Linha ou barras mensais.",
  "par-bench":"<b>Comparar com.</b> Linha de referência sobreposta ao índice, no eixo direito: o IPCA ou a Selic acumulados em doze meses, ou nenhuma. Serve para situar o índice frente à inflação corrente e à política monetária.",
  "par-ar":"<b>Modelo AR.</b> Ordem <i>P</i> da regressão de referência. Ordens maiores absorvem mais dinâmica de curto prazo e tendem a reduzir o número de sequências identificadas.",
  "par-k":"<b>k.</b> Número de surpresas consecutivas de mesmo sinal exigido para classificar um subitem. Valores menores ampliam a fração classificada e admitem mais ruído; valores maiores tornam o sinal mais estrito.",
  "par-mm":"<b>Média móvel 6m.</b> Suavização recomendada para leitura. O índice mensal é volátil e pode trocar de sinal por um ou dois meses sem significado econômico.",
  "h-dados":"Dados e encadeamento",
  "dados-1":"Subitens do IPCA em quatro estruturas de POF, unidas pelo código de sete dígitos do SNIPC. Subitens ausentes em uma estrutura recebem a variação do item que os contém, com peso zero, procedimento adotado pelo Banco Central (2018). A reconstrução do índice cheio a partir dos subitens reproduz a série oficial com erro médio de 0,007 p.p.",
  "h-saz":"Sazonalidade",
  "saz-1":"O artigo original usa dados de PCE dessazonalizados pelo BEA. A série dessazonalizada do IBGE cobre apenas parte da cesta, cerca de 12% em peso, restrita a subitens de alimentação, e substituí-la pelo dado bruto não altera o índice. As variáveis binárias mensais reduzem a amplitude sazonal residual do índice de 0,13 para 0,04.",
  "h-refs":"Referências",
  "btn-csv":"Baixar série completa (CSV)",
  "fonte":"Fonte dos dados: IBGE, SIDRA, tabelas 655, 656, 2938, 1419 e 7060.",
  rec:["IPCA cheio","Ex-alimentos","Serviços","Bens"],
  view:["Índice","Índice + componentes","Componentes"],
  bench:["IPCA 12m","Selic 12m","Nenhum"],
  fmt:["Linha","Barras"],
  figtit:{comp:"Índice e componentes S⁺ e S⁻",soComp:"Componentes S⁺ e S⁻",
          nada:"Índice de momentum",selic:"Índice e Selic em 12 meses",ipca:"Índice e IPCA em 12 meses"},
  em12:" em 12m"
 },
 en:{
  standfirst:'This dashboard follows the methodology proposed by <a href="https://www.frbsf.org/wp-content/uploads/wp2026-10.pdf" target="_blank" rel="noopener">Lansing and Shapiro (2026)</a>, adapted to Brazil.',
  comoler:'<b>How to read it.</b> The index measures the diffusion of inflation shocks: the share of the basket, weighted by each subitem, whose deviations from the estimated pattern accumulate in the same direction. A rising index indicates that inflationary pressure is spreading across the basket; a falling index indicates that inflation is losing traction.',
  "lbl-serie":"Series shown","lbl-formato":"Format","lbl-bench":"Compare with","lbl-ar":"AR model","lbl-k":"k","lbl-mm":"6m moving average",
  "press-baixa":"Negative momentum","press-alta":"Positive momentum",
  "sm-lab":"S⁻ · of basket","ismi-lab":"ISMI · S⁺ minus S⁻","sp-lab":"S⁺ · of basket",
  "h-sobre":"About the index",
  "sobre-1":"Telling transitory shocks from persistent ones in real time is a central problem in monetary policy. Recognizing persistent pressure too late risks unanchoring expectations, while reacting to a passing shock imposes needless costs on output and employment. This creates the need to examine, in depth, the persistence and diffusion of inflation across the economy.",
  "sobre-2":"Proposed by Lansing and Shapiro (2026), the Inflation Shock Momentum Index is the difference between the share of the basket in positive inflation momentum and the share in negative momentum. The idea starts from a model that describes the usual behavior of each category's inflation. Under normal conditions, what the model fails to predict is just noise, landing above or below expectation with no set direction. When these deviations begin to fall systematically on the same side, and do so across many categories at once, it signals that the inflation environment is shifting.",
  "h-interp":"Interpretation and limitations",
  "interp-1":"The index should be read by its movement, not by its absolute level. A rising index means inflation shocks are becoming more persistent and more widespread across the basket; a falling index means the opposite. It therefore captures shifts in the inflation regime rather than the level of inflation itself: a permanent rise in the price level raises the index only during the transition, and once the estimation window absorbs the new regime as the new normal, the index returns to its starting point.",
  "h-metod":"Methodology",
  "metod-1":"For each subitem (elementary price category) <i>i</i>, an autoregressive regression with seasonality controls is estimated by ordinary least squares over a 120-month rolling window:",
  "metod-2":'where <span class="ktx" data-eq="\\pi_{i,t}"></span> is the monthly variation of the subitem, <span class="ktx" data-eq="D_{m,t}"></span> are calendar-month dummies and <i>P</i> is the model order. The inflation surprise is the residual of month <span class="ktx" data-eq="t"></span> in the regression fitted over the window containing it:',
  "metod-3":"A subitem exhibits momentum when its last <i>k</i> surprises share the same sign:",
  "metod-4":'The shares of the basket under positive and negative momentum aggregate the signals by the weights <span class="ktx" data-eq="\\omega_{i,t}"></span> of each subitem in the IPCA, and the index is the difference between them:',
  "metod-5":"When enabled, the moving average smooths the index over the six most recent months:",
  "h-params":"Panel controls",
  "par-serie":"<b>Series shown.</b> Switches between the net index, the index with its components, and the components alone.",
  "par-formato":"<b>Format.</b> Monthly line or bars.",
  "par-bench":"<b>Compare with.</b> A reference line overlaid on the index, on the right axis: the IPCA or the Selic rate accumulated over twelve months, or none. It situates the index against current inflation and monetary policy.",
  "par-ar":"<b>AR model.</b> Order <i>P</i> of the reference regression. Higher orders absorb more short-run dynamics and tend to reduce the number of runs identified.",
  "par-k":"<b>k.</b> Number of consecutive same-signed surprises required to classify a subitem. Lower values widen the classified share and admit more noise; higher values make the signal stricter.",
  "par-mm":"<b>6m moving average.</b> Smoothing recommended for reading. The monthly index is volatile and may flip sign for a month or two without economic meaning.",
  "h-dados":"Data and chaining",
  "dados-1":"IPCA subitems across four POF weighting structures, joined by the seven-digit SNIPC code. Subitems absent from a structure inherit the variation of the item that contains them, with zero weight, following the Central Bank of Brazil (2018). Reconstructing the full index from the subitems reproduces the official series with a mean error of 0.007 pp.",
  "h-saz":"Seasonality",
  "saz-1":"The original paper uses PCE data seasonally adjusted by the BEA. The IBGE's adjusted series covers only part of the basket, about 12% by weight, restricted to food subitems, and replacing the raw data with it does not change the index. The monthly dummies reduce the residual seasonal amplitude of the index from 0.13 to 0.04.",
  "h-refs":"References",
  "btn-csv":"Download full series (CSV)",
  "fonte":"Data source: IBGE, SIDRA, tables 655, 656, 2938, 1419 and 7060.",
  rec:["Full IPCA","Ex-food","Services","Goods"],
  view:["Index","Index + components","Components"],
  bench:["IPCA 12m","Selic 12m","None"],
  fmt:["Line","Bars"],
  figtit:{comp:"Index and components S⁺ and S⁻",soComp:"Components S⁺ and S⁻",
          nada:"Momentum index",selic:"Index and Selic over 12 months",ipca:"Index and IPCA over 12 months"},
  em12:" 12m"
 }
};
const T=()=>I18N[LANG];
const ARS=[[1,"AR(1)"],[3,"AR(3)"],[12,"AR(12)"]];
const KS=[[2,"2"],[3,"3"],[4,"4"]];
const VIEWS=()=>[["indice",T().view[0]],["comp",T().view[1]],["soComp",T().view[2]]];
const BENCHES=()=>[["ipca",T().bench[0]],["selic",T().bench[1]],["nada",T().bench[2]]];
const FMTS=()=>[["linha",T().fmt[0]],["barras",T().fmt[1]]];
let sel={rec:"cheio",ar:1,k:3,view:"indice",fmt:"linha"}, MM=false, BENCH="ipca";
let W=1100,H1=400,P={l:52,r:60,t:16,b:28};
const $=id=>document.getElementById(id);
const S=()=>D.series[`${sel.rec}|${sel.ar}|${sel.k}`];
const pct=v=>(v*100).toFixed(1).replace(".",",")+"%";
const num=v=>v.toFixed(3).replace(".",",");
const MESES_PT=["jan","fev","mar","abr","mai","jun","jul","ago","set","out","nov","dez"];
const MESES_EN=["jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec"];
const rot=s=>{const[a,m]=s.split("-");return (LANG==="en"?MESES_EN:MESES_PT)[+m-1]+"/"+a};

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
  const ft=T().figtit;
  $("figtit").textContent=v!=="indice"?(v==="comp"?ft.comp:ft.soComp):
    (BENCH==="nada"?ft.nada:BENCH==="selic"?ft.selic:ft.ipca);
}

function hero(i){
  const s=S();
  const bd=BENCH==="selic"?D.selic:D.ipca, bl=BENCH==="selic"?"Selic":"IPCA";
  const vfmt=v=>LANG==="en"?v.toFixed(2):v.toFixed(2).replace(".",",");
  $("ref").textContent=rot(D.datas[i])+(BENCH==="nada"?"":" · "+bl+" "+vfmt(bd[i]??0)+"%"+T().em12);
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

function segs(el,src,key){
  el.innerHTML="";
  const opts=typeof src==="function"?src():src;
  opts.forEach(([v,l])=>{const b=document.createElement("button");
    b.textContent=l;b.setAttribute("aria-pressed",sel[key]==v);
    b.onclick=()=>{sel[key]=v;segs(el,src,key);render()};el.appendChild(b)});
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
  let csv="data,ar,k,S_positivo,S_negativo,ISMI,IPCA_12m,Selic_12m\n";
  Object.keys(D.series).forEach(key=>{const[r,a,k]=key.split("|"),s=D.series[key];
    if(r!=="cheio")return;
    D.datas.forEach((d,i)=>{if(s.ism[i]==null)return;
      csv+=`${d},${a},${k},${s.sp[i]},${s.sm[i]},${s.ism[i]},${D.ipca[i]??""},${D.selic[i]??""}\n`})});
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
  BENCHES().forEach(([v,l])=>{const b=document.createElement("button");
    b.textContent=l;b.setAttribute("aria-pressed",BENCH==v);
    b.onclick=()=>{BENCH=v;segsBench();render()};el.appendChild(b)});
}
function aplicarI18n(){
  document.documentElement.lang=LANG==="en"?"en":"pt-BR";
  document.querySelectorAll("[data-i18n]").forEach(el=>{
    const k=el.getAttribute("data-i18n"), val=T()[k];
    if(val!=null) el.innerHTML=val;
  });
  // redesenha controles e katex nos rotulos recem-inseridos
  segs($("cView"),VIEWS,"view");segs($("cFmt"),FMTS,"fmt");segsBench();
  segs($("cAr"),ARS,"ar");segs($("cK"),KS,"k");
  renderKatex();
  render();
}
function setLang(l){
  if(l===LANG)return;
  LANG=l;
  document.querySelectorAll(".lang").forEach(b=>b.classList.toggle("active",b.dataset.lang===l));
  aplicarI18n();
}
$("ptBtn").onclick=()=>setLang("pt");
$("enBtn").onclick=()=>setLang("en");

segs($("cView"),VIEWS,"view");segs($("cFmt"),FMTS,"fmt");segsBench();
segs($("cAr"),ARS,"ar");segs($("cK"),KS,"k");
initSlider();
aplicarI18n();
let tmr;addEventListener("resize",()=>{clearTimeout(tmr);tmr=setTimeout(render,180)});
