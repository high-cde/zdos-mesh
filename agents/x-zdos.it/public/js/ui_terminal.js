(function(){
  const root = document.getElementById("zdos-terminal");
  root.innerHTML = `
    <div class="terminal-window">
      <div id="zdos-term-out"></div>
      <input id="zdos-term-in" autocomplete="off" />
    </div>`;
  const out = document.getElementById("zdos-term-out");
  const input = document.getElementById("zdos-term-in");

  function print(t){
    const d=document.createElement("div");
    d.textContent=t;
    out.appendChild(d);
  }

  input.addEventListener("keydown", e=>{
    if(e.key==="Enter"){
      const cmd=input.value; input.value="";
      print("> "+cmd);
      ZDOS.bus.emit("terminal:input", cmd);
    }
  });

  ZDOS.bus.on("terminal:output", print);
  ZDOS.bus.on("terminal:clear", ()=> out.innerHTML="");
})();
