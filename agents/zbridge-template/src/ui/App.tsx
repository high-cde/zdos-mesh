import React, { useState } from "react";
import { NetworkSelector } from "./NetworkSelector";
import { AccountPanel } from "./AccountPanel";
import { GovernancePanel } from "./GovernancePanel";

export const App = () => {
  const [network, setNetwork] = useState("highbridge");
  const [address, setAddress] = useState<string | null>(null);

  const connect = async () => {
    const accs = await window.zbridge.request({ method: "zbridge_requestAccounts" });
    setAddress(accs[0]);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>ZBridge Wallet</h1>
      <NetworkSelector network={network} onChange={setNetwork} />
      {!address ? <button onClick={connect}>Connetti Wallet</button> : <AccountPanel address={address} network={network} />}
      <hr />
      <GovernancePanel network={network} address={address} />
    </div>
  );
};
