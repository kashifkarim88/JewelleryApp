import React, { useMemo } from "react";

const CODE128B_PATTERNS = [
    '212222', '222122', '222221', '121223', '121322', '131222', '122213', '122312', '132212', '221213',
    '221312', '231212', '112232', '122132', '122231', '113222', '123122', '123221', '223211', '221132',
    '221231', '213212', '223112', '312131', '311222', '321122', '321221', '312212', '322112', '322211',
    '212123', '212321', '232121', '111323', '131123', '131321', '112313', '132113', '132311', '211313',
    '231113', '231311', '112133', '112331', '132131', '113123', '113321', '133121', '313121', '211331',
    '231131', '213113', '213311', '213131', '311123', '311321', '331121', '312113', '312311', '332111',
    '314111', '221411', '431111', '111224', '111422', '121124', '121421', '141122', '141221', '112214',
    '112412', '122114', '122411', '142112', '142211', '241211', '221114', '413111', '241112', '134111',
    '111242', '121142', '121241', '114212', '124112', '124211', '411212', '421112', '421211', '212141',
    '214121', '412121', '111143', '111341', '131141', '114113', '114311', '411113', '411311', '113141',
    '114131', '311141', '411131', '211412', '211214', '211232', '2331112'
] as const;

interface Code128BarcodeProps {
  value: string;
}

export const Code128Barcode = ({ value }: Code128BarcodeProps) => {
  const encoded = useMemo(() => {
    const text = String(value || "").slice(0, 80);
    if (!text) return "";

    const codes = [104];
    let checksum = 104;

    for (let i = 0; i < text.length; i++) {
      const code = text.charCodeAt(i) - 32;
      if (code < 0 || code > 95) continue;
      codes.push(code);
      checksum += code * (i + 1);
    }

    codes.push(checksum % 103);
    codes.push(106);
    return codes.map((code) => CODE128B_PATTERNS[code]).join("");
  }, [value]);

  if (!encoded) return null;

  const bars: React.ReactElement[] = [];
  let x = 0;
  let black = true;

  for (let i = 0; i < encoded.length; i++) {
    const width = Number(encoded[i]);
    if (black) {
      bars.push(
        <rect key={i} x={x} y="0" width={width} height="38" fill="currentColor" />
      );
    }
    x += width;
    black = !black;
  }

  return (
    <svg
      viewBox={`0 0 ${x} 38`}
      className="w-[42mm] h-[11mm] text-black"
      preserveAspectRatio="none"
      aria-label={`Barcode ${value}`}
    >
      {bars}
    </svg>
  );
};
