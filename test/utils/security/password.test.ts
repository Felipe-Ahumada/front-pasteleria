import { describe, expect, it } from 'vitest'
import * as passwordUtils from '@/utils/security/password'

describe('ensureHashedPassword', () => {
	it('returns an existing hash lower-cased without rehashing it', () => {
		const storedHash = 'ABCDEF1234567890ABCDEF1234567890ABCDEF1234567890ABCDEF1234567890'

		const result = passwordUtils.ensureHashedPassword(storedHash)

		expect(result).toBe(storedHash.toLowerCase())
	})

	it('hashes trimmed plain values and produces a stable hash', () => {
		const hashed = passwordUtils.ensureHashedPassword('  MiClave ') // surrounding spaces should be ignored
		const expected = passwordUtils.hashPassword('MiClave')

		expect(hashed).toHaveLength(64)
		expect(hashed).toBe(expected)

		const secondPass = passwordUtils.ensureHashedPassword(hashed)
		expect(secondPass).toBe(hashed)
	})
})
