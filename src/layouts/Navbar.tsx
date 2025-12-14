import { NavLink, useLocation } from 'react-router-dom'

import { Button } from '@/components/common'
import { logoPastelito, logoPasteleria } from '@/assets'
import cx from '@/utils/cx'
import MobileNav from './MobileNav'
import type { PrimaryLink, SecondaryLink } from '@/types/navbar'
import useAuth from '@/hooks/useAuth'
import { useCart } from '@/hooks/useCart'
import { showOffcanvas } from '@/utils/offcanvas'

const primaryLinks: PrimaryLink[] = [
	{ label: 'Inicio', to: '/', icon: 'bi-house-door', ariaLabel: 'Inicio' },
	{ label: 'Nosotros', to: '/about' },
	{ label: 'Carta', to: '/menu' },
	{ label: 'Blog', to: '/blog' },
	{ label: 'Contacto', to: '/contact' },
]

const secondaryLinks: SecondaryLink[] = [
	{
		label: 'Instagram',
		to: 'https://www.instagram.com/pasteleria1000sabores',
		icon: 'bi-instagram',
		ariaLabel: 'Instagram',
		external: true,
	},
	{ label: 'Carrito', to: '/cart', icon: 'bi-cart3', ariaLabel: 'Carrito' },
]

const renderPrimaryLink = (link: PrimaryLink, currentPath: string) => (
	<NavLink
		key={link.label}
		to={link.to}
		className={({ isActive }) =>
			cx(
				'nav-link px-3 py-2 rounded-pill transition-base',
				isActive && 'active'
			)
		}
		aria-label={link.ariaLabel}
		end={link.to === '/' || link.to === '/menu'}
		onClick={(event) => {
			if (link.to === '/' && currentPath === '/' && typeof window !== 'undefined') {
				event.preventDefault()
				window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
			}
		}}
	>
		{link.icon ? <i className={cx('bi', link.icon, 'me-1')} aria-hidden /> : null}
		<span>{link.label}</span>
	</NavLink>
)

const Navbar = () => {
	const { pathname } = useLocation()
	const { isAuthenticated, user } = useAuth()
	const { totals } = useCart()

	const shouldShowAdminPanel =
		Boolean(isAuthenticated) &&
		(user?.role === 'superadmin' || user?.role === 'admin' || user?.role === 'seller')

	const profileLabel = (() => {
		if (!user) {
			return 'Mi perfil'
		}

		const segments = [user.firstName, user.lastName].filter(Boolean)
		const label = segments.length > 0 ? segments.join(' ') : user.name
		return label.trim() || 'Mi perfil'
	})()

	const closeMobileMenu = () => {
		if (typeof window === 'undefined') {
			return
		}

		const nav = document.getElementById('mainNav')
		if (!nav) {
			return
		}

		const bootstrapApi = (window as typeof window & {
			bootstrap?: {
				Collapse?: {
					getInstance: (element: Element) => { hide: () => void } | null
				}
			}
		}).bootstrap

		const collapseInstance = bootstrapApi?.Collapse?.getInstance(nav)
		collapseInstance?.hide()

		if (!collapseInstance) {
			nav.classList.remove('show')
		}

		const toggler = document.querySelector<HTMLButtonElement>('[data-bs-target="#mainNav"]')
		if (toggler) {
			toggler.classList.add('collapsed')
			toggler.setAttribute('aria-expanded', 'false')
		}
	}

	// Rebranding: Always fixed, always brand theme (Taco Topeka style)
	const navbarClasses = 'navbar navbar-expand-lg navbar-dark fixed-top navbar-theme transition-base'

	return (
		<nav className={navbarClasses}>
			<div className="container-fluid">
				<NavLink
					className="navbar-brand d-flex align-items-center"
					to="/"
					state={{ from: pathname }}
					onClick={(event) => {
						if (typeof window === 'undefined') {
							return
						}

						if (pathname === '/') {
							event.preventDefault()
							window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
						}
					}}
				>
					<img
						src={logoPasteleria}
						alt="Pastelería Mil Sabores"
						height={70}
						className="d-inline-block align-top"
					/>
				</NavLink>

				<button
					className="navbar-toggler"
					type="button"
					data-bs-toggle="collapse"
					data-bs-target="#mainNav"
					aria-controls="mainNav"
					aria-expanded="false"
					aria-label="Alternar navegacion"
				>
					<span className="navbar-toggler-icon" />
				</button>

				<div className="collapse navbar-collapse" id="mainNav">
					<ul className="navbar-nav mx-auto d-none d-lg-flex">
						{primaryLinks.map((link) => (
							<li className="nav-item" key={link.label}>
								{renderPrimaryLink(link, pathname)}
							</li>
						))}
					</ul>

					<ul className="navbar-nav ms-auto align-items-lg-center gap-2 d-none d-lg-flex">
						{secondaryLinks.map((link) => {
							const isCart = link.to === '/cart'
							return (
								<li className="nav-item" key={link.label}>
									{link.external ? (
										<a
											className="nav-link nav-link-pill"
											href={link.to}
											target="_blank"
											rel="noreferrer"
											aria-label={link.ariaLabel}
										>
											<i className={cx('bi', link.icon, 'fs-5')} aria-hidden />
											<span className="visually-hidden">{link.label}</span>
										</a>
									) : (
										<NavLink
											to={link.to}
											className={({ isActive }) =>
												cx(
													'nav-link px-3 py-2 rounded-pill transition-base position-relative',
													isActive && 'active'
												)
											}
											aria-label={link.ariaLabel}
										>
											<div className="position-relative d-inline-block">
												<i className={cx('bi', link.icon, 'fs-5')} aria-hidden />
												{isCart && totals.totalCantidad > 0 && (
													<span
														className="position-absolute top-0 start-100 translate-middle badge rounded-pill fw-bold shadow-sm"
														style={{
															backgroundColor: 'var(--title-tertiary)',
															color: '#3e2723', // Dark cocoa color for contrast on gold
															fontSize: '0.7rem',
															padding: '0.35em 0.6em',
															border: '2px solid #3e2723', // Add border to separate from dark background
														}}
													>
														{totals.totalCantidad}
														<span className="visually-hidden">productos</span>
													</span>
												)}
											</div>
											<span className="visually-hidden">{link.label}</span>
										</NavLink>
									)}
								</li>
							)
						})}
						{shouldShowAdminPanel ? (
							<li className="nav-item ms-2">
								<Button
									as="link"
									to="/admin"
									size="sm"
									variant="strawberry"
									className="d-flex align-items-center gap-2 px-3"
									title="Panel Administración"
									aria-label="Ir al Panel de Administración"
								>
									<i className="bi bi-speedometer2" aria-hidden />
									<span>Panel Administración</span>
								</Button>
							</li>
						) : null}
						<li className="nav-item ms-2">
							{isAuthenticated ? (
								<Button
									as="link"
									to="/profile"
									size="sm"
									variant="mint"
									className="d-flex align-items-center gap-2 px-3 text-truncate"
									title="Ver mi perfil"
									aria-label="Ver mi perfil"
								>
									<i className="bi bi-person-circle" aria-hidden />
									<span className="text-truncate">{profileLabel}</span>
								</Button>
							) : (
								<Button
									type="button"
									size="sm"
									data-bs-toggle="offcanvas"
									data-bs-target="#offcanvasLogin"
									variant="strawberry"
									onClick={() => showOffcanvas('offcanvasLogin')}
								>
									Iniciar sesión
								</Button>
							)}
						</li>
					</ul>

					<MobileNav
						primaryLinks={primaryLinks}
						secondaryLinks={secondaryLinks}
						currentPath={pathname}
						onNavigate={closeMobileMenu}
						authAction={
							isAuthenticated
								? { type: 'profile', label: profileLabel, to: '/profile' as const }
								: { type: 'login', label: 'Iniciar sesión' }
						}
						adminAction={
							shouldShowAdminPanel ? { type: 'admin', label: 'Panel Administración', to: '/admin' } : undefined
						}
					/>
				</div>
			</div>
		</nav>
	)
}

export default Navbar
