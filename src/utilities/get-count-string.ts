import interpolate from 'utilities/interpolate';

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
  const template = count === 1 ? singularString : otherString;
  return interpolate(template, { count: count.toLocaleString() });
}
