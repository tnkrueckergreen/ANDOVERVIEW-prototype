var X=null;function J(){X=null}async function S(){if(X)return X;try{let e=await fetch("/api/articles");if(!e.ok)throw new Error(`Failed to fetch data from server: ${e.statusText}`);let t=await e.json();return typeof marked<"u"&&(marked.setOptions({mangle:!1,headerIds:!1}),t.articles.forEach(n=>{n.description=marked.parseInline(n.rawDescription||"");let o=n.content||"";n.content=marked.parse(o)})),X=t,X}catch(e){return console.error("Could not fetch data:",e),{articles:[],staff:[]}}}async function Le(e){try{let t=await fetch("/api/users/username",{method:"PUT",credentials:"include",headers:{"Content-Type":"application/json"},body:JSON.stringify({newUsername:e})}),n=await t.json();return t.ok?{success:!0,user:n.user}:{success:!1,error:n.error}}catch{return{success:!1,error:"Could not connect to the server."}}}async function ke(e,t){try{let n=await fetch("/api/users/password",{method:"PUT",credentials:"include",headers:{"Content-Type":"application/json"},body:JSON.stringify({currentPassword:e,newPassword:t})}),o=await n.json();return n.ok?{success:!0}:{success:!1,error:o.error}}catch{return{success:!1,error:"Could not connect to the server."}}}async function $e(e,t=!0){try{let n=await fetch(`/api/articles/${e}/like`,{method:"POST",credentials:"include",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:t?"like":"unlike"})});if(!n.ok)throw new Error("Like request failed");return await n.json()}catch(n){return console.error("Failed to like/unlike article:",n),null}}async function Ee(e,t=!0){try{let n=await fetch(`/api/articles/${e}/bookmark`,{method:"POST",credentials:"include",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:t?"bookmark":"unbookmark"})});if(!n.ok)throw new Error("Bookmark request failed");return await n.json()}catch(n){return console.error("Failed to bookmark/unbookmark article:",n),null}}async function Se(e){try{let t=await fetch(`/api/articles/${e}/comments`);if(!t.ok)throw new Error("Failed to fetch comments");return await t.json()}catch(t){return console.error("Error fetching comments:",t),[]}}async function Te(e,t){try{let n=await fetch(`/api/articles/${e}/comments`,{method:"POST",credentials:"include",headers:{"Content-Type":"application/json"},body:JSON.stringify({content:t})});if(!n.ok)throw new Error("Failed to post comment");return await n.json()}catch(n){return console.error("Error posting comment:",n),null}}async function xe(e,t){try{let n=await fetch(`/api/comments/${e}`,{method:"PUT",credentials:"include",headers:{"Content-Type":"application/json"},body:JSON.stringify({content:t})});if(!n.ok)throw new Error("Failed to edit comment");return await n.json()}catch(n){return console.error("Error editing comment:",n),null}}async function Ae(e){try{let t=await fetch(`/api/comments/${e}`,{method:"DELETE",credentials:"include"});if(!t.ok)throw new Error("Failed to delete comment");return await t.json()}catch(t){return console.error("Error deleting comment:",t),null}}async function Ie(){try{let e=await fetch("/api/account/data",{credentials:"include"});if(e.status===401)return{error:"Unauthorized"};if(!e.ok)throw new Error("Failed to fetch account data");return await e.json()}catch(e){return console.error("Error fetching account data:",e),null}}async function Be(e){try{let t=await fetch(`/api/articles/${e}/view`,{method:"POST",credentials:"include",headers:{"Content-Type":"application/json"}});if(!t.ok)throw new Error("Failed to track article view");return await t.json()}catch(t){return console.error("Error tracking article view:",t),null}}async function Me(){try{let e=await fetch("/api/users/delete",{method:"DELETE",credentials:"include"});if(!e.ok)throw new Error("Failed to delete account");return await e.json()}catch(e){return console.error("Error deleting account:",e),null}}function De(e){let t=e.map(a=>a.name),n=t.length;if(n===0)return"";if(n===1)return t[0];if(n===2)return`${t[0]} and ${t[1]}`;let o=n-2;return`${t[0]}, ${t[1]}, and ${o} more`}function Pe(e){let t=e.map(s=>s.name),n=t.length;if(n===0)return"";if(n===1)return t[0];if(n===2)return`${t[0]} and ${t[1]}`;let o=t.slice(0,-1).join(", "),a=t.slice(-1);return`${o}, and ${a}`}function le(e,{size:t="large",compact:n=!1}={}){if(!e||e.length===0)return"";let o=e,a;n?a=o.slice(0,2):a=o;let s=a.map(i=>`<img src="${i.image}" alt="${i.name}" title="${i.name}">`).join(""),r=e.length-a.length,l=r>0?`<div class="avatar-more">+${r}</div>`:"";return`
        <div class="avatar-stack ${t}">
            ${s}
            ${l}
        </div>
    `}function St(e,{fullNames:t=!1}={}){let n=t?Pe(e):De(e);return n?`By ${n}`:""}function He(e,t={}){if(!e||e.length===0)return"";let{size:n="large",fullNames:o=!1,className:a="author-meta"}=t,s=le(e,{size:n,compact:!0}),r=St(e,{fullNames:o}),l=r?`<span>${r}</span>`:"";return`
        <div class="${a} ${n}">
            ${s}
            ${l}
        </div>
    `}function U(e,t={}){let{className:n="article-card",titleTag:o="h4",titleClass:a="article-title",showExcerpt:s=!0,showAuthors:r=!0,imageLoading:l="lazy",authorSize:i="large",withAvatars:c=!0}=t;return`
        <article class="${n} article-card-linkable">
            ${Tt(e,l)}
            ${xt(e)}
            ${At(e,o,a)}
            ${s?It(e):""}
            ${r?He(e.writers,{size:i,withAvatars:c,className:"author-meta"}):""}
        </article>
    `}function Tt(e,t){let n=e.image?e.image:"assets/icons/placeholder-image.png",o=e.image?e.title:"Placeholder image for article";return`<img src="${n}" alt="${o}" loading="${t}">`}function xt(e){return`
        <div class="meta-bar">
            <span class="category">${e.category}</span>
            <span class="date">${e.date}</span>
        </div>
    `}function At(e,t,n){return`
        <a href="#single-article-page/${e.id}" class="main-article-link">
            <${t} class="${n}">${e.title}</${t}>
        </a>
    `}function It(e){return`<p class="excerpt">${e.description}</p>`}function Fe(e){return U(e,{className:"featured-card",titleTag:"h3",titleClass:"article-title-large",showExcerpt:!0,showAuthors:!0,imageLoading:"eager"})}function Ne(e){return U(e,{className:"recent-card",titleTag:"h4",titleClass:"article-title-small",showExcerpt:!0,showAuthors:!0,imageLoading:"lazy"})}function T(e,t){return e.map(t).join("")}function Oe(e,t){return e?typeof t=="function"?t():t:""}var qe,Bt=60;function Mt(e){let t=document.getElementById("news-ticker-container"),n=t?.querySelector(".ticker-wrap"),o=t?.querySelector("#news-ticker-list");if(!t||!n||!o||e.length===0)return;let a=()=>{o.innerHTML="",o.classList.remove("is-animated"),o.style.animation="none";let s=document.createElement("div");s.classList.add("ticker-group"),e.slice(0,8).forEach(d=>{let p=document.createElement("a");p.href=`#single-article-page/${d.id}`,p.textContent=d.title,s.appendChild(p)}),o.appendChild(s);let r=n.offsetWidth,l=s.offsetWidth;if(l>r){let d=s.cloneNode(!0);o.appendChild(d)}else{let d=Math.ceil(r*2/l);for(let p=0;p<d;p++){let h=s.cloneNode(!0);o.appendChild(h)}}let i=s.offsetWidth,c=i/Bt;o.style.setProperty("--scroll-width",`${i}px`),o.style.setProperty("--scroll-duration",`${c}s`),requestAnimationFrame(()=>{o.classList.add("is-animated"),o.style.animation=""})};a(),window.addEventListener("resize",()=>{clearTimeout(qe),qe=setTimeout(a,250)})}function Dt(){let e=document.querySelector(".typewriter-heading");if(!e||e.dataset.isTyped)return;let t=e.textContent;e.dataset.isTyped="true",e.style.visibility="hidden";let n=e.offsetHeight;e.style.minHeight=`${n}px`,e.innerHTML="",e.style.visibility="visible";let o=document.createElement("span");o.className="typewriter-cursor",o.textContent="|",e.appendChild(o);let a=0;function s(){if(a<t.length){let r=t[a];o.insertAdjacentText("beforebegin",r),a++;let l=50+(Math.random()*30-15);setTimeout(s,l+(r===","||r==="."?300:0))}else setInterval(()=>{o.style.opacity=o.style.opacity==="0"?"1":"0"},500)}setTimeout(s,300)}function Pt(e,t){let n=T(e,Fe),o=T(t,Ne);return`
        <div class="page" id="home-page">
            <div class="container">
                <section class="welcome-section">
                    <h1 class="typewriter-heading">News, features, and perspectives from the students of Andover High.</h1>
                </section>
                <hr class="main-divider">
            </div>
            <main class="container content-grid">
                <div class="featured-column">
                    <h2 class="section-title">Featured</h2>
                    <div class="featured-articles-wrapper">${n}</div>
                </div>
                <div class="recent-column">
                    <h2 class="section-title">Recent</h2>
                    <div class="recent-grid">${o}</div>
                </div>
            </main>
        </div>
    `}async function Ue(e){let{articles:t}=await S(),n=t.filter(a=>a.display==="featured").slice(0,2),o=t.filter(a=>a.display==="recent").slice(0,6);e.innerHTML=DOMPurify.sanitize(Pt(n,o)),Mt(t),Dt()}function Ht(e){return`
        <section class="page" id="about-page">
            <div class="container">
                <div class="page-header">
                    <h1>About ANDOVERVIEW</h1>
                </div>

                <div class="collapsible-card" id="about-description-card">
                    <div class="card-header" role="button" aria-expanded="false" aria-controls="about-card-content">
                        <h3>Our Mission & Principles</h3>
                        <button class="card-toggle-btn" aria-label="Toggle description">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                <path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
                            </svg>
                        </button>
                    </div>
                    <div class="card-content-wrapper" id="about-card-content">
                        <div class="card-content">
                            <p>ANDOVERVIEW is a publication written, edited and designed by the Newspaper Production class to serve as an open forum for students to discuss issues relevant to the Andover High School community.</p>
                            <p>Letters to the editor and guest commentaries are encouraged; please email submissions to the following address: <a href="mailto:andoverview@andoverma.us">andoverview@andoverma.us</a>.</p>
                            <p>If you would like to write for us or join the newspaper staff, please visit the <a href="#contact">Contact page</a> for more information.</p>
                            <p>Include contact information for verification purposes. The staff of ANDOVERVIEW reviews letters to the editor and guest commentaries and reserves the right to refuse material for reasons pertaining to length, clarity, libel, obscenity, copyright infringement, or material disruption to the educational process of Andover High School.</p>
                        </div>
                    </div>
                </div>

                <div class="page-header team-header">
                    <h2>Meet the Team</h2>
                    <p>Click a card to learn more about each staff member!</p>
                </div>
                <div class="staff-grid">${e.map(n=>{let o=n.image,a=`Image for ${n.name}`;return`
            <div class="staff-card" data-name="${n.name}">
                <div class="staff-card-img">
                    <img src="${o}" alt="${a}" loading="lazy">
                </div>
                <h4>${n.name}</h4>
                <p>${n.role}</p>
            </div>
        `}).join("")}</div>
            </div>
        </section>
    `}function Ft(){let e=document.getElementById("about-description-card"),t=e.querySelector(".card-header");t&&t.addEventListener("click",()=>{let n=e.classList.toggle("is-expanded");t.setAttribute("aria-expanded",n)})}async function je(e){let{staff:t}=await S(),n=DOMPurify.sanitize(Ht(t));for(;e.firstChild;)e.removeChild(e.firstChild);let a=new DOMParser().parseFromString(n,"text/html");Array.from(a.body.children).forEach(s=>{e.appendChild(s)}),Ft()}function j(){return`
        <div class="sort-container">
            <label for="sort-by">Sort by:</label>
            <select name="sort-by" id="sort-by">
                <option value="date-desc">Newest</option>
                <option value="date-asc">Oldest</option>
                <option value="title-asc">Title (A-Z)</option>
                <option value="title-desc">Title (Z-A)</option>
            </select>
        </div>
    `}function M(e,t){let n=[...e];switch(t){case"date-desc":n.sort((o,a)=>new Date(a.date)-new Date(o.date));break;case"date-asc":n.sort((o,a)=>new Date(o.date)-new Date(a.date));break;case"title-asc":n.sort((o,a)=>o.title.localeCompare(a.title));break;case"title-desc":n.sort((o,a)=>a.title.localeCompare(o.title));break;default:n.sort((o,a)=>new Date(a.date)-new Date(o.date));break}return n}function D(e){return U(e,{className:"article-card-small",titleTag:"h4",titleClass:"article-title-small",showExcerpt:!0,showAuthors:!0,imageLoading:"lazy"})}var P=[];function Nt(e,t){let n=T(t,D);return`
        <section class="page article-grid-page">
            <div class="container">
                <div class="page-header"><h1>${e}</h1></div>
                ${j()}
                <div id="article-grid-container" class="article-grid">${n}</div>
            </div>
        </section>
    `}function Ot(){let e=document.getElementById("sort-by"),t=document.getElementById("article-grid-container");!e||!t||e.addEventListener("change",n=>{let o=n.target.value,a=M(P,o);t.innerHTML=DOMPurify.sanitize(T(a,D))})}async function B(e,t="all",n="category"){let{articles:o}=await S(),a="";if(n==="author"){let s=decodeURIComponent(t);P=o.filter(r=>r.writers.some(l=>l.name===s)),a=`Articles by ${s}`}else{let s=t.toLowerCase();s==="all"?(P=o,a="All Articles"):s==="opinion"?(P=o.filter(r=>r.categories.some(l=>["opinion","editorial"].includes(l.toLowerCase()))),a="Opinion"):(P=o.filter(r=>r.categories.map(l=>l.toLowerCase()).includes(s)),a=t.charAt(0).toUpperCase()+t.slice(1))}P=M(P,"date-desc"),e.innerHTML=DOMPurify.sanitize(Nt(a,P)),Ot()}function de(e,t={}){let{variant:n="full"}=t,o=encodeURIComponent(window.location.href),a=encodeURIComponent(e.title),s=encodeURIComponent(e.description),r=[{name:"Email",icon:"email.svg",url:`mailto:?subject=${a}&body=${s}%0A%0A${o}`},{name:"Facebook",icon:"facebook.svg",url:`https://www.facebook.com/sharer/sharer.php?u=${o}`},{name:"X (Twitter)",icon:"twitter.svg",url:`https://twitter.com/intent/tweet?url=${o}&text=${a}`},{name:"LinkedIn",icon:"linkedin.svg",url:`https://www.linkedin.com/sharing/share-offsite/?url=${o}`},{name:"Reddit",icon:"reddit.svg",url:`https://reddit.com/submit?url=${o}&title=${a}`},{name:"WhatsApp",icon:"whatsapp.svg",url:`https://wa.me/?text=${a}%20${o}`}];return n==="minimal"?`<div class="social-share-minimal">
            <button class="social-share-button-minimal copy-link-btn" title="Copy link" aria-label="Copy article link">
                <span class="copy-link-icon-wrapper">
                    <img src="assets/icons/link.svg" alt="Copy link" class="social-share-icon-minimal" aria-hidden="true">
                </span>
                <span class="copy-link-success-message">Copied!</span>
            </button>
        ${r.slice(0,5).map(c=>`
            <a href="${c.url}"
               target="_blank"
               rel="noopener noreferrer"
               class="social-share-button-minimal"
               title="Share on ${c.name}"
               aria-label="Share on ${c.name}">
                <img src="assets/icons/${c.icon}" alt="${c.name}" class="social-share-icon-minimal" aria-hidden="true">
            </a>
        `).join("")}</div>`:`
            <div class="social-share-container">
                <h4 class="social-share-title">Share this Article</h4>
                <div class="social-share-buttons">
                    ${[...r,{name:"Telegram",icon:"telegram.svg",url:`https://t.me/share/url?url=${o}&text=${a}`},{name:"Bluesky",icon:"bluesky.svg",url:`https://bsky.app/intent/compose?text=${a}%20${o}`}].map(c=>`
            <a href="${c.url}"
               target="_blank"
               rel="noopener noreferrer"
               class="social-share-button"
               aria-label="Share on ${c.name}">
                <img src="assets/icons/${c.icon}" alt="" class="social-share-icon" aria-hidden="true">
                <span>${c.name}</span>
            </a>
        `).join("")}
                </div>
            </div>
        `}function qt(e){let t=5381;for(let n=0;n<e.length;n++){let o=e.charCodeAt(n);t=(t<<5)+t+o}return t}function Re(e){if(!e)return"linear-gradient(45deg, #888, #666)";let t=qt(e),n=Math.abs(t)%360,o=55+Math.abs(Math.floor(t/1e4))%26,a=45+Math.abs(Math.floor(t/1e5))%11,s=Math.abs(Math.floor(t/1e3))%360,r=Math.abs(t)%2===1,l=`hsl(${n}, ${o}%, ${a}%)`;if(r){let i=Math.abs(Math.floor(t/360))%31-15,c=(n+120+i)%360,d=(n+240+i)%360,p=`hsl(${c}, ${o}%, ${a}%)`,h=`hsl(${d}, ${o}%, ${a}%)`;return`linear-gradient(${s}deg, ${l} 0%, ${p} 50%, ${h} 100%)`}else{let i=40+Math.abs(Math.floor(t/360))%31,d=`hsl(${(n+i)%360}, ${o}%, ${a}%)`;return`linear-gradient(${s}deg, ${l}, ${d})`}}function ee({username:e,customAvatar:t=null,size:n="medium",className:o="",attributes:a={}}){if(!e)return"";let s,r;t?(s=`background-image: url('${t}'); background-size: cover; background-position: center;`,r=""):(s=`background: ${Re(e)};`,r=e.charAt(0).toUpperCase());let l=Object.entries(a).map(([c,d])=>`${c}="${d}"`).join(" ");return`<div class="${`avatar avatar--${n} ${o}`.trim()}" style="${s}" ${l}>${r}</div>`}function te(e){return ee({username:e.username,customAvatar:e.customAvatar||e.custom_avatar,size:"large",className:"account-avatar",attributes:{id:"account-avatar"}})}function ue(e,t=!1){return ee({username:e.username||e.author_name,customAvatar:e.customAvatar||e.custom_avatar,size:"medium",className:t?"comment-form-avatar":"comment-avatar"})}var x=null,I=!1,me=!1;function pe(e){I&&e&&(x=e,J())}async function ze(e,t){try{let n=await fetch("/api/users/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({username:e,password:t})}),o=await n.json();return n.ok?(I=!0,x=o,J(),H(),{success:!0,currentHash:location.hash}):{success:!1,error:o.error}}catch{return{success:!1,error:"Could not connect to the server."}}}async function _e(e,t){try{let n=await fetch("/api/users/signup",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({username:e,password:t})}),o=await n.json();return n.ok?(I=!0,x=o,J(),H(),{success:!0,currentHash:location.hash}):{success:!1,error:o.error}}catch{return{success:!1,error:"Could not connect to the server."}}}async function We(){if(!me)try{let t=await(await fetch("/api/users/status")).json();t.loggedIn?(I=!0,x=t.user):(I=!1,x=null),me=!0,H()}catch(e){console.error("Error checking login status:",e),I=!1,x=null,me=!0}}function H(){let e=document.getElementById("auth-status"),t=document.getElementById("auth-btn-mobile");if(document.body.classList.toggle("user-is-logged-in",I),e)if(e.innerHTML="",I&&x){let n=ee({username:x.username,customAvatar:x.custom_avatar,size:"small",className:"header-avatar"}),o=document.createElement("a");o.href="#account",o.className="button-secondary",o.textContent="My Account";let a=document.createElement("a");a.href="#account",a.title="My Account",a.className="header-avatar-link";let r=new DOMParser().parseFromString(n,"text/html").body.firstChild;a.appendChild(r),e.appendChild(o),e.appendChild(a)}else{let n=document.createElement("a");n.href="#login",n.className="button-secondary",n.textContent="Log In",e.appendChild(n)}if(t)if(t.innerHTML="",I&&x){let n=document.createElement("a");n.href="#account",n.className="button-secondary",n.textContent="My Account",t.appendChild(n)}else{let n=document.createElement("a");n.href="#login",n.className="button-secondary",n.textContent="Log In",t.appendChild(n)}}async function Ve(){try{await fetch("/api/users/logout",{method:"POST"}),I=!1,x=null,J(),H(),location.hash="#",location.reload()}catch(e){console.error("Logout failed:",e)}}function R(){return x}function F(){return I}function fe(e,t="info",n=3e3){let o=document.querySelector(".toast-notification");o&&o.remove();let a=document.createElement("div");a.className=`toast-notification toast-${t}`,a.textContent=e,document.body.appendChild(a),setTimeout(()=>a.classList.add("show"),10),setTimeout(()=>{a.classList.remove("show"),setTimeout(()=>a.remove(),300)},n)}function k(e,t=3e3){fe(e,"success",t)}function b(e,t=4e3){fe(e,"error",t)}function ne(e,t=3500){fe(e,"warning",t)}function Ut(e,t){let n=0,o=e.tags.filter(a=>t.tags.includes(a));return n+=o.length*5,e.category===t.category&&(n+=2),n}function Ye(e,t,n=4){return t.filter(a=>a.id!==e.id).map(a=>({...a,score:Ut(e,a)})).filter(a=>a.score>0).sort((a,s)=>s.score!==a.score?s.score-a.score:new Date(s.date)-new Date(a.date)).slice(0,n)}function Z(){if(typeof confetti!="function"){console.warn("Confetti library not loaded.");return}let e=["#002D62","#FFD700"];confetti({particleCount:150,spread:120,origin:{y:.6},colors:e,disableForReducedMotion:!0})}var N=null;function jt(e){let t=`scrollPos-${e}`,n=sessionStorage.getItem(t);n&&(setTimeout(()=>{window.scrollTo(0,parseInt(n,10))},10),sessionStorage.removeItem(t)),N&&window.removeEventListener("beforeunload",N),N=()=>{window.scrollY>200&&sessionStorage.setItem(t,window.scrollY.toString())},window.addEventListener("beforeunload",N)}function Rt(e){return!e||e.length===0?"":`
        <section class="more-like-this-section">
            <h2>More Like This</h2>
            <div class="article-grid">
                ${T(e,D)}
            </div>
        </section>
    `}function zt(e){let t=new Date(e.replace(" ","T")+"Z"),o=Math.round((new Date-t)/1e3),a=Math.round(o/60),s=Math.round(a/60),r=Math.round(s/24);return o<10?"just now":o<60?`${o} seconds ago`:a<60?`${a} minutes ago`:s<24?`${s} hours ago`:r<7?`${r} days ago`:t.toLocaleDateString()}function _t(e){if(!e||e.length===0)return"";let t={"Editor-in-Chief":"Editors-in-Chief"},n=Object.fromEntries(Object.entries(t).map(([i,c])=>[c,i]));function o(i,c){return i?c===1?n[i]?n[i]:i.endsWith("s")&&!i.endsWith("ss")&&!["arts","sports"].includes(i.toLowerCase())?i.slice(0,-1):i:t[i]?t[i]:i.endsWith("s")?i:`${i}s`:""}let a=i=>{let c=i.map(d=>`<a href="${d.authorLink||`#author/${encodeURIComponent(d.name)}`}" class="author-link">${d.name}</a>`);return c.length===1?c[0]:c.length===2?c.join(" and "):`${c.slice(0,-1).join(", ")}, and ${c.slice(-1)}`},s=e.reduce((i,c)=>{let d=o(c.role||"_noRole",1),p=!c.isCurrentStaff,h=`${d}_${p}`;return i[h]||(i[h]=[]),i[h].push(c),i},{}),r=Object.entries(s).map(([i,c])=>{let[d,p]=i.split("_"),h=p==="true",g=a(c);if(d==="_noRole")return g;let u=o(d,c.length);return h&&(u=`Former ${u}`),`${g} \u2022 <span class="author-role">${u}</span>`}),l;return r.length===1?l=r[0]:r.length===2?l=r.join(" and "):l=`${r.slice(0,-1).join(", ")}, and ${r.slice(-1)}`,`By ${l}`}function he(e){let t=e.caption||e.credit,o=`<figure class="single-article-figure ${`placement--${e.placement.toLowerCase().replace(/\s+/g,"-")}`}"><img src="${e.file}" alt="${e.caption||"Article image"}" class="single-article-image">`;return t&&(o+=`<figcaption>${e.caption?`<span class="caption-text">${e.caption}</span>`:""}${e.credit?`<span class="caption-credit">${e.credit}</span>`:""}</figcaption>`),o+="</figure>",o}function Wt(e,t){if(!t||t.length===0)return{mainContent:e,bottomContent:""};let n=DOMPurify.sanitize(e,{USE_PROFILES:{html:!0}}),o=new DOMParser,a=o.parseFromString(n,"text/html"),s=Array.from(a.body.children),r=u=>{let m=he(u);return o.parseFromString(DOMPurify.sanitize(m),"text/html").body.firstChild},l=t.filter(u=>u.placement.startsWith("Top")),i=t.filter(u=>u.placement==="Bottom Center"),c=t.filter(u=>!u.placement.startsWith("Top")&&u.placement!=="Bottom Center"),d=s.map((u,m)=>["P","H2","H3","H4","H5","H6","UL","OL","BLOCKQUOTE"].includes(u.tagName)?m:-1).filter(u=>u!==-1);if(c.length>0)if(d.length>0){let u=Math.max(1,Math.floor(d.length/(c.length+1)));for(let m=c.length-1;m>=0;m--){let y=(m+1)*u,$=Math.min(y,d.length),f=d[$-1]+1,v=r(c[m]);v&&s.splice(f,0,v)}}else c.forEach(u=>{let m=r(u);m&&s.push(m)});let h=l.map(he).join("")+s.map(u=>u.outerHTML).join(""),g=i.map(he).join("");return{mainContent:h,bottomContent:g}}function Ge(e){let t=F(),n=R(),o=t&&n&&n.user_id===e.author_id,a=document.createElement("li");a.id=`comment-${e.comment_id}`;let s=document.createElement("div");s.className="comment";let r=ue({author_name:e.author_name||"Anonymous",custom_avatar:e.custom_avatar}),i=new DOMParser().parseFromString(DOMPurify.sanitize(r),"text/html").body.firstChild;i&&s.appendChild(i);let c=document.createElement("div");c.className="comment-main";let d=document.createElement("div");d.className="comment-header";let p=document.createElement("div"),h=document.createElement("span");h.className="comment-author",h.textContent=e.author_name;let g=document.createElement("span");if(g.className="comment-timestamp",g.textContent=zt(e.timestamp),p.appendChild(h),p.appendChild(g),d.appendChild(p),o){let $=document.createElement("div");$.className="comment-actions",$.innerHTML=DOMPurify.sanitize(`
            <button class="comment-action-btn comment-edit-btn" data-comment-id="${e.comment_id}" title="Edit comment">
                <img src="assets/icons/edit.svg" alt="Edit">
            </button>
            <button class="comment-action-btn comment-delete-btn" data-comment-id="${e.comment_id}" title="Delete comment">
                <img src="assets/icons/delete.svg" alt="Delete">
            </button>
        `),d.appendChild($)}let u=document.createElement("div");u.className="comment-content",u.id=`comment-content-${e.comment_id}`,u.textContent=e.content;let m=`edit-textarea-${e.comment_id}`,y=document.createElement("div");return y.className="comment-edit-form",y.id=`comment-edit-form-${e.comment_id}`,y.style.display="none",y.innerHTML=DOMPurify.sanitize(`
        <label for="${m}" class="sr-only">Edit your comment</label>
        <textarea class="comment-edit-textarea" id="${m}" name="${m}"></textarea>
        <div class="comment-edit-actions">
            <button class="button-secondary cancel-btn" data-comment-id="${e.comment_id}">Cancel</button>
            <button class="button-primary save-btn" data-comment-id="${e.comment_id}">Save Changes</button>
        </div>
    `),y.querySelector("textarea").textContent=e.content,c.appendChild(d),c.appendChild(u),c.appendChild(y),s.appendChild(c),a.appendChild(s),a}function Vt(e){let t=F(),n=R();return`
        <section class="comments-section">
            <div class="comments-header">
                <h3>Comments</h3>
                <span class="comment-count" id="comment-count-display"></span>
            </div>
            ${t&&n?`
        <form class="comment-form" id="comment-form" data-article-id="${e}">
            ${ue(n,!0)}
            <div class="comment-form-main">
                <textarea id="comment-content" placeholder="Write a comment as ${n.username}..." required maxlength="500"></textarea>
                <div class="comment-form-actions">
                    <span class="char-counter" id="char-counter">500</span>
                    <button type="submit" id="comment-submit-btn" class="button-primary" disabled>Post Comment</button>
                </div>
            </div>
        </form>
    `:`
        <div class="login-prompt-for-comments">
            <p><a href="#login" onclick="sessionStorage.setItem('returnToAfterAuth', location.hash)">Log in</a> or <a href="#signup" onclick="sessionStorage.setItem('returnToAfterAuth', location.hash)">sign up</a> to leave a comment.</p>
        </div>
    `}
            <ul id="comment-list"></ul>
        </section>
    `}function Yt(e,t){let{writers:n,tags:o,category:a,date:s,title:r,description:l,content:i,images:c,id:d}=e,p=o&&o.length>0?`<div class="tag-list">${o.map(w=>`<a href="#search/${encodeURIComponent(w)}" class="tag-item">${w}</a>`).join("")}</div>`:"",h=n&&n.length>0?`<div class="single-article-meta-top">${le(n,{compact:!1})}<span class="author-byline">${_t(n)}</span></div>`:"",g="",u=n.filter(w=>w.isCurrentStaff&&w.bio);u.length>0&&(g=`<div class="author-bios-container">${u.map(L=>`<div class="author-profile"><img src="${L.image}" alt="${L.name}"><div><h4>About ${L.name}</h4><p>${L.bio}</p></div></div>`).join('<hr class="author-separator">')}</div>`);let{mainContent:m,bottomContent:y}=Wt(i,c),$=e.user_has_liked?"liked":"",f=e.user_has_bookmarked?"bookmarked":"",v=Rt(t);return`
        <section class="page" id="single-article-page">
            <div class="container">
                <div class="single-article-wrapper">
                    <div class="article-meta-bar"><span class="category">${a}</span><span class="date">${s}</span></div>
                    <header class="single-article-header">
                        <h1>${r}</h1>
                        <p class="single-article-description">${l}</p>
                        <div class="article-interactions">
                            <button class="interaction-btn like-btn ${$}" data-article-id="${d}">\u{1F44D} <span class="like-count">${e.likes}</span> <span class="like-text">${e.likes===1?"Like":"Likes"}</span></button>
                            <button class="interaction-btn comment-scroll-btn" id="comment-scroll-btn">\u{1F4AC} <span id="top-comment-count">0</span> <span id="top-comment-text">Comments</span></button>
                            <button class="interaction-btn bookmark-btn ${f}" data-article-id="${d}">\u{1F516} <span class="bookmark-text">${e.user_has_bookmarked?"Bookmarked":"Bookmark"}</span></button>
                        </div>
                        ${de(e,{variant:"minimal"})}
                    </header>
                    ${p}
                    ${h}
                    <div class="single-article-content">
                        ${m}
                        ${y}
                        ${de(e,{variant:"full"})}
                        ${g}
                        ${v}
                        ${Vt(d)}
                    </div>
                </div>
            </div>
        </section>
    `}function ge(e){let t=document.getElementById("comment-count-display"),n=document.getElementById("top-comment-count"),o=document.getElementById("top-comment-text");t&&(e===0?t.textContent="":t.textContent=`(${e})`),n&&o&&(n.textContent=e,o.textContent=e===1?"Comment":"Comments")}function Gt(){let e=document.getElementById("comment-form");if(!e)return;let t=e.dataset.articleId,n=document.getElementById("comment-content"),o=document.getElementById("comment-submit-btn"),a=document.getElementById("char-counter"),s=document.getElementById("comment-list"),r=500;function l(){o.disabled=!(n.value.trim().length>0)}n.addEventListener("input",()=>{l();let i=r-n.value.length;a.textContent=i}),e.addEventListener("submit",async i=>{i.preventDefault(),o.disabled=!0,o.textContent="Posting...";let c=await Te(t,n.value.trim());if(c){let d=Ge(c);s.prepend(d);let p=s.children.length;ge(p),n.value="",a.textContent=r,k("Comment posted successfully!"),Z()}else b("Failed to post comment. You may need to log in again.");o.textContent="Post Comment",l()})}async function Xt(e){let t=document.getElementById("comment-list");if(!t)return;let n=await Se(e);t.innerHTML="",n.forEach(o=>{let a=Ge(o);t.appendChild(a)}),ge(n.length),Jt()}function Jt(){let e=document.getElementById("comment-list");e&&e.addEventListener("click",async t=>{let n=t.target.closest(".comment-edit-btn");if(n){let r=n.dataset.commentId;Zt(r);return}let o=t.target.closest(".comment-delete-btn");if(o){let r=o.dataset.commentId;confirm("Are you sure you want to delete this comment?")&&await Qt(r);return}let a=t.target.closest(".save-btn");if(a){let r=a.dataset.commentId;await Kt(r);return}let s=t.target.closest(".cancel-btn");if(s){let r=s.dataset.commentId;Xe(r);return}})}function Zt(e){let t=document.querySelector(`#comment-${e} .comment-main`);t.querySelector(".comment-content").style.display="none",t.querySelector(".comment-header .comment-actions").style.display="none",t.querySelector(".comment-edit-form").style.display="block"}function Xe(e){let t=document.querySelector(`#comment-${e} .comment-main`);t.querySelector(".comment-content").style.display="block";let n=t.querySelector(".comment-header .comment-actions");n&&(n.style.display="flex"),t.querySelector(".comment-edit-form").style.display="none"}async function Kt(e){let o=document.getElementById(`comment-edit-form-${e}`).querySelector(".comment-edit-textarea").value.trim();if(!o){ne("Comment cannot be empty.");return}if(await xe(e,o)){let s=document.getElementById(`comment-content-${e}`);s.textContent=o,Xe(e),k("Comment updated successfully!")}else b("Failed to update comment. Please try again.")}async function Qt(e){if(await Ae(e)){document.getElementById(`comment-${e}`).remove();let o=document.getElementById("comment-list").children.length;ge(o),k("Comment deleted successfully.")}else b("Failed to delete comment. Please try again.")}async function Je(e,t){let{articles:n}=await S(),o=n.find(a=>a.id==t);if(o){let a=Ye(o,n);e.innerHTML=DOMPurify.sanitize(Yt(o,a),{USE_PROFILES:{html:!0}}),jt(t),Gt(),F()&&Be(t);let s=e.querySelector(".like-btn");s&&s.addEventListener("click",async()=>{if(!F()){ne("Please log in to like articles."),sessionStorage.setItem("returnToAfterAuth",location.hash),location.hash="#login";return}let c=s.classList.contains("liked"),d=await $e(o.id,!c);d?(s.querySelector(".like-count").textContent=d.likes,s.querySelector(".like-text").textContent=d.likes===1?"Like":"Likes",s.classList.toggle("liked",d.user_has_liked),d.user_has_liked&&Z()):b("Action failed. Please try again.")});let r=e.querySelector(".bookmark-btn");r&&r.addEventListener("click",async()=>{if(!F()){ne("Please log in to bookmark articles."),sessionStorage.setItem("returnToAfterAuth",location.hash),location.hash="#login";return}let c=r.classList.contains("bookmarked"),d=await Ee(o.id,!c);d?(r.querySelector(".bookmark-text").textContent=d.user_has_bookmarked?"Bookmarked":"Bookmark",r.classList.toggle("bookmarked",d.user_has_bookmarked),k(d.user_has_bookmarked?"Article bookmarked!":"Bookmark removed!")):b("Action failed. Please try again.")});let l=e.querySelector("#comment-scroll-btn"),i=e.querySelector(".comments-section");l&&i&&l.addEventListener("click",()=>{i.scrollIntoView({behavior:"smooth"})}),Xt(t)}else N&&(window.removeEventListener("beforeunload",N),N=null),e.innerHTML='<div class="container page"><p>Article not found.</p></div>'}var{pdfjsLib:Ze}=globalThis;Ze.GlobalWorkerOptions.workerSrc="https://mozilla.github.io/pdf.js/build/pdf.worker.mjs";var ve=[];async function Ke(){let e=document.querySelectorAll(".pdf-preview-canvas");for(let t of e){let n=t.dataset.url;if(n)try{let a=await(await Ze.getDocument(n).promise).getPage(1),s=a.getViewport({scale:1.5});t.height=s.height,t.width=s.width;let r=t.getContext("2d");await a.render({canvasContext:r,viewport:s}).promise}catch(o){console.error(`Failed to render PDF preview for ${n}:`,o);let a=t.getContext("2d");a.fillStyle="#EEE",a.fillRect(0,0,t.width,t.height),a.fillStyle="#777",a.textAlign="center",a.font="16px sans-serif",a.fillText("Preview unavailable",t.width/2,t.height/2)}}}function Qe(e){return`
        <div class="issue-card">
            <div>
                <div class="issue-cover">
                    <div class="cover-loading"></div>
                    <canvas id="${`pdf-canvas-${e.filename.replace(".pdf","")}`}" class="pdf-preview-canvas" data-url="${e.url}"></canvas>
                </div>
                <h4>${e.name}</h4>
            </div>
            <div class="issue-actions">
                <a href="${e.url}" target="_blank" rel="noopener noreferrer" class="issue-btn view-btn">View</a>
                <button class="issue-btn download-btn" data-url="${e.url}" data-filename="${e.filename}">Download</button>
            </div>
        </div>
    `}function en(){let e=document.getElementById("sort-by"),t=document.getElementById("issue-list-container");!e||!t||e.addEventListener("change",n=>{let o=n.target.value,a=M(ve,o);t.innerHTML=DOMPurify.sanitize(T(a,Qe)),Ke()})}function tn(e){let t=T(e,Qe);return`
        <section class="page" id="issues-page">
            <div class="container">
                <div class="page-header">
                    <h1>Past Issues</h1>
                    <p>Browse and download PDF versions of our print newspaper. Perfect for offline reading or seeing our layout design.</p>
                </div>
                ${j()}
                <div id="issue-list-container" class="issue-list">${t}</div>
            </div>
        </section>
    `}async function et(e){try{let t=await fetch("data/issues.json");if(!t.ok)throw new Error("Failed to fetch issues data.");ve=(await t.json()).map(a=>({...a,title:a.name}));let o=M(ve,"date-desc");e.innerHTML=DOMPurify.sanitize(tn(o)),en(),Ke()}catch(t){console.error("Error rendering issues page:",t),e.innerHTML='<div class="container page"><p>Could not load issues. Please try again later.</p></div>'}}import nn from"fuse.js";var be=null,tt=[];function on(e){return e&&new DOMParser().parseFromString(e,"text/html").body.textContent||""}async function an(){if(be)return;let{articles:e}=await S();tt=e.map(n=>{let o=[];return o.push(n.title),o.push(n.rawDescription),o.push(on(n.content)),n.tags&&o.push(n.tags.join(" ")),n.categories&&o.push(n.categories.join(" ")),n.writers&&n.writers.forEach(a=>{o.push(a.name),a.role&&o.push(a.role),a.bio&&o.push(a.bio)}),{...n,searchableText:o.join(" | ")}});let t={keys:[{name:"title",weight:.6},{name:"searchableText",weight:.4}],includeScore:!0,minMatchCharLength:2,threshold:.35,ignoreLocation:!0};be=new nn(tt,t)}async function oe(e){return await an(),be.search(e).map(n=>n.item)}function z(e,t=""){return`
        <div class="page-header">
            <h1>${e}</h1>
            ${t?`<p>${t}</p>`:""}
        </div>
    `}function _(e,t=""){return`
        <div class="container ${t}">
            ${e}
        </div>
    `}function W(e){let{id:t="",className:n="page",content:o=""}=e;return`
        <section ${t?`id="${t}"`:""} class="${n}">
            ${o}
        </section>
    `}var ye=[];function sn(e,t){let n=DOMPurify.sanitize(e),o=t.length>0?`Search results for '<span class="query">${n}</span>'`:`No results found for '<span class="query">${n}</span>'`,a=t.length===0?"Try searching for something else, or check out our latest articles.":"",s=T(t,D),r=_(z(o,a)+Oe(t.length>0,`
            ${j()}
            <div id="search-grid-container" class="article-grid">${s}</div>
        `));return W({className:"page article-grid-page search-results-page",content:r})}function rn(){let e=document.getElementById("sort-by"),t=document.getElementById("search-grid-container");!e||!t||e.addEventListener("change",n=>{let o=n.target.value,a=M(ye,o);t.innerHTML=DOMPurify.sanitize(T(a,D))})}async function nt(e,t){let n=decodeURIComponent(t);ye=await oe(n),e.innerHTML=DOMPurify.sanitize(sn(n,ye)),rn()}var V={email:"",isSubscribed:!1},ot=new Set;function at(){ot.forEach(e=>e(V))}function ae(e){V.email!==e&&(V.email=e,at())}function se(){V.isSubscribed||(V.isSubscribed=!0,at(),Z())}function re(e){ot.add(e),e(V)}function cn(){return`
        <section class="page subscribe-page">
            <div class="container">
                <div class="subscribe-content">
                    <h1>Join the ANDOVERVIEW community.</h1>
                    <p>Get the latest stories, features, and updates from our student journalists, sent straight to your inbox.</p>

                    <div id="form-container-page" class="form-container">
                        <form id="subscribe-form-page">
                            <input type="email" id="subscribe-email-page" placeholder="Enter your email address" required>
                            <button type="submit" class="button-subscribe">Subscribe</button>
                        </form>
                        <div id="subscribe-success-message-page" class="subscribe-success">
                            <span>Thank you for subscribing!</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    `}function ln(){if(!document.getElementById("form-container-page"))return;let t=document.getElementById("subscribe-form-page"),n=document.getElementById("subscribe-success-message-page"),o=document.getElementById("subscribe-email-page");re(a=>{o.value!==a.email&&(o.value=a.email),a.isSubscribed&&(t.classList.add("hidden"),n.classList.add("active"))}),o.addEventListener("input",a=>{ae(a.target.value)}),t.addEventListener("submit",a=>{a.preventDefault(),o.value&&o.checkValidity()&&se()})}function st(e){e.innerHTML=DOMPurify.sanitize(cn()),ln()}function rt(){return`
        <form id="contact-form" novalidate>
            ${ie({id:"contact-name",label:"Name (required)",type:"text",required:!0,warningMessage:"Please enter your name."})}
            ${ie({id:"contact-email",label:"Email (required)",type:"email",required:!0,warningMessage:"Please enter a valid email address."})}
            ${ie({id:"contact-website",label:"Website",type:"url",placeholder:"https://example.com",warningMessage:"Please enter a valid URL."})}
            ${ie({id:"contact-message",label:"Message (required)",type:"textarea",rows:5,required:!0,warningMessage:"Please enter your message."})}
            <button type="submit" class="button-primary">Send Message</button>
        </form>
    `}function ie(e){let{id:t,label:n,type:o="text",required:a=!1,placeholder:s="",rows:r,warningMessage:l}=e,c=o==="textarea"?`<textarea id="${t}" name="${t.replace("contact-","")}" rows="${r}" ${a?"required":""}></textarea>`:`<input type="${o}" id="${t}" name="${t.replace("contact-","")}" ${a?"required":""} ${s?`placeholder="${s}"`:""}>`;return`
        <div class="form-group">
            <label for="${t}">${n}</label>
            ${c}
            <span class="warning-message" data-warning-for="${t}">${l}</span>
        </div>
    `}function it(){return`
        <div class="contact-details-card">
            <div>
                <h3>Get in Touch</h3>
                <ul class="contact-info-list">
                    <li>
                        <img class="contact-icon" src="assets/icons/email.svg" alt="Email icon">
                        <a href="mailto:andoverview@andoverma.us">andoverview@andoverma.us</a>
                    </li>
                    <li>
                        <img class="contact-icon" src="assets/icons/location.svg" alt="Location icon">
                        <a href="${`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent("80 Shawsheen Road, Andover, MA 01810")}`}" target="_blank" rel="noopener noreferrer">
                            80 Shawsheen Road<br>Andover, MA 01810<br>USA
                        </a>
                    </li>
                </ul>
            </div>

            <div class="map-container">
                <iframe
                    class="map-iframe"
                    src="https://maps.google.com/maps?q=Andover%20High%20School%20MA&t=&z=15&ie=UTF8&iwloc=&output=embed"
                    allowfullscreen=""
                    loading="lazy"
                    referrerpolicy="no-referrer-when-downgrade"
                    title="Andover High School Location">
                </iframe>
            </div>
        </div>
    `}function K(e,t){let n=document.querySelector(`[data-warning-for="${e.id}"]`);n&&(n.textContent=t||n.dataset.defaultMessage,n.style.display="block"),e.classList.add("invalid")}function ct(e){e.querySelectorAll(".warning-message").forEach(t=>t.style.display="none"),e.querySelectorAll("input, textarea").forEach(t=>t.classList.remove("invalid"))}function lt(e){return/^\S+@\S+\.\S+$/.test(e)}function ce(e){return e.trim().length>0}function dn(){let e=`
        <div class="contact-form-wrapper">
            <h3>Send Us a Message</h3>
            <p>You can use this form if you want to submit your club for club of the month, write an article for the paper, ask us to cover a specific topic, write a letter to the editor, ask a question, or send us any other message.</p>

            <div id="contact-form-container">
                ${rt()}
                <div id="contact-success-message">
                    <div>
                        <h3>Thank You!</h3>
                        <p>Your message has been sent. We'll get back to you shortly.</p>
                    </div>
                </div>
            </div>
        </div>
    `,t=_(z("Contact Us","Letters to the editor and guest commentaries are encouraged; please email submissions to the following address. Don't hesitate to reach out!")+`<div class="contact-grid">
            ${e}
            ${it()}
        </div>`);return W({className:"page contact-page",content:t})}function un(){let e=document.getElementById("contact-form");if(!e)return;let t=document.getElementById("contact-form-container");e.addEventListener("submit",n=>{n.preventDefault();let o=!0;ct(e);let a=document.getElementById("contact-name"),s=document.getElementById("contact-email"),r=document.getElementById("contact-message");ce(a.value)||(K(a,"Please enter your name."),o=!1),ce(s.value)?lt(s.value)||(K(s,"Please enter a valid email address."),o=!1):(K(s,"Please enter your email address."),o=!1),ce(r.value)||(K(r,"Please enter your message."),o=!1),o&&t.classList.add("form-submitted")})}function dt(e){e.innerHTML=DOMPurify.sanitize(dn()),un()}var ut;function mn(){let n=`
${z("Write for Us","Join our staff or contribute as a guest writer.")}

<div class="write-content-wrapper">

<div class="opportunities-section">
<h2>Ways to Contribute</h2>
<div class="emoji-decoration">\u{1F4DD}</div>
<div class="emoji-decoration">\u{1F4F8}</div>
<div class="emoji-decoration">\u{1F4A1}</div>
<div class="emoji-decoration">\u{1F3A4}</div>
<div class="emoji-decoration">\u{1F3A8}</div>
<div class="emoji-decoration">\u{1F3C6}</div>
<div class="emoji-decoration">\u{1F4F0}</div>
<div class="emoji-decoration">\u{1F4AD}</div>
<div class="emoji-decoration">\u{1F3AC}</div>
<div class="emoji-decoration">\u{1F4C8}</div>
<div class="emoji-decoration">\u{1F30D}</div>
<div class="emoji-decoration">\u{1F389}</div>
</div>


<div class="about-description">
<h2>Join Our Staff</h2>
<p>Newspaper Productions is a course at Andover High School rather than a club, so the only way to join the staff is to sign up for the course during course selection or switch into it in the first few weeks of the school year. Newspaper Productions is a year-long half credit course that meets every Monday night from 5 p.m. to 7 p.m. Students have to attend almost every meeting to participate in the course.</p>

<h2>Guest Contributions</h2>
<p>If you want to write for us without joining the staff, we welcome guest articles, photos, and opinion columns. Please email us at <a href="mailto:andoverview@andoverma.us">andoverview@andoverma.us</a> for more information.</p>
<p>If you would like to contact us for other purposes such as placing an ad or to ask us to cover a specific issue, please email us or contact us through our <a href="#contact">contact page</a>. You can also contact us to have your club be Club of the Month.</p>

<h2>Editorial Guidelines</h2>
<p>The staff of ANDOVERVIEW reviews letters to the editor and guest commentaries and reserves the right to refuse material for reasons pertaining to length, clarity, libel, obscenity, copyright infringement, or material disruption to the educational process of Andover High School.</p>
</div>


<div class="write-contact-callout">
<div class="callout-content">
<h3>Ready to Get Started?</h3>
<p>Reach out to us and let's discuss your ideas!</p>
<div class="callout-actions">
<a href="mailto:andoverview@andoverma.us" class="contact-btn primary">Email Us</a>
<a href="#contact" class="contact-btn secondary">Contact Page</a>
</div>
</div>
</div>

</div>
`;return W({className:"page write-for-us-page",content:_(n)})}function mt(){if("ontouchstart"in window||navigator.maxTouchPoints>0)return;let t=document.querySelector(".opportunities-section");if(!t)return;let n=t.querySelectorAll(".emoji-decoration"),o=n.length,a=t.offsetWidth/2,s=t.offsetHeight/2,r=a*.85,l=s*.75,i=2*Math.PI/o;n.forEach((c,d)=>{let p=d*i,h=a+r*Math.cos(p),g=s+l*Math.sin(p);c.style.left=`${h-c.offsetWidth/2}px`,c.style.top=`${g-c.offsetHeight/2}px`,c.style.animationDelay=`${d*.2}s`})}function pn(){if("ontouchstart"in window||navigator.maxTouchPoints>0)return;let t=document.querySelectorAll(".emoji-decoration"),n=document.querySelector(".main-header"),o=11;t.forEach(a=>{let s=!1,r=!1,l,i,c,d,p=0,h;a.hideBubbleTimeout=null,a.addEventListener("mousedown",g),a.addEventListener("touchstart",g,{passive:!1}),a.addEventListener("click",y);function g(f){if(f.type==="mousedown"&&f.button!==0)return;f.preventDefault(),s=!0,r=!1,a.classList.add("dragging"),o++,a.style.zIndex=o;let v=f.type==="mousedown"?f.clientX:f.touches[0].clientX,w=f.type==="mousedown"?f.clientY:f.touches[0].clientY;l=v,i=w,c=a.offsetLeft,d=a.offsetTop,document.addEventListener("mousemove",u),document.addEventListener("mouseup",m),document.addEventListener("touchmove",u,{passive:!1}),document.addEventListener("touchend",m)}function u(f){if(!s)return;a.speechBubble&&(a.speechBubble.remove(),a.speechBubble=null,clearTimeout(a.hideBubbleTimeout)),f.preventDefault(),r=!0;let v=f.type==="mousemove"?f.clientX:f.touches[0].clientX,w=f.type==="mousemove"?f.clientY:f.touches[0].clientY,L=v-l,G=w-i,q=c+L,E=d+G,Q=n.offsetHeight,A=a.offsetParent.getBoundingClientRect();A.top+E<Q&&(E=Q-A.top),a.style.left=`${q}px`,a.style.top=`${E}px`,a.style.right="auto",a.style.bottom="auto"}function m(){s&&(s=!1,a.classList.remove("dragging"),document.removeEventListener("mousemove",u),document.removeEventListener("mouseup",m),document.removeEventListener("touchmove",u),document.removeEventListener("touchend",m),r&&setTimeout(()=>{r=!1},100))}function y(f){s||r||(p++,clearTimeout(h),p>=5?$(a,p):h=setTimeout(()=>{p=0},3e3))}function $(f,v){let w,L="mild";v<=7?(w="Why do you keep doing that?",L="mild"):v<=12?(w="Seriously, stop clicking me!",L="moderate"):v<=18?(w="I SAID STOP CLICKING!!!",L="angry"):v<=25?(w="LEAVE ME ALONE!!!!!!",L="furious"):(w="...",L="given-up");let G,q=A=>{window.removeEventListener("scroll",G),A&&A.parentNode&&(A.classList.remove("show"),setTimeout(()=>{A.parentNode&&A.remove(),f.speechBubble===A&&(f.speechBubble=null)},300))};if(f.speechBubble&&f.speechBubble.dataset.anger===L){clearTimeout(f.hideBubbleTimeout);let A=L==="given-up"?1e3:L==="furious"?4e3:3e3;f.hideBubbleTimeout=setTimeout(()=>q(f.speechBubble),A);return}f.speechBubble&&(clearTimeout(f.hideBubbleTimeout),q(f.speechBubble));let E=document.createElement("div");E.className="emoji-speech-bubble",E.textContent=w,E.dataset.anger=L,E.style.left=`${f.offsetLeft+f.offsetWidth/2}px`,E.style.top=`${f.offsetTop-60}px`,f.offsetParent.appendChild(E),f.speechBubble=E,setTimeout(()=>E.classList.add("show"),10),G=()=>q(E),window.addEventListener("scroll",G,{once:!0});let Q=L==="given-up"?1e3:L==="furious"?4e3:3e3;f.hideBubbleTimeout=setTimeout(()=>q(E),Q)}})}function pt(e){e.innerHTML=DOMPurify.sanitize(mn()),setTimeout(()=>{mt(),pn()},100),"ontouchstart"in window||navigator.maxTouchPoints>0||window.addEventListener("resize",()=>{clearTimeout(ut),ut=setTimeout(mt,250)})}function Y(e){e.querySelectorAll(".password-toggle-btn").forEach(n=>{n.addEventListener("click",()=>{let o=n.previousElementSibling,a=n.querySelector("img");o.type==="password"?(o.type="text",a.src="assets/icons/eye.svg",n.setAttribute("aria-label","Hide password")):(o.type="password",a.src="assets/icons/eye-slash.svg",n.setAttribute("aria-label","Show password"))})})}function fn(){return`
        <section class="auth-page">
            <div class="auth-form-container">
                <h1>Log In</h1>
                <p class="subtitle">Don't have an account? <a href="#signup">Sign up</a></p>
                <form id="login-form" class="auth-form">
                    <div class="form-group">
                        <label for="username">Username</label>
                        <input type="text" id="username" name="username" required autocomplete="username">
                    </div>
                    <div class="form-group">
                        <label for="password">Password</label>
                        <div class="password-input-wrapper">
                            <input type="password" id="password" name="password" required autocomplete="current-password">
                            <button type="button" class="password-toggle-btn" aria-label="Show password">
                                <img src="assets/icons/eye-slash.svg" alt="Toggle password visibility">
                            </button>
                        </div>
                    </div>
                    <button id="login-submit-btn" type="submit">Log In</button>
                </form>
            </div>
        </section>
    `}function hn(){let e=document.getElementById("login-form"),t=document.getElementById("login-submit-btn");e&&(e.addEventListener("submit",async n=>{n.preventDefault(),t.disabled=!0,t.textContent="Logging In...";let o=e.username.value,a=e.password.value,s=await ze(o,a);if(s.success){k("Successfully logged in!");let r=sessionStorage.getItem("returnToAfterAuth")||location.hash||"#",l=sessionStorage.getItem("scrollPositionBeforeAuth");sessionStorage.removeItem("returnToAfterAuth"),sessionStorage.removeItem("scrollPositionBeforeAuth"),location.hash=r,l&&setTimeout(()=>{window.scrollTo(0,parseInt(l))},100)}else b(s.error||"An unknown error occurred."),t.disabled=!1,t.textContent="Log In"}),Y(e))}function ft(e){e.innerHTML=DOMPurify.sanitize(fn()),hn()}function gn(){return`
        <section class="auth-page">
            <div class="auth-form-container">
                <h1>Create Account</h1>
                <p class="subtitle">Already have an account? <a href="#login">Log in</a></p>
                <form id="signup-form" class="auth-form">
                    <div class="form-group">
                        <label for="username">Username</label>
                        <input type="text" id="username" name="username" required autocomplete="username">
                    </div>
                    <div class="form-group">
                        <label for="password">Password (min. 6 characters)</label>
                        <div class="password-input-wrapper">
                            <input type="password" id="password" name="password" required minlength="6" autocomplete="new-password">
                            <button type="button" class="password-toggle-btn" aria-label="Show password">
                                <img src="assets/icons/eye-slash.svg" alt="Toggle password visibility">
                            </button>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="confirm-password">Confirm Password</label>
                        <div class="password-input-wrapper">
                            <input type="password" id="confirm-password" name="confirm-password" required minlength="6" autocomplete="new-password">
                            <button type="button" class="password-toggle-btn" aria-label="Show password">
                                <img src="assets/icons/eye-slash.svg" alt="Toggle password visibility">
                            </button>
                        </div>
                    </div>
                    <button id="signup-submit-btn" type="submit">Sign Up</button>
                </form>
            </div>
        </section>
    `}function vn(){let e=document.getElementById("signup-form"),t=document.getElementById("signup-submit-btn");e&&(e.addEventListener("submit",async n=>{n.preventDefault(),t.disabled=!0,t.textContent="Signing Up...";let o=e.username.value,a=e.password.value,s=e["confirm-password"].value;if(a!==s){b("Passwords do not match."),t.disabled=!1,t.textContent="Sign Up";return}let r=await _e(o,a);if(r.success){k("Account created successfully!");let l=sessionStorage.getItem("returnToAfterAuth")||location.hash||"#",i=sessionStorage.getItem("scrollPositionBeforeAuth");sessionStorage.removeItem("returnToAfterAuth"),sessionStorage.removeItem("scrollPositionBeforeAuth"),location.hash=l,i&&setTimeout(()=>{window.scrollTo(0,parseInt(i))},100)}else b(r.error||"An unknown error occurred."),t.disabled=!1,t.textContent="Sign Up"}),Y(e))}function ht(e){e.innerHTML=DOMPurify.sanitize(gn()),vn()}function Ce(e){let t=te(e),o=new DOMParser().parseFromString(t,"text/html").body.firstChild,a=document.querySelector(".account-header .account-avatar");a&&o&&a.parentNode.replaceChild(o.cloneNode(!0),a);let s=document.getElementById("avatar-display-container");s&&o&&(s.innerHTML="",s.appendChild(o))}function O(e,t,n){return e===1?t:n}function we(e){let t=e.writers&&e.writers.length>0?`By ${e.writers.map(o=>o.name).join(", ")}`:"";return`
        <div class="account-article-card">
            <a href="#single-article-page/${e.id}">
                <img src="${e.image||"assets/icons/placeholder-image.png"}" alt="">
            </a>
            <div class="account-article-info">
                <div class="category">${e.category}</div>
                <h3><a href="#single-article-page/${e.id}">${e.title}</a></h3>
                <div class="author">${t}</div>
            </div>
        </div>
    `}function gt(e,t,n,o){if(!e)return'<section class="page account-page"><div class="container"><p>Loading your dashboard...</p></div></section>';let{username:a,joinDate:s,stats:r,comments:l,customAvatar:i}=e,c=new Date(s).toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"}),d=a.split(" ").map(v=>v.charAt(0).toUpperCase()+v.slice(1).toLowerCase()).join(" "),p=te({username:a,customAvatar:i}),h=`<div class="empty-state"><p>You haven't shared your thoughts yet. Find an article and join the conversation!</p><a href="#articles-page-all" class="button-secondary">Browse Articles</a></div>`,g='<div class="empty-state"><p>Show your appreciation for an article by liking it!</p><a href="#articles-page-all" class="button-secondary">Find Articles to Like</a></div>',u='<div class="empty-state"><p>Save articles for later by bookmarking them.</p><a href="#articles-page-all" class="button-secondary">Browse Articles</a></div>',m=l.length>0?l.map(v=>`<li><div class="comment-item-content">${v.content}</div><p class="activity-item-meta">On <a href="#single-article-page/${v.article_id}">an article</a> \u2022 ${new Date(v.timestamp).toLocaleDateString()}</p></li>`).join(""):`<li>${h}</li>`,y=t.length>0?t.map(we).join(""):`<li>${g}</li>`,$=n.length>0?n.map(we).join(""):`<li>${u}</li>`,f=o.length>0?o.map(we).join(""):'<div class="empty-state"><p>The articles you read will appear here.</p></div>';return`
        <section class="page account-page">
            <div class="container">
                <header class="account-header">
                    ${p}
                    <div class="account-header-info">
                        <h1 id="account-welcome-heading">Welcome back, ${d}!</h1>
                        <p>Member since ${c}</p>
                    </div>
                </header>

                <div class="account-tabs">
                    <ul class="account-nav" id="account-nav">
                        <li><button class="account-nav-btn active" data-tab="dashboard">Dashboard</button></li>
                        <li><button class="account-nav-btn" data-tab="comments">My Comments</button></li>
                        <li><button class="account-nav-btn" data-tab="bookmarks">Bookmarked</button></li>
                        <li><button class="account-nav-btn" data-tab="likes">Liked</button></li>
                        <li><button class="account-nav-btn" data-tab="settings">Settings</button></li>
                    </ul>

                    <div class="account-tab-content">
                        <div id="dashboard-tab" class="tab-pane active">
                            <div class="account-card">
                                <h2>At a Glance</h2>
                                <div class="stats-grid">
                                    <div class="stat-item"><div class="stat-icon-wrapper"><div class="stat-icon" data-icon="view"></div></div><div class="stat-value">${r.articlesViewed}</div><div class="stat-label">${O(r.articlesViewed,"Article Viewed","Articles Viewed")}</div></div>
                                    <div class="stat-item"><div class="stat-icon-wrapper"><div class="stat-icon" data-icon="like"></div></div><div class="stat-value">${r.likes}</div><div class="stat-label">${O(r.likes,"Article Liked","Articles Liked")}</div></div>
                                    <div class="stat-item"><div class="stat-icon-wrapper"><div class="stat-icon" data-icon="bookmark"></div></div><div class="stat-value">${r.bookmarks}</div><div class="stat-label">${O(r.bookmarks,"Article Bookmarked","Articles Bookmarked")}</div></div>
                                    <div class="stat-item"><div class="stat-icon-wrapper"><div class="stat-icon" data-icon="comment"></div></div><div class="stat-value">${r.comments}</div><div class="stat-label">${O(r.comments,"Comment Made","Comments Made")}</div></div>
                                </div>
                            </div>
                            <div class="account-card"><h2>Jump Back In</h2><ul class="activity-list">${f}</ul></div>
                        </div>
                        <div id="comments-tab" class="tab-pane"><div class="account-card"><h2>My ${O(l.length,"Comment","Comments")}</h2><ul class="activity-list">${m}</ul></div></div>
                        <div id="bookmarks-tab" class="tab-pane"><div class="account-card"><h2>${O(n.length,"Bookmarked Article","Bookmarked Articles")}</h2><ul class="activity-list">${$}</ul></div></div>
                        <div id="likes-tab" class="tab-pane"><div class="account-card"><h2>${O(t.length,"Liked Article","Liked Articles")}</h2><ul class="activity-list">${y}</ul></div></div>

                        <div id="settings-tab" class="tab-pane">
                            <div class="account-card">
                                <h2>Account Settings</h2>

                                <div class="settings-section" id="avatar-section">
                                    <div class="settings-info">
                                        <h3>Profile Avatar</h3>
                                        <p>Upload a custom profile picture for your account.</p>
                                    </div>
                                    <div class="avatar-setting-container">
                                        <div id="avatar-display-container">
                                            ${te({username:a,customAvatar:i})}
                                        </div>
                                        <div class="avatar-actions">
                                            <div id="avatar-actions-default">
                                                <button class="button-secondary" id="change-avatar-btn">Change Photo</button>
                                                ${i?'<button class="button-secondary" id="remove-avatar-btn">Remove</button>':""}
                                            </div>
                                            <div id="avatar-actions-editing" style="display: none;">
                                                <button class="button-secondary" id="cancel-avatar-btn">Cancel</button>
                                                <button class="button-primary" id="save-avatar-btn">Save Changes</button>
                                            </div>
                                        </div>
                                    </div>
                                    <form id="avatar-form" style="display: none;">
                                        <input type="file" id="avatar-file" name="avatar" accept="image/jpeg,image/png">
                                    </form>
                                </div>

                                <div class="settings-section" data-section="username">
                                    <div class="settings-info">
                                        <h3>Username</h3>
                                        <p>Your current username is <strong>${a}</strong>.</p>
                                    </div>
                                    <div class="settings-actions">
                                        <button class="button-secondary change-btn" data-form-type="username">Change</button>
                                    </div>
                                    <form class="edit-form" id="username-form">
                                        <div class="form-group">
                                            <label for="new-username">New Username</label>
                                            <input type="text" id="new-username" name="new-username" value="${a}" required minlength="3">
                                        </div>
                                        <div class="edit-form-actions">
                                            <button type="button" class="button-secondary cancel-btn" data-form-type="username">Cancel</button>
                                            <button type="submit" class="button-primary">Save Changes</button>
                                        </div>
                                    </form>
                                </div>

                                <div class="settings-section" data-section="password">
                                    <div class="settings-info"><h3>Password</h3><p>Update your password regularly to keep your account secure.</p></div>
                                    <div class="settings-actions"><button class="button-secondary change-btn" data-form-type="password">Change</button></div>
                                    <form class="edit-form" id="password-form">
                                        <input type="hidden" name="username" value="${a}" autocomplete="username">
                                        <div class="form-group">
                                            <label for="current-password">Current Password</label>
                                            <div class="password-input-wrapper">
                                                <input type="password" id="current-password" name="current-password" required autocomplete="current-password">
                                                <button type="button" class="password-toggle-btn" aria-label="Show password">
                                                    <img src="assets/icons/eye-slash.svg" alt="Toggle password visibility">
                                                </button>
                                            </div>
                                        </div>
                                        <div class="form-group">
                                            <label for="new-password">New Password</label>
                                            <div class="password-input-wrapper">
                                                <input type="password" id="new-password" name="new-password" required minlength="6" autocomplete="new-password">
                                                <button type="button" class="password-toggle-btn" aria-label="Show password">
                                                    <img src="assets/icons/eye-slash.svg" alt="Toggle password visibility">
                                                </button>
                                            </div>
                                        </div>
                                        <div class="form-group">
                                            <label for="confirm-password">Confirm New Password</label>
                                            <div class="password-input-wrapper">
                                                <input type="password" id="confirm-password" name="confirm-password" required minlength="6" autocomplete="new-password">
                                                <button type="button" class="password-toggle-btn" aria-label="Show password">
                                                    <img src="assets/icons/eye-slash.svg" alt="Toggle password visibility">
                                                </button>
                                            </div>
                                        </div>
                                        <div class="edit-form-actions">
                                            <button type="button" class="button-secondary cancel-btn" data-form-type="password">Cancel</button>
                                            <button type="submit" class="button-primary">Save Changes</button>
                                        </div>
                                    </form>
                                </div>

                                <div class="settings-section">
                                    <div class="settings-info">
                                        <h3>Log Out</h3>
                                        <p>You will be returned to the home page.</p>
                                    </div>
                                    <div class="settings-actions">
                                        <button id="logout-btn" class="button-secondary settings-btn">
                                            <img src="assets/icons/logout.svg" alt="" />
                                            <span>Log Out</span>
                                        </button>
                                    </div>
                                </div>

                                <div class="settings-section danger-zone">
                                    <div class="settings-info">
                                        <h3>Delete Account</h3>
                                        <p>Permanently delete your account and all associated data. This action is irreversible.</p>
                                    </div>
                                    <div class="settings-actions">
                                        <button id="delete-account-btn" class="button-primary settings-btn">
                                            <img src="assets/icons/delete.svg" alt="" />
                                            <span>Delete My Account</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    `}function bn(){let e=document.getElementById("username-form");e&&e.addEventListener("submit",async p=>{p.preventDefault();let h=document.getElementById("new-username").value,g=await Le(h);if(g.success){k("Username updated successfully!"),pe(g.user),H();let u=g.user.username.split(" ").map(m=>m.charAt(0).toUpperCase()+m.slice(1).toLowerCase()).join(" ");document.getElementById("account-welcome-heading").textContent=`Welcome back, ${u}!`,Ce(g.user),document.querySelector('[data-section="username"] p strong').textContent=g.user.username,document.querySelector('[data-section="username"]').classList.remove("is-editing")}else b(g.error)});let t=document.getElementById("password-form");if(t&&(t.addEventListener("submit",async p=>{p.preventDefault();let h=document.getElementById("current-password").value,g=document.getElementById("new-password").value,u=document.getElementById("confirm-password").value;if(g!==u){b("New passwords do not match.");return}let m=await ke(h,g);m.success?(k("Password updated successfully!"),t.reset(),document.querySelector('[data-section="password"]').classList.remove("is-editing")):b(m.error)}),Y(t)),!document.getElementById("avatar-section"))return;let o=document.getElementById("avatar-file"),a=document.getElementById("avatar-display-container"),s=document.getElementById("change-avatar-btn"),r=document.getElementById("cancel-avatar-btn"),l=document.getElementById("save-avatar-btn"),i=document.getElementById("avatar-actions-default"),c=document.getElementById("avatar-actions-editing"),d=a.innerHTML;s.addEventListener("click",()=>o.click()),o.addEventListener("change",p=>{let h=p.target.files[0];if(!h)return;if(h.size>2*1024*1024){b("File size must be less than 2MB"),o.value="";return}let g=new FileReader;g.onload=u=>{a.innerHTML="";let m=document.createElement("img");m.src=u.target.result,m.alt="New avatar preview",m.className="avatar avatar--large account-avatar",a.appendChild(m),i.style.display="none",c.style.display="flex"},g.readAsDataURL(h)}),r.addEventListener("click",()=>{let h=new DOMParser().parseFromString(d,"text/html").body.firstChild;a.innerHTML="",h&&a.appendChild(h),o.value="",i.style.display="flex",c.style.display="none"}),l.addEventListener("click",async()=>{let p=new FormData,h=o.files[0];if(!h){b("Please select an image file first.");return}p.append("avatar",h);try{let g=await fetch("/api/account/avatar",{method:"POST",body:p}),u=await g.json();if(g.ok){k("Avatar updated successfully!");let m={...R(),custom_avatar:u.avatarUrl};pe(m),H(),Ce(m),d=document.getElementById("avatar-display-container").innerHTML,r.click(),document.getElementById("remove-avatar-btn")||(i.insertAdjacentHTML("beforeend",'<button class="button-secondary" id="remove-avatar-btn">Remove</button>'),vt())}else b(u.error||"Failed to upload avatar."),r.click()}catch{b("Failed to upload avatar. Please try again."),r.click()}})}function vt(){let e=document.getElementById("avatar-actions-default");e&&e.addEventListener("click",async t=>{if(t.target.id!=="remove-avatar-btn")return;let n=t.target;if(confirm("Are you sure you want to remove your custom avatar?"))try{let o=await fetch("/api/account/avatar",{method:"DELETE"}),a=await o.json();if(o.ok){k("Custom avatar removed!");let s=R();s&&(s.custom_avatar=null),H(),Ce(s),n.remove()}else b(a.error||"Failed to remove avatar")}catch{b("Failed to remove avatar. Please try again.")}})}function yn(){let e=document.getElementById("account-nav");e&&e.addEventListener("click",o=>{let a=o.target.closest(".account-nav-btn");if(!a)return;e.querySelectorAll(".account-nav-btn").forEach(r=>r.classList.remove("active")),a.classList.add("active");let s=`${a.dataset.tab}-tab`;document.querySelectorAll(".tab-pane").forEach(r=>{r.classList.toggle("active",r.id===s)})}),document.getElementById("settings-tab")?.addEventListener("click",o=>{let a=o.target.closest(".change-btn");a&&a.closest(".settings-section").classList.add("is-editing");let s=o.target.closest(".cancel-btn");s&&s.closest(".settings-section").classList.remove("is-editing")});let t=document.getElementById("logout-btn");t&&t.addEventListener("click",Ve);let n=document.getElementById("delete-account-btn");n&&n.addEventListener("click",async()=>{let o=prompt('This action is irreversible. To confirm, please type "DELETE" in the box below.');o==="DELETE"?await Me()?(k("Your account has been permanently deleted."),setTimeout(()=>location.reload(),1500)):b("Could not delete account. Please try again."):o!==null&&b("Deletion cancelled. Confirmation text did not match.")}),bn(),vt()}async function bt(e){if(!F()){location.hash="#login";return}e.innerHTML=DOMPurify.sanitize(gt(null));let[t,n]=await Promise.all([Ie(),S()]);if(!t||t.error){b("Could not load account data. Please log in again."),location.hash="#login";return}let o=i=>{let c=new Set(i);return n.articles.filter(d=>c.has(d.id)).sort((d,p)=>new Date(p.date)-new Date(d.date))},a=o(t.likedArticleIds),s=o(t.bookmarkedArticleIds),r=[...t.viewedArticleIds].reverse().slice(0,4),l=o(r);e.innerHTML=DOMPurify.sanitize(gt(t,a,s,l)),yn()}var C=document.getElementById("main-content"),yt=document.getElementById("footer-cta"),wt=document.getElementById("news-ticker-container"),wn={"home-page":()=>Ue(C),"about-page":()=>je(C),contact:()=>dt(C),"write-for-us":()=>pt(C),"articles-page-all":()=>B(C,"all","category"),"articles-page-community":()=>B(C,"community","category"),"articles-page-sports":()=>B(C,"sports","category"),"articles-page-arts":()=>B(C,"arts","category"),"articles-page-reviews":()=>B(C,"reviews","category"),"articles-page-opinion":()=>B(C,"opinion","category"),"articles-page-editorial":()=>B(C,"editorial","category"),"articles-page-letter-to-the-editor":()=>B(C,"Letter to the Editor","category"),"issues-page":()=>et(C),subscribe:()=>st(C),login:()=>ft(C),signup:()=>ht(C),account:()=>bt(C),search:e=>nt(C,e),"single-article-page":e=>Je(C,e),author:e=>B(C,e,"author")};function Cn(e){let t=e.substring(1),[n,...o]=t.split("/"),a=o.join("/");return{path:n||"home-page",param:a}}function Ln(e){document.querySelectorAll(".main-nav a.nav-link").forEach(n=>{let o=n.getAttribute("href").substring(1),a=o===e;e==="home-page"&&o===""&&(a=!0),(e==="articles-page-editorial"||e==="articles-page-letter-to-the-editor")&&o==="articles-page-opinion"&&(a=!0),e==="articles-page-reviews"&&o==="articles-page-arts"&&(a=!0),(e==="contact"||e==="write-for-us")&&o==="about-page"&&(a=!0),n.classList.toggle("active-link",a)})}async function Ct(){let{path:e,param:t}=Cn(location.hash),n=location.hash;if(e==="login"||e==="signup"){let a=sessionStorage.getItem("previousHash")||"#";a!=="#login"&&a!=="#signup"&&(sessionStorage.setItem("returnToAfterAuth",a),sessionStorage.setItem("scrollPositionBeforeAuth",window.scrollY.toString()))}else sessionStorage.setItem("previousHash",n);if(yt){let a=["subscribe","login","signup","contact","account"];yt.classList.toggle("hidden",a.includes(e))}wt&&(wt.style.display=e==="home-page"?"flex":"none");let o=wn[e];if(o)await o(t);else{location.hash="#";return}Ln(e),window.scrollTo(0,0)}function Lt(){window.addEventListener("hashchange",Ct),Ct()}function kt(){let e=document.getElementById("staff-modal"),t=document.getElementById("modal-close-btn"),n=document.getElementById("modal-body-content"),o=r=>`
        <img src="${r.image}" alt="${r.name}" class="modal-img">
        <div class="modal-bio">
            <h2>${r.name}</h2>
            <h4>${r.role}</h4>
            <p>${r.bio}</p>
        </div>
    `,a=r=>{let l=DOMPurify.sanitize(o(r));for(;n.firstChild;)n.removeChild(n.firstChild);let c=new DOMParser().parseFromString(l,"text/html");Array.from(c.body.children).forEach(d=>{n.appendChild(d)}),e.classList.add("active"),document.body.style.overflow="hidden"},s=()=>{e.classList.remove("active"),document.body.style.overflow=""};return document.getElementById("main-content").addEventListener("click",async r=>{let l=r.target.closest(".staff-card");if(l){let i=l.dataset.name,{staff:c}=await S(),d=c.find(p=>p.name===i);d&&a(d)}}),t.addEventListener("click",s),e.addEventListener("click",r=>{r.target===e&&s()}),s}function kn(e,t=300){let n;return(...o)=>{clearTimeout(n),n=setTimeout(()=>{e.apply(this,o)},t)}}function $t(){let e=document.getElementById("search-icon-btn"),t=document.getElementById("header-search-container"),n=document.getElementById("header-search-form"),o=document.getElementById("header-search-input"),a=document.getElementById("header-search-clear-btn"),s=document.getElementById("header-search-go-btn"),r=document.getElementById("header-search-results"),l=-1,i=u=>{if(l=-1,r.innerHTML="",u.length===0){r.classList.remove("is-visible");return}let m=document.createDocumentFragment();u.slice(0,4).forEach(y=>{let $=document.createElement("li"),f=document.createElement("a");f.href=`#single-article-page/${y.id}`;let v=document.createElement("span");v.className="search-result-title",v.textContent=y.title;let w=document.createElement("span");w.className="search-result-category",w.textContent=y.category,f.appendChild(v),f.appendChild(w),$.appendChild(f),m.appendChild($)}),r.appendChild(m),r.classList.add("is-visible")},c=()=>{r.querySelectorAll("li").forEach((m,y)=>{m.classList.toggle("is-highlighted",y===l)})},d=async()=>{let u=o.value.trim();if(a.classList.toggle("visible",u.length>0),s.disabled=u.length===0,u.length<2){i([]);return}let m=await oe(u);i(m)},p=kn(d,300),h=()=>{document.body.classList.add("search-active"),o.focus()},g=()=>{document.body.classList.remove("search-active"),o.value="",i([]),a.classList.remove("visible"),s&&(s.disabled=!0)};return e.addEventListener("click",()=>{document.body.classList.contains("search-active")?g():h()}),o.addEventListener("input",p),o.addEventListener("keydown",u=>{let m=r.querySelectorAll("li");m.length!==0&&(u.key==="ArrowDown"?(u.preventDefault(),l=(l+1)%m.length,c()):u.key==="ArrowUp"?(u.preventDefault(),l=(l-1+m.length)%m.length,c()):u.key==="Enter"?l>-1&&(u.preventDefault(),m[l].querySelector("a").click()):u.key==="Escape"&&r.classList.remove("is-visible"))}),a.addEventListener("click",()=>{o.value="",d(),o.focus()}),n.addEventListener("submit",u=>{u.preventDefault();let m=o.value.trim();m&&(location.hash=`#search/${encodeURIComponent(m)}`,g())}),r.addEventListener("click",u=>{u.target.closest("a")&&setTimeout(g,50)}),document.body.addEventListener("click",u=>{t.contains(u.target)||r.classList.remove("is-visible")}),g}async function Et(e,t){if("ontouchstart"in window||navigator.maxTouchPoints>0){if(!window.open(e,"_blank"))throw alert("Your browser blocked the download, you freaking loser. Please allow pop-ups for this site and try again."),new Error("Popup blocked by browser");return}try{let o=await fetch(e);if(!o.ok)throw new Error(`Network response was not ok: ${o.statusText}`);let a=await o.blob(),s=window.URL.createObjectURL(a),r=document.createElement("a");r.style.display="none",r.href=s,r.download=t,document.body.appendChild(r),r.click(),document.body.removeChild(r),window.URL.revokeObjectURL(s)}catch(o){throw console.error("Download failed:",o),alert("Could not download the file. Please try again later."),o}}function $n(){if(!document.getElementById("footer-form-container"))return;let t=document.getElementById("subscribe-form-footer"),n=document.getElementById("subscribe-success-message-footer"),o=document.getElementById("subscribe-email-footer");re(a=>{o.value!==a.email&&(o.value=a.email),a.isSubscribed&&(t.classList.add("hidden"),n.classList.add("active"))}),o.addEventListener("input",a=>{ae(a.target.value)}),t.addEventListener("submit",a=>{a.preventDefault(),o.value&&o.checkValidity()&&se()})}function En(){let e=document.querySelector(".main-nav"),t=document.querySelector(".main-header");!e||!t||e.addEventListener("click",n=>{let o=document.querySelector(".mobile-toggle");if(getComputedStyle(o).display!=="none")if(n.target.matches(".submenu-toggle")){n.preventDefault();let a=n.target.closest(".dropdown");if(a){let s=a.classList.toggle("is-open");n.target.textContent=s?"\u2212":"+",n.target.setAttribute("aria-expanded",s)}}else n.target.closest("a")&&(t.classList.remove("nav-open"),e.querySelectorAll(".dropdown.is-open").forEach(a=>{a.classList.remove("is-open");let s=a.querySelector(".submenu-toggle");s&&(s.textContent="+",s.setAttribute("aria-expanded","false"))}))})}function Sn(){let e=null,t={passive:!0};document.body.addEventListener("touchstart",o=>{let a=o.target.closest(".article-card-linkable");a&&(e=a,e.classList.add("card-is-active"))},t);let n=()=>{e&&(e.classList.remove("card-is-active"),e=null)};document.body.addEventListener("touchend",n),document.body.addEventListener("touchcancel",n)}function Tn(e,t){document.body.addEventListener("click",async a=>{let s=a.target.closest(".download-btn");if(s){if(a.preventDefault(),s.disabled)return;let i=s.dataset.url,c=s.dataset.filename,d=s.textContent;s.textContent="Downloading...",s.disabled=!0;try{await Et(i,c)}catch(p){console.error("Download failed:",p.message)}finally{s.textContent=d,s.disabled=!1}return}let r=a.target.closest(".copy-link-btn");if(r){a.preventDefault(),navigator.clipboard.writeText(window.location.href).then(()=>{r.classList.add("is-copied"),setTimeout(()=>{r.classList.remove("is-copied")},2e3)}).catch(i=>{console.error("Failed to copy link: ",i),alert("Failed to copy link.")});return}let l=a.target.closest(".article-card-linkable");if(l){if(window.getSelection().toString().length>0||a.target.closest("a"))return;let i=l.querySelector(".main-article-link");i&&(location.hash=i.hash)}});let n=document.querySelector(".main-header");document.querySelector(".mobile-toggle").addEventListener("click",()=>n.classList.toggle("nav-open")),document.addEventListener("keydown",a=>{a.key==="Escape"&&(e(),t())})}async function xn(){await We();let e=kt(),t=$t();$n(),Tn(e,t),En(),Sn(),Lt()}document.addEventListener("DOMContentLoaded",xn);
