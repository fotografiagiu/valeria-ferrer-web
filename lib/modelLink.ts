type ModelLike = {
  slug?: string;
  id?: string;
  coverImageUrl?: string;
  image?: string;
  active?: boolean;
};

export function getModelSlug(model: ModelLike | null | undefined): string | null {
  const slug = model?.slug?.trim() || model?.id?.trim();
  return slug || null;
}

export function getModelProfilePath(model: ModelLike | null | undefined): string | null {
  const slug = getModelSlug(model);
  return slug ? `/models/${slug}` : null;
}

export function isValidCatalogModel(model: ModelLike | null | undefined): boolean {
  if (!getModelSlug(model)) return false;
  if (model?.active === false) return false;
  return Boolean(model?.coverImageUrl || model?.image);
}
