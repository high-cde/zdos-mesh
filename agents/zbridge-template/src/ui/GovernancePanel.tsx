import React, { useEffect, useState } from "react";

export const GovernancePanel = ({ network, address }) => {
  if (network !== "polygon") return <p>Governance disponibile solo su Polygon.</p>;

  const [govBalance, setGovBalance] = useState("0");
  const [proposals, setProposals] = useState([]);

  useEffect(() => {
    if (!address) return;
    (async () => {
      const bal = await window.zbridge.request({
        method: "zbridge_getGovernanceBalance",
        params: { address }
      });
      setGovBalance(bal);
    })();
  }, [address]);

  useEffect(() => {
    (async () => {
      const list = await window.zbridge.request({
        method: "zbridge_listProposals"
      });
      setProposals(list);
    })();
  }, []);

  return (
    <div>
      <h2>Governance DAO</h2>
      <p><b>Balance governance:</b> {govBalance}</p>
      <h3>Proposals</h3>
      {proposals.map(p => (
        <div key={p.id} style={{ border: "1px solid #ccc", padding: 10 }}>
          <p><b>{p.title}</b></p>
          <button onClick={() => window.zbridge.request({
            method: "zbridge_voteProposal",
            params: { proposalId: p.id, support: true }
          })}>
            Vota
          </button>
        </div>
      ))}
    </div>
  );
};
