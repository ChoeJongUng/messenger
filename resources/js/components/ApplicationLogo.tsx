import { ImgHTMLAttributes } from "react";

export default function ApplicationLogo(
  props: ImgHTMLAttributes<HTMLImageElement>,
) {
  return <img src="/images/tradelink.png" alt="" {...props} />;
}
