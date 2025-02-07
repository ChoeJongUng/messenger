import { useRef, useState, FormEventHandler } from "react";
import DangerButton from "@/components/DangerButton";

export default function ChargeForm({ className = "" }: { className?: string }) {
  return (
    <section className={`space-y-6 ${className}`}>
      <header>
        <h2 className="text-lg font-medium text-foreground">계정 삭제</h2>

        <p className="mt-1 text-sm text-secondary-foreground">
          계정이 삭제되면 모든 리소스와 데이터가 영구적으로 삭제됩니다. 계정을
          삭제하기 전에 보관하려는 모든 데이터나 정보를 다운로드하세요.
        </p>
      </header>

      <DangerButton className="w-full">계정 삭제</DangerButton>
    </section>
  );
}
