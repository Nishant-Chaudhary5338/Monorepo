import { useEffect, useState } from "react";

function useAccess(accessCheckCallback) {
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    // Fetch access data
    const accessData = JSON.parse(localStorage.getItem("access_data"));

    if (accessData) {
      // Execute the callback to check for access based on the provided condition
      const hasAccessCondition = accessCheckCallback(accessData);
      setHasAccess(hasAccessCondition);
    }
  }, [accessCheckCallback]);

  return hasAccess;
}

export default useAccess;


// Access check function for StockTransf
export const Stock_Transf_Access = (accessData) => {
  return accessData?.zv_web_AccType?.StockTransf === "true";
}

// Access check function for PmNotifSuper
export const Notif_Super_Access = (accessData) => {
  return accessData?.zv_web_AccType?.PmNotifSuper === "true";
}

export const Notif_Cr_Access = (accessData) => {
    return accessData?.zv_web_AccType?.PmNotifCr === "true";
}

export const Notif_Rep_Access = (accessData) => {
    return accessData?.zv_web_AccType?.PmNotifRep === "true";
}




