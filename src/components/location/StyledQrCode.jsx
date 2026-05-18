"use client";

import { useEffect, useRef } from "react";

export default function StyledQrCode({
  data,
  image = "/assets/images/logo_round.png",
  size = 280,
  label = "QR code",
  className = "",
}) {
  const qrRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    let qrCode;

    async function renderQrCode() {
      const { default: QRCodeStyling } = await import("qr-code-styling");

      if (cancelled || !qrRef.current) {
        return;
      }

      qrRef.current.innerHTML = "";

      qrCode = new QRCodeStyling({
        width: size,
        height: size,
        type: "svg",
        data,
        image,
        margin: 12,
        qrOptions: {
          errorCorrectionLevel: "H",
        },
        dotsOptions: {
          color: "#00563B",
          type: "rounded",
        },
        backgroundOptions: {
          color: "#FFF9F9",
        },
        cornersSquareOptions: {
          color: "#00563B",
          type: "extra-rounded",
        },
        cornersDotOptions: {
          color: "#E2CB91",
          type: "dot",
        },
        imageOptions: {
          crossOrigin: "anonymous",
          margin: 6,
          imageSize: 0.22,
          hideBackgroundDots: true,
        },
      });

      qrCode.append(qrRef.current);
    }

    renderQrCode();

    return () => {
      cancelled = true;
      qrCode = null;
    };
  }, [data, image, size]);

  return (
    <div
      ref={qrRef}
      aria-label={label}
      role="img"
      className={`flex items-center justify-center [&_svg]:h-full [&_svg]:w-full ${className}`}
    />
  );
}
