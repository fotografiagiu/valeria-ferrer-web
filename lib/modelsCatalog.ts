type ModelActiveLike = { active?: boolean } | null | undefined;

export function isModelActive(model: ModelActiveLike): boolean {
  return model != null && model.active !== false;
}

export function filterActiveModels<T extends ModelActiveLike>(models: T[]): T[] {
  return models.filter(isModelActive);
}
