const splitter = "-";

export function getMonthKey(date = new Date()): string {
  const prevMonthDate = new Date(date.getFullYear(), date.getMonth() - 1, 1);
  const year = prevMonthDate.getFullYear();
  const month = String(prevMonthDate.getMonth() + 1).padStart(2, "0");
  return `${year}${splitter}${month}`;
}

export function getDateTitle(monthKey: string): string {
  const key = monthKey.split(splitter);
  const date = new Date(Number(key[0]), Number(key[1]) - 1, 1);
  const formatter = new Intl.DateTimeFormat("ru-Ru", { month: "long", year: "numeric" });
  const output = formatter.format(date).replace(" г.", "").replace(/^./, (str) => str.toUpperCase());
  return output;
}
