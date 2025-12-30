// /utils/inspectSchema.js

export function inspectSchema(data) {
  if (!data || data.length === 0) return {};

  const sample = data[0];
  const schema = {};

  for (const key of Object.keys(sample)) {
    const value = sample[key];

    schema[key] = {
      type: typeof value,
      example: value,
      nullable: value === null || value === undefined
    };
  }

  return schema;
}
