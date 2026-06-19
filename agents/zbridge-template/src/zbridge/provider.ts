import { createRpcClient } from "../rpc/client";
import { createZLangBridge } from "../zlang/bridge";

export function createZBridgeProvider() {
  const rpc = createRpcClient();
  const zlang = createZLangBridge();

  return {
    async request({ method, params }) {
      switch (method) {
        case "zbridge_requestAccounts":
          return zlang.requestAccounts();
        case "zbridge_getBalance":
          return rpc.getBalance(params.network, params.address);
        case "zbridge_getGovernanceBalance":
          return rpc.getGovernanceBalance(params.address);
        case "zbridge_listProposals":
          return rpc.listProposals();
        case "zbridge_voteProposal":
          return rpc.voteProposal(params.proposalId, params.support);
        default:
          throw new Error("Metodo non supportato");
      }
    },
    on() {}
  };
}
