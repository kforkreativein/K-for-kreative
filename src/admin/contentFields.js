export const HIDDEN_FIELDS = new Set(['emphasis'])

export const ICON_OPTIONS = ['portfolio', 'instagram', 'linkedin', 'whatsapp', 'email', 'x']

export const BRACKET_TEXT_KEYS = new Set(['quote'])

export const ASSET_PATH_KEYS = new Set(['logoBlack', 'logoWhite', 'favicon'])

export function isAssetPathKey(key = '') {
  return ASSET_PATH_KEYS.has(key) || key.startsWith('social')
}
