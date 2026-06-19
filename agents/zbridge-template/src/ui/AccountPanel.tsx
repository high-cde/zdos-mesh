import React, { useEffect, useState } from "react";

export const AccountPanel = ({ address, network }) => {
  const [balance, setBalance] = useState("...");

  useEffect(() => {
    (async () => {
      const bal = await window.zbridge.request({
        method: "zbridge_getBalance",
        params: { network, address }
      });
      setBalance(bal);
    })();
  }, [address, network]);

  return (
    <div>
      <h2>Account</h2>
      <p><b>Address:</b> {address}</p>
      <p><b>Balance:</b> {balance}</p>
    </div>
  );
};
