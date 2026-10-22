let products = [];
let activeCategory = "Tümü";
const money = n => new Intl.NumberFormat("tr-TR",{style:"currency",currency:"TRY",maximumFractionDigits:0}).format(n);
async function init(){
  const response = await fetch("products.json");
  products = await response.json();
  const categories = ["Tümü",...new Set(products.map(p=>p.category))];
  document.getElementById("filters").innerHTML = categories.map(c=>`<button class="filter ${c==="Tümü"?"active":""}" data-category="${c}">${c}</button>`).join("");
  document.getElementById("filters").addEventListener("click",e=>{
    const btn=e.target.closest("button[data-category]"); if(!btn)return;
    activeCategory=btn.dataset.category;
    document.querySelectorAll(".filter").forEach(b=>b.classList.toggle("active",b===btn));
    render();
  });
  document.getElementById("search").addEventListener("input",render);
  render();
}
function render(){
  const term=document.getElementById("search").value.trim().toLocaleLowerCase("tr-TR");
  const shown=products.filter(p=>(activeCategory==="Tümü"||p.category===activeCategory)&&p.name.toLocaleLowerCase("tr-TR").includes(term));
  document.getElementById("result-count").textContent=`${shown.length} ürün listeleniyor`;
  const grid=document.getElementById("product-grid");
  if(!shown.length){grid.innerHTML='<div class="empty-state">Aramanızla eşleşen ürün bulunamadı. Farklı bir kelime deneyin.</div>';return;}
  grid.innerHTML=shown.map(p=>`<article class="product-card">
    <div class="product-image"><img src="assets/${p.image}" alt="${p.name}" loading="lazy"><span class="product-category">${p.category}</span></div>
    <div class="product-info"><h3>${p.name}</h3><div class="product-bottom"><div><div class="price">${money(p.price)}</div><span class="unit">${p.unit==="metre"?"metre fiyatı":p.unit==="adet"?"adet fiyatı":p.unit}</span></div><button class="ask-link" data-product="${p.name}">Bilgi al ↗</button></div></div>
  </article>`).join("");
}
document.addEventListener("click",e=>{
  const b=e.target.closest("[data-product]"); if(!b)return;
  const name=b.dataset.product;
  const message=`Merhaba, "${name}" ürünü hakkında bilgi almak istiyorum. Güncel fiyat ve teslim süresini paylaşabilir misiniz?`;
  const url=`https://wa.me/?text=${encodeURIComponent(message)}`;
  window.open(url,"_blank","noopener");
});
init().catch(()=>{document.getElementById("product-grid").innerHTML='<div class="empty-state">Ürün kataloğu yüklenemedi. Lütfen sayfayı yenileyin.</div>';});
