import { useRef, useState, FormEventHandler } from "react";
import DangerButton from "@/components/DangerButton";

export default function ChargeForm({ className = "" }: { className?: string }) {
  return (
    <section className={`space-y-6 ${className}`}>
      <header>
        <h2 className="text-lg font-medium text-foreground">계좌 충전</h2>

        <p className="mt-1 text-sm text-secondary-foreground">
          죄송합니다. 현재 고객님의 지역에서는 사용할 수 있는 결제 방식이
          없습니다. 다른 결제 방법을 시도하시거나 문의해 주세요.
        </p>
      </header>
      <h2>현지 연계인정보</h2>
      <p className="!mt-2 text-sm">이메일:super998525@outlook.com</p>
      <p className="!mt-1 text-sm">전화번호:18341530157</p>
    </section>
  );
}
