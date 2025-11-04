import { defaultProfileImage } from '@/assets'

export const normalizeAvatarUrl = (value?: string | null, fallback: string = defaultProfileImage): string => {
	if (typeof value !== 'string') {
		return fallback
	}

	const trimmed = value.trim()
	if (!trimmed) {
		return fallback
	}

	if (/^(https?:|data:)/i.test(trimmed)) {
		return trimmed
	}

	return fallback
}
