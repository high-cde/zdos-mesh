class ZBus {
  constructor(){ this.handlers = {}; }
  on(t,h){ (this.handlers[t] ||= []).push(h); }
  emit(t,p){ (this.handlers[t]||[]).forEach(h=>h(p)); }
}
window.ZDOS.bus = new ZBus();
