import type { ReactNode } from 'react';

type PrototypeCardProps = {
  title: string;
  description: string;
  children?: ReactNode;
};

export function PrototypeCard({ title, description, children }: PrototypeCardProps) {
  return (
    <section className="rounded-xl border border-slate-700 bg-slate-800/70 p-5">
      <h2 className="text-lg font-medium">{title}</h2>
      <p className="mt-1 text-sm text-slate-300">{description}</p>
      {children ? <div className="mt-4">{children}</div> : null}
    </section>
  );
}
