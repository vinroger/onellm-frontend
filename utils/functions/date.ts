export function toHumanDateString(date: Date) {
  //   const date = new Date(dateString);
  const options: any = {
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };
  return new Intl.DateTimeFormat("en-US", options).format(date);
}
