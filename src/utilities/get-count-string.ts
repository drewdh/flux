interface GetCountStringOptions {
  singularString: string;
  otherString: string;
  count: number;
}

export default function getCountString({
  singularString,
  otherString,
  count,
}: GetCountStringOptions) {
  return (count === 1 ? singularString : otherString).replace('{{count}}', count.toLocaleString());
}
