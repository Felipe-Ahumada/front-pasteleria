import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/common";
import { useHomePage } from "./useHomePage";
import { logoPastelito, videoInicio } from "@/assets"; // Added import

const HomePage = () => {
  const { featuredCategories } = useHomePage();

  /* Animation Observer */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target); // Trigger once
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    const elements = document.querySelectorAll(
      ".category-circle-wrapper, .animate-on-scroll, .section-gold-divider"
    );
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [featuredCategories]); // Re-run if categories load

  return (
    <>
      {/* =============================== */}
      {/*      HERO SECTION (REBRAND)    */}
      {/* =============================== */}
      <section aria-label="Hero Principal" className="hero-container">
        
        {/* STATIC OVERLAY */}
        <div className="hero-static-overlay">
           <div className="hero-content">
              {/* Optional: Add Logo if desired, or just big text */}
              <img src={logoPastelito} alt="Mil Sabores Logo" className="hero-brand-logo mx-auto d-block" />
              
              <h1 className="hero-title">Pastelería Mil Sabores</h1>
              <p className="hero-subtitle">El Cielo de los Pasteles Espera</p>
              
              <div className="hero-buttons">
                 <Link to="/menu" className="btn btn-hero btn-hero-primary">
                    Ver Carta
                 </Link>
                 <Link to="/contact" className="btn btn-hero btn-hero-secondary">
                    Contáctanos
                 </Link>
              </div>
           </div>
        </div>

        {/* BACKGROUND VIDEO */}
        <video
          className="hero-video"
          src={videoInicio}
          autoPlay
          loop
          muted
          playsInline
        />
      </section>

      {/* =============================== */}
      {/*     HALL OF FAME (CATEGORIES)  */}
      {/* =============================== */}
      <section className="bg-cocoa-dark py-5">
        <div className="container py-4">
          <div className="text-center mb-5">
            <h2 className="category-hall-of-fame-title animate-on-scroll">Nuestra Selección</h2>
            <div className="section-gold-divider"></div>
            <p 
                className="text-white-50 lead animate-on-scroll" 
                style={{ transitionDelay: '200ms' }}
            >
                Descubre los sabores que nos hacen únicos
            </p>
          </div>

          {featuredCategories.length === 0 ? (
            <p className="text-center text-white-50">
              Cargando delicias...
            </p>
          ) : (
            <>
              <div className="row row-cols-2 row-cols-md-3 row-cols-lg-4 g-4 g-lg-5 justify-content-center">
                {featuredCategories.map((categoria, index) => (
                  <div className="col" key={categoria.id}>
                    <Link 
                        to={`/menu?categoryId=${categoria.categoryId}`}
                        className="category-circle-wrapper"
                        style={{ animationDelay: `${index * 150}ms` }}
                    >
                        <div className="category-circle-img-container">
                            <img
                              src={categoria.image}
                              alt={categoria.name}
                              loading="lazy"
                            />
                        </div>
                        <div className="text-center mt-3">
                            <h3 className="category-circle-label">{categoria.name}</h3>
                            <span className="category-count">
                                {categoria.productCount} {categoria.productCount === 1 ? 'Opción' : 'Opciones'}
                            </span>
                        </div>
                    </Link>
                  </div>
                ))}
              </div>

              <div className="text-center mt-5 pt-3">
                <Button 
                    as="link" 
                    to="/menu" 
                    size="lg" 
                    className="btn-hero-primary px-5 rounded-pill shadow-lg"
                    style={{ fontSize: '1.2rem', padding: '15px 40px' }}
                >
                  Ver Carta Completa
                </Button>
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
};

export default HomePage;
