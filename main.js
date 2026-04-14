// main.js
// Завантажує та парсить CSV, експортує getData()

const App = (function(){
  let _data = null;

  // Простий CSV-парсер
  function parseCSV(text){
    const rows = text.trim().split(/\r?\n/);
    if(!rows.length) return [];

    const header = rows[0]
      .split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/)
      .map(h => h.replace(/^"|"$/g,'').trim());

    const out = [];

    for(let i=1;i<rows.length;i++){
      const line = rows[i];
      if(!line.trim()) continue;

      const values = line
        .split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/)
        .map(v => v.replace(/^"|"$/g,'').trim());

      const obj = {};

      header.forEach((h, idx) => {
        obj[h] = values[idx] === undefined ? '' : values[idx];
      });

      out.push(obj);
    }

    return out;
  }

  async function loadCSV(path = 'data/BK.csv'){
    if(_data) return _data;

    try{
      const r = await fetch(path, { cache: "no-store" });

      if(!r.ok) throw new Error('CSV not found');

      const txt = await r.text();
      _data = parseCSV(txt);

      return _data;
    }catch(e){
      console.error('Error loading CSV:', e);
      _data = [];
      return _data;
    }
  }

  function unique(arr){
    return [...new Set(arr)].filter(Boolean);
  }

  // 🔥 logout через сервер (HttpOnly cookie)
  async function logout(){
    try {
      await fetch("/api/logout", { method: "POST" });
    } catch (e) {
      console.error("Logout error:", e);
    }

    window.location.href = "/login.html";
  }

  return {
    loadCSV,
    getAll: () => _data,
    utils: { unique },
    logout // ← додали
  };
})();

window.App = App;