export function createRpcClient() {
  return {
    async getBalance(network, address) {
      return "1000 (placeholder)";
    },
    async getGovernanceBalance(address) {
      return "42 GOV";
    },
    async listProposals() {
      return [{ id: 1, title: "Upgrade HighBridgeChain" }];
    },
    async voteProposal(id, support) {
      return true;
    }
  };
}
