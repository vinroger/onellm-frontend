export default function NonIdealState({
  title,
  description,
  icon,
  additionalComponent,

  dark,
}: {
  title: React.ReactNode;
  description: React.ReactNode;
  icon?: React.ReactNode;
  additionalComponent?: React.ReactNode;
  dark?: boolean;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-w-full min-h-full text-center">
      {icon}
      <h3
        className={`mt-2 text-sm font-semibold text-neutral-${
          dark ? 100 : 900
        }`}
      >
        {title}
      </h3>
      <p className={`mt-1 text-sm text-neutral-${dark ? "400" : "500"}`}>
        {description}
      </p>
      {additionalComponent}
    </div>
  );
}
