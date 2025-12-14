import type { MouseEvent } from 'react'
import { Link, useLocation } from 'react-router-dom'

import { logoPasteleria } from '@/assets'

interface FooterLink {
	label: string
	to: string
	external?: boolean
}

interface FooterSection {
	title: string
	links: FooterLink[]
}

const navigationSections: FooterSection[] = [
	{
		title: 'Secciones',
		links: [
			{ label: 'Inicio', to: '/' },
			{ label: 'Nosotros', to: '/about' },
			{ label: 'Blog', to: '/blog' },
		],
	},
]

const purchaseLinks: FooterLink[] = [
	{ label: 'Carta', to: '/menu' },
	{ label: 'Carrito', to: '/cart' },
]

const scheduleLines = ['Lunes a sábado', '10:00–19:00 hrs']

const Footer = () => {
	const location = useLocation()
	const currentYear = new Date().getFullYear()

	const handleHomeClick = (event: MouseEvent<HTMLAnchorElement>) => {
		if (typeof window === 'undefined') {
			return
		}

		if (location.pathname === '/') {
			event.preventDefault()
			window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
		}
	}

	const renderLink = ({ label, to, external }: FooterLink) => {
		if (external) {
			return (
				<a href={to} className="nav-link p-0 link-premium" target="_blank" rel="noreferrer">
					{label}
				</a>
			)
		}

		return (
			<Link
				to={to}
				className="nav-link p-0 link-premium"
				onClick={(event) => {
					if (typeof window === 'undefined') {
						return
					}

					if (to === '/' && location.pathname === '/') {
						event.preventDefault()
						window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
					}
				}}
			>
				{label}
			</Link>
		)
	}

	return (
		<footer className="footer-premium">
			<div className="container-fluid py-5 px-4 px-lg-5">
				<div className="row g-4">
					<div className="col-12 col-lg-5">
						<Link
							to="/"
							className="d-block mb-4 text-decoration-none"
							onClick={handleHomeClick}
						>
							<img
								src={logoPasteleria}
								alt="Pastelería Mil Sabores"
								width={220}
								className="d-block"
							/>
						</Link>
						<p className="mb-4 text-white-50" style={{ maxWidth: '400px' }}>
							Celebra la dulzura de la vida con nosotros. Tradición y calidad en cada mordisco.
						</p>
						<div className="d-flex align-items-center gap-3">
							<a
								href="https://maps.app.goo.gl/LA3bMz4KLmiopUho9"
								className="social-icon"
								aria-label="Dirección"
								target="_blank"
								rel="noreferrer"
							>
								<i className="bi bi-geo-alt-fill" aria-hidden />
							</a>
							<a
								href="mailto:pasteleria.1000sabores@gmail.com"
								className="social-icon"
								aria-label="Correo"
							>
								<i className="bi bi-envelope-fill" aria-hidden />
							</a>
							<a href="tel:+56912345678" className="social-icon" aria-label="Teléfono">
								<i className="bi bi-telephone-fill" aria-hidden />
							</a>
							<a
								href="https://www.instagram.com/pasteleria1000sabores"
								className="social-icon"
								aria-label="Instagram"
								target="_blank"
								rel="noreferrer"
							>
								<i className="bi bi-instagram" aria-hidden />
							</a>
						</div>
					</div>
					<div className="col-12 col-lg-7">
						<div className="row g-4 g-lg-3 row-cols-1 row-cols-md-3">
							{navigationSections.map((section) => (
								<div className="col" key={section.title}>
									<h6 className="footer-section-title">{section.title}</h6>
									<ul className="nav flex-column gap-1">
										{section.links.map((link) => (
											<li className="nav-item" key={link.label}>
												{renderLink(link)}
											</li>
										))}
									</ul>
								</div>
							))}
							<div className="col">
								<h6 className="footer-section-title">Compra</h6>
								<ul className="nav flex-column gap-1">
									{purchaseLinks.map((link) => (
										<li className="nav-item" key={link.label}>
											{renderLink(link)}
										</li>
									))}
								</ul>
							</div>
							<div className="col">
								<h6 className="footer-section-title">Horario</h6>
								<div className="d-flex flex-column gap-2 text-white-50 small">
									<div className="d-flex align-items-center gap-2">
										<i className="bi bi-clock text-warning"></i>
										<span>Lunes a Sábado</span>
									</div>
									<span className="ps-4 text-white">10:00 – 19:00 hrs</span>
								</div>
							</div>
						</div>
					</div>
				</div>

				<hr className="my-5 footer-divider" />

				<div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
					<small className="text-white-50">
						&copy; {currentYear} Pastelería Mil Sabores. Todos los derechos reservados.
					</small>
					<div className="d-flex gap-4">
						<Link to="/privacy" className="link-premium small">
							Privacidad
						</Link>
						<Link to="/terms" className="link-premium small">
							Términos
						</Link>
					</div>
				</div>
			</div>
		</footer>
	)
}

export default Footer
