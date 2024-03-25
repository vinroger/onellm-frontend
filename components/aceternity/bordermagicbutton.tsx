import React from "react";

function BorderMagicButton({
  children,
  ...props
}: {
  children: React.ReactNode;
  [key: string]: any;
}) {
  return (
    <button
      type="button"
      className="relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
      {...props}
    >
      <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
      <span className="inline-flex items-center justify-center w-full h-full px-3 py-1 text-sm font-medium text-white rounded-full cursor-pointer bg-slate-950 backdrop-blur-3xl">
        {children}
      </span>
    </button>
  );
}

export default BorderMagicButton;
