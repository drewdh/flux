export enum PlaceholderFormat {
  DoubleCurlyBracket,
}

export default function interpolate(
  template: string,
  values: Record<string, string>,
  placeholder: PlaceholderFormat = PlaceholderFormat.DoubleCurlyBracket
): string {
  let result = template;
  Object.keys(values).forEach((key) => {
    result = result.replace(`{{${key}}}`, values[key]);
  });
  return result;
}
