import { ReactNode } from 'react';

export default function Wrapper({ children }: { children: ReactNode }) {
  return (
    <div className="relative w-full h-max my-auto flex items-center">
      <div className="flex flex-wrap justify-center w-full">{children}</div>
    </div>
  );
}
