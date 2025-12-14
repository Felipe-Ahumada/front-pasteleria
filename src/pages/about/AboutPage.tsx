import { useEffect, useRef, useState } from 'react'

const ABOUT_IMAGES = {
	about: 'https://res.cloudinary.com/dx83p4455/image/upload/v1762263485/vista_pasteleria_mil_sabores_vi5hwh.jpg',
	mission: 'https://res.cloudinary.com/dx83p4455/image/upload/v1762263484/diversos_productos_cautgn.jpg',
	vision: 'https://res.cloudinary.com/dx83p4455/image/upload/v1762263485/persona_trabajando_en_una_cocina_f6nkxe.jpg',
	community: 'https://res.cloudinary.com/dx83p4455/image/upload/v1762263484/estudiante_de_reposteria_aprendiendo_en_la_cocina_mv6hjy.jpg',
} as const

interface StoryBlock {
	id: string
	title: string
	description: string[]
	image: string
	imageAlt: string
	invert?: boolean
}

const storyBlocks: StoryBlock[] = [
	{
		id: 'about',
		title: 'Quienes somos',
		description: [
			'En Pastelería Mil Sabores celebramos 50 anos de historia endulzando momentos unicos y siendo un referente de la reposteria chilena.',
			'Desde nuestro record Guinness en 1995, cuando colaboramos en la creacion de la torta mas grande del mundo, mantenemos viva la tradicion de innovar y sorprender con cada creacion.',
			'Hoy renovamos nuestro sistema de ventas online para que nuestros clientes disfruten de una experiencia moderna y accesible, llevando la dulzura directamente a sus hogares.',
		],
		image: ABOUT_IMAGES.about,
		imageAlt: 'Tienda Pastelería Mil Sabores',
	},
	{
		id: 'mission',
		title: 'Mision',
		description: [
			'Ofrecer una experiencia dulce y memorable, proporcionando tortas y productos de reposteria de alta calidad para todas las ocasiones.',
			'Celebramos nuestras raices historicas y fomentamos la creatividad en la reposteria chilena.',
		],
		image: ABOUT_IMAGES.mission,
		imageAlt: 'Diversos productos de reposteria',
		invert: true,
	},
	{
		id: 'vision',
		title: 'Vision',
		description: [
			'Convertirnos en la tienda online lider de reposteria en Chile, reconocida por la calidad, la innovacion y el impacto positivo en la comunidad.',
			'Queremos ser una plataforma de impulso para las nuevas generaciones de talentos gastronomicos.',
		],
		image: ABOUT_IMAGES.vision,
		imageAlt: 'Persona trabajando en una cocina',
	},
	{
		id: 'community',
		title: 'Impacto comunitario',
		description: [
			'Cada compra apoya a estudiantes de gastronomia y a la comunidad local, contribuyendo a que nuevas generaciones de reposteros sigan creando y compartiendo su arte.',
		],
		image: ABOUT_IMAGES.community,
		imageAlt: 'Estudiante de reposteria aprendiendo en la cocina',
		invert: true,
	},
]

const StoryBlockRow = ({ block }: { block: StoryBlock }) => {
	const ref = useRef<HTMLDivElement>(null)
	const [isVisible, setIsVisible] = useState(false)

	useEffect(() => {
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setIsVisible(true)
					observer.disconnect()
				}
			},
			{ threshold: 0.25 },
		)

		if (ref.current) observer.observe(ref.current)
		return () => observer.disconnect()
	}, [])

	return (
		<div ref={ref} className="container py-5 overflow-hidden">
			<div className={`row align-items-center ${block.invert ? 'flex-md-row-reverse' : ''}`}>
				<div
					className={`col-md-6 mb-4 mb-md-0 reveal-hidden ${
						isVisible
							? 'reveal-visible'
							: block.invert
							? 'slide-from-right'
							: 'slide-from-left'
					}`}
					style={{ transitionDelay: block.invert ? '300ms' : '0ms' }}
				>
					<img
						src={block.image}
						alt={block.imageAlt}
						className="img-fluid rounded shadow-soft hover-scale"
                        style={{ border: '2px solid var(--title-tertiary)' }} /* Added Gold Border for premium loop */
					/>
				</div>
				<div
					className={`col-md-6 reveal-hidden ${
						isVisible
							? 'reveal-visible'
							: block.invert
							? 'slide-from-left'
							: 'slide-from-right'
					}`}
					style={{ transitionDelay: block.invert ? '0ms' : '300ms' }}
				>
					<h1 className="section-title mb-4 text-gold">{block.title}</h1>
					{block.description.map((paragraph) => (
						<p key={paragraph} className="text-premium-body fs-5 lh-lg">
							{paragraph}
						</p>
					))}
				</div>
			</div>
		</div>
	)
}

const About = () => (
	<main className="p-0">
		{/* Hero Section */}
		<div className="about-hero" style={{ backgroundImage: `url(${ABOUT_IMAGES.about})` }}>
			<div className="about-hero-content">
				<h1 className="about-hero-title">Nosotros</h1>
			</div>

			<div className="about-sidebar-decoration">
				<a
					href="https://www.instagram.com/pasteleria1000sabores"
					target="_blank"
					rel="noreferrer"
					className="about-sidebar-link"
				>
					<i className="bi bi-instagram"></i>
					<span>Síguenos</span>
				</a>
				<div className="about-sidebar-line"></div>
			</div>
		</div>

		{/* Content Section */}
		<section className="bg-cocoa-dark py-5 position-relative">
			{storyBlocks.map((block) => (
				<StoryBlockRow key={block.id} block={block} />
			))}

			<div className="container pb-5">
				<div className="mt-4 p-5 text-center bg-cocoa-glass rounded-4 shadow-lg">
					<h3 className="mb-3 font-pacifico text-gold">
						Celebra la dulzura de la vida con Pastelería Mil Sabores
					</h3>
					<h5 className="mb-1 text-white-50">
						Estamos emocionados de compartir nuestras delicias contigo.
					</h5>
					<h5 className="text-white-50">
						Descubre, saborea y crea momentos inolvidables con nosotros.
					</h5>
				</div>
			</div>
		</section>
	</main>
)


export default About
