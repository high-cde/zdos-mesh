window.addEventListener("DOMContentLoaded", async ()=>{
  ZDOS.log("Booting...");
  await ZDOS.loadServices();
  Object.values(ZDOS.services).forEach(s=>s.init && s.init());
});
