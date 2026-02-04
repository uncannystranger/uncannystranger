import { useEffect, useState } from 'react';

export const useDeviceTier = () => {
  const [isLowPower, setIsLowPower] = useState(false);

  useEffect(() => {
    if (typeof navigator === 'undefined') return;
    const deviceMemory = (navigator as any).deviceMemory as number | undefined;
    const hardwareConcurrency = navigator.hardwareConcurrency;
    const lowPower =
      (typeof deviceMemory === 'number' && deviceMemory <= 4) ||
      (typeof hardwareConcurrency === 'number' && hardwareConcurrency <= 4);
    setIsLowPower(lowPower);
  }, []);

  return { isLowPower };
};
