(function(){
  const id="terminal";
  function init(){
    ZDOS.log("Terminal ready");
    ZDOS.bus.on("terminal:input", handle);
  }
  function handle(cmd){
    let out="";
    switch(cmd.trim()){
      case "help": out="help, about, clear"; break;
      case "about": out="x‑ZDOS Web‑OS v1.0.0"; break;
      case "clear": ZDOS.bus.emit("terminal:clear"); return;
      default: out="Comando non riconosciuto";
    }
    ZDOS.bus.emit("terminal:output", out);
  }
  window.ZDOS.services[id]={init};
})();
