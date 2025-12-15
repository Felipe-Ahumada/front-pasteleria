import { useContext } from 'react'

import { AuthContext } from '@/context/auth'

const useAuth = () => {
	const context = useContext(AuthContext)

	// Si el contexto no existe, se lanza un error
	if (!context) {
		throw new Error('useAuth must be used within an AuthProvider')
	}

	return context
}

export default useAuth
