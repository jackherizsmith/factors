import{a as H,t as F}from"../chunks/disclose-version.E5vchNxS.js";import{i as me}from"../chunks/legacy.MpQzMlru.js";import{b as pe,h as C,a as ge,Q as be,$ as ve,H as Ae,r as te,s as q,c as B,f as O,a1 as P,d as ce,e as _e,p as Ee,I as ne,a2 as le,a3 as Ne,_ as xe,a4 as ye,g as Ce,G as Ie,F as ke,X as Te,M as Me,O as Se,a5 as Z,a6 as j,a7 as we,a8 as ie,a9 as de,aa as De,ab as Ge,V as Re,ac as He,ad as Oe,ae as Fe,o as Le,af as Ve,i as $e,k as Ye,v as N,ag as $,D as Y,B as G,ah as Pe,C as k,A as X,ai as K}from"../chunks/runtime.ircB1Sam.js";import{a as qe,l as Be,e as Xe,s as Q}from"../chunks/render.C6UGIoEt.js";import{i as Ke}from"../chunks/if.DG9Ch95I.js";import{o as Qe}from"../chunks/index-client.Cu24wggL.js";function U(e,r){return r}function Ue(e,r,a,i){for(var t=[],o=r.length,c=0;c<o;c++)Ne(r[c].e,t,!0);var A=o>0&&t.length===0&&a!==null;if(A){var b=a.parentNode;xe(b),b.append(a),i.clear(),T(e,r[0].prev,r[o-1].next)}ye(t,()=>{for(var I=0;I<o;I++){var m=r[I];A||(i.delete(m.k),T(e,m.prev,m.next)),Ce(m.e,!A)}})}function z(e,r,a,i,t,o=null){var c=e,A={flags:r,items:new Map,first:null},b=(r&de)!==0;if(b){var I=e;c=C?q(Ie(I)):I.appendChild(ke())}C&&ge();var m=null,E=!1;pe(()=>{var x=a(),l=be(x)?x:x==null?[]:ve(x),v=l.length;if(E&&v===0)return;E=v===0;let d=!1;if(C){var M=c.data===Ae;M!==(v===0)&&(c=te(),q(c),B(!1),d=!0)}if(C){for(var f=null,_,u=0;u<v;u++){if(O.nodeType===8&&O.data===Te){c=O,d=!0,B(!1);break}var h=l[u],s=i(h,u);_=he(O,A,f,null,h,s,u,t,r),A.items.set(s,_),f=_}v>0&&q(te())}if(!C){var n=Me;ze(l,A,c,t,r,(n.f&P)!==0,i)}o!==null&&(v===0?m?ce(m):m=_e(()=>o(c)):m!==null&&Ee(m,()=>{m=null})),d&&B(!0),a()}),C&&(c=O)}function ze(e,r,a,i,t,o,c,A){var V,ee,re,ae;var b=(t&De)!==0,I=(t&(Z|j))!==0,m=e.length,E=r.items,x=r.first,l=x,v,d=null,M,f=[],_=[],u,h,s,n;if(b)for(n=0;n<m;n+=1)u=e[n],h=c(u,n),s=E.get(h),s!==void 0&&((V=s.a)==null||V.measure(),(M??(M=new Set)).add(s));for(n=0;n<m;n+=1){if(u=e[n],h=c(u,n),s=E.get(h),s===void 0){var y=l?l.e.nodes_start:a;d=he(y,r,d,d===null?r.first:d.next,u,h,n,i,t),E.set(h,d),f=[],_=[],l=d.next;continue}if(I&&Je(s,u,n,t),s.e.f&P&&(ce(s.e),b&&((ee=s.a)==null||ee.unfix(),(M??(M=new Set)).delete(s))),s!==l){if(v!==void 0&&v.has(s)){if(f.length<_.length){var p=_[0],g;d=p.prev;var L=f[0],w=f[f.length-1];for(g=0;g<f.length;g+=1)fe(f[g],p,a);for(g=0;g<_.length;g+=1)v.delete(_[g]);T(r,L.prev,w.next),T(r,d,L),T(r,w,p),l=p,d=w,n-=1,f=[],_=[]}else v.delete(s),fe(s,l,a),T(r,s.prev,s.next),T(r,s,d===null?r.first:d.next),T(r,d,s),d=s;continue}for(f=[],_=[];l!==null&&l.k!==h;)(o||!(l.e.f&P))&&(v??(v=new Set)).add(l),_.push(l),l=l.next;if(l===null)continue;s=l}f.push(s),d=s,l=s.next}if(l!==null||v!==void 0){for(var S=v===void 0?[]:ve(v);l!==null;)(o||!(l.e.f&P))&&S.push(l),l=l.next;var R=S.length;if(R>0){var D=t&de&&m===0?a:null;if(b){for(n=0;n<R;n+=1)(re=S[n].a)==null||re.measure();for(n=0;n<R;n+=1)(ae=S[n].a)==null||ae.fix()}Ue(r,S,D,E)}}b&&Se(()=>{var se;if(M!==void 0)for(s of M)(se=s.a)==null||se.apply()}),ne.first=r.first&&r.first.e,ne.last=d&&d.e}function Je(e,r,a,i){i&Z&&le(e.v,r),i&j?le(e.i,a):e.i=a}function he(e,r,a,i,t,o,c,A,b,I){var m=(b&Z)!==0,E=(b&Ge)===0,x=m?E?we(t):ie(t):t,l=b&j?ie(c):c,v={i:l,v:x,k:o,a:null,e:null,prev:a,next:i};try{return v.e=_e(()=>A(e,x,l),C),v.e.prev=a&&a.e,v.e.next=i&&i.e,a===null?r.first=v:(a.next=v,a.e.next=v.e),i!==null&&(i.prev=v,i.e.prev=v.e),v}finally{}}function fe(e,r,a){for(var i=e.next?e.next.e.nodes_start:a,t=r?r.e.nodes_start:a,o=e.e.nodes_start;o!==i;){var c=Re(o);t.before(o),o=c}}function T(e,r,a){r===null?e.first=a:(r.next=a,r.e.next=a&&a.e),a!==null&&(a.prev=r,a.e.prev=r&&r.e)}function We(e){if(C){var r=!1,a=()=>{if(!r){if(r=!0,e.hasAttribute("value")){var i=e.value;ue(e,"value",null),e.value=i}if(e.hasAttribute("checked")){var t=e.checked;ue(e,"checked",null),e.checked=t}}};e.__on_r=a,He(a),qe()}}function ue(e,r,a,i){var t=e.__attributes??(e.__attributes={});C&&(t[r]=e.getAttribute(r),r==="src"||r==="srcset"||r==="href"&&e.nodeName==="LINK")||t[r]!==(t[r]=a)&&(r==="style"&&"__styles"in e&&(e.__styles={}),r==="loading"&&(e[Oe]=a),e.removeAttribute(r))}function oe(e,r,a){var i=e.__className,t=Ze(r);C&&e.className===t?e.__className=t:(i!==t||C&&e.className!==t)&&(r==null&&!a?e.removeAttribute("class"):e.className=t,e.__className=t)}function Ze(e,r){return(e??"")+""}function je(e,r,a=r){var i=Fe();Be(e,"input",t=>{var o=t?e.defaultValue:e.value;if(o=J(e)?W(o):o,a(o),i&&o!==(o=r())){var c=e.selectionStart,A=e.selectionEnd;e.value=o??"",A!==null&&(e.selectionStart=c,e.selectionEnd=Math.min(A,e.value.length))}}),(C&&e.defaultValue!==e.value||Le(r)==null&&e.value)&&a(J(e)?W(e.value):e.value),Ve(()=>{var t=r();J(e)&&t===W(e.value)||e.type==="date"&&!t&&!e.value||t!==e.value&&(e.value=t??"")})}function J(e){var r=e.type;return r==="number"||r==="range"}function W(e){return e===""?null:+e}function er(e){return function(...r){var a=r[0];return a.preventDefault(),e==null?void 0:e.apply(this,r)}}var rr=F("<span> </span>"),ar=F("<div></div>"),sr=F("<span> </span>"),tr=F('<div class="guess svelte-10nt1tf"><div class="guess-number svelte-10nt1tf"> </div> <div></div></div>'),nr=F(`<main><h1>Prime Factor Guessing Game</h1> <p>Guess the 3-digit number's prime factors.</p> <form><input type="number" placeholder="Enter your guess" required> <button type="submit">Submit Guess</button></form> <h2>Results</h2> <!> <h2>All Guesses</h2> <!></main>`);function cr(e,r){$e(r,!1);let a,i=[],t=K(""),o=K([]),c=K([]);function A(){const f=[2,3,5,7,11,13,17,19,23,29];function _(p){for(let g of f)for(;p%g===0;)p/=g;return p===1}const u=[];for(let p=100;p<=999;p++)_(p)&&u.push(p);const h=new Date,s=h.getFullYear()*1e3+(h.getMonth()+1)*100+h.getDate();function n(p){const g=Math.sin(p)*1e4;return g-Math.floor(g)}const y=Math.floor(n(s)*u.length);return u[y]}function b(f){const _=[];let u=2;for(;f>1;)f%u===0?(_.push(u),f/=u):u++;return _}Qe(()=>{a=A(),i=b(a),console.log(`Secret number: ${a}, Prime factors: ${i}`)});function I(){const f=parseInt(N(t));if(isNaN(f))return;const _=b(f),u={};for(const s of i)u[s]=(u[s]||0)+1;const h=_.map(s=>u[s]?(u[s]--,{factor:s,isCorrect:!0}):{factor:s,isCorrect:!1});$(o,h),$(c,[...N(c),{guess:f,results:h}]),Object.values(u).every(s=>s===0)&&i.every(s=>N(o).filter(n=>n.isCorrect).map(n=>n.factor).includes(s))&&alert(`Congratulations! You guessed all prime factors of ${a}!`),$(t,"")}me();var m=nr(),E=Y(G(m),4),x=G(E);We(x),Pe(2),k(E);var l=Y(E,4);{var v=f=>{var _=ar();z(_,5,()=>N(o),U,(u,h)=>{let s=()=>N(h).factor,n=()=>N(h).isCorrect;var y=rr(),p=G(y,!0);k(y),X(()=>{oe(y,`result ${(n()?"correct":"incorrect")??""} svelte-10nt1tf`),Q(p,s())}),H(u,y)}),k(_),H(f,_)};Ke(l,f=>{N(o).length>0&&f(v)})}var d=Y(l,4);z(d,1,()=>N(c),U,(f,_,u)=>{let h=()=>N(_).guess,s=()=>N(_).results;var n=tr(),y=G(n),p=G(y);k(y);var g=Y(y,2);z(g,5,s,U,(L,w)=>{let S=()=>N(w).factor,R=()=>N(w).isCorrect;var D=sr(),V=G(D,!0);k(D),X(()=>{oe(D,`result ${(R()?"correct":"incorrect")??""} svelte-10nt1tf`),Q(V,S())}),H(L,D)}),k(g),k(n),X(()=>Q(p,`Guess ${u+1}: ${h()??""}`)),H(f,n)}),k(m),je(x,()=>N(t),f=>$(t,f)),Xe("submit",E,er(I)),H(e,m),Ye()}export{cr as component};