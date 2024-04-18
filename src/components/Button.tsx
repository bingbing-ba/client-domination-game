import { ReactNode } from 'react';

type ButtonProps = {
  children: ReactNode;
  onClick?: () => void;
};

export function Button({ children, onClick }: ButtonProps) {
  return (
    <button
      type="button"
      className="mt-10 block w-full rounded-md bg-indigo-600 px-3 py-2 text-center text-lg font-semibold text-white shadow-sm hover:bg-indigo-500 h-12"
      onClick={onClick}
    >
      {children}
    </button>
  );
}
