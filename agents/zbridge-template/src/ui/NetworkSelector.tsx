import React from "react";

export const NetworkSelector = ({ network, onChange }) => (
  <div>
    <label>Network: </label>
    <select value={network} onChange={e => onChange(e.target.value)}>
      <option value="highbridge">HighBridgeChain</option>
      <option value="polygon">Polygon</option>
      <option value="bitcoin">Bitcoin</option>
      <option value="zcash">Zcash</option>
    </select>
  </div>
);
