async function loadServices(){
  const res = await fetch("/core/services.json");
  const list = await res.json();
  for(const svc of list){
    await import(`/services/${svc.id}/service.js`);
    ZDOS.log("Loaded", svc.id);
  }
}
window.ZDOS.loadServices = loadServices;
