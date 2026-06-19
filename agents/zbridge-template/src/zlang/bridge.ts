export function createZLangBridge() {
  return {
    async requestAccounts() {
      return ["zbridge:demo-account"];
    }
  };
}
