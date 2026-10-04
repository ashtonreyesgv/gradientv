// Términos del servicio (Spanish).
// the text of the old es/terms.html, moved over word for word. LegalView.jsx draws the page around it
import { Link } from 'react-router';

export const meta = {
    title: 'Términos del servicio - GradientV',
    description: 'Los términos que rigen el uso que usted haga del sitio web de GradientV y de los servicios que en él se describen.',
    label: 'Legal',
    heading: 'Términos del servicio',
    updated: 'Última actualización: 1 de septiembre de 2026'
};

export default function TermsEs() {
    return (
        <>
            <p>Estos términos se aplican al uso que usted haga del sitio web operado por GradientV LLC, que opera comercialmente como GradientV ("GradientV", "nosotros" o "nos"). Al visitar y usar este sitio, usted los acepta. Si no está de acuerdo, por favor no use el sitio.</p>
            <h2>Uso aceptable</h2>
            <p>Usted se compromete a usar este sitio de forma lícita y respetuosa. Usted se compromete a no:</p>
            <ul>
                <li>Intentar alterar o sobrecargar el sitio o sus sistemas, u obtener acceso no autorizado a ellos.</li>
                <li>Copiar, extraer o volver a publicar el contenido del sitio de una forma que no se permita a continuación.</li>
                <li>Usar el sitio para enviar contenido ilícito, dañino o engañoso.</li>
            </ul>
            <h2>Propiedad intelectual</h2>
            <p>El contenido de este sitio, incluidos el texto, el diseño, los gráficos, el nombre GradientV y el logotipo, pertenece a GradientV LLC, salvo que se indique lo contrario. Usted puede ver y compartir enlaces a nuestras páginas, pero no puede reutilizar nuestro contenido con fines comerciales sin nuestro permiso por escrito.</p>
            <h2>Trabajos con clientes</h2>
            <p>Estos términos cubren únicamente el sitio web. Todo trabajo remunerado entre GradientV LLC y un cliente se rige por un Contrato de Servicios al Cliente firmado por separado. Cuando ese contrato y estos términos del sitio difieran, prevalece el contrato firmado para ese trabajo.</p>
            <h2>Exclusión de garantías</h2>
            <p>Este sitio web se proporciona "tal cual" y "según disponibilidad". Trabajamos para mantenerlo exacto y disponible, pero no garantizamos que esté libre de errores, que funcione sin interrupciones ni que esté actualizado. Usted usa el sitio bajo su propio riesgo.</p>
            <h2>Limitación de responsabilidad</h2>
            <p>En la máxima medida permitida por la ley, GradientV LLC no es responsable de ningún daño indirecto, incidental o consecuencial que surja del uso que usted haga de este sitio web, o de la imposibilidad de usarlo. Esta sección se refiere al sitio web en sí y no limita ninguna obligación establecida en un Contrato de Servicios al Cliente firmado.</p>
            <h2>Ley aplicable</h2>
            <p>Estos términos se rigen por las leyes del Estado de New York, sin considerar sus normas sobre conflicto de leyes.</p>
            <h2>Cambios a estos términos</h2>
            <p>Es posible que actualicemos estos términos de vez en cuando. Cuando lo hagamos, modificaremos la fecha de "Última actualización" que aparece arriba. El uso continuado del sitio después de un cambio significa que usted acepta los términos actualizados.</p>
            <h2>Contáctenos</h2>
            <p>Si tiene preguntas sobre estos términos, escríbanos a <a href="mailto:contact@gradientv.com">contact@gradientv.com</a> o comuníquese con nosotros a través de nuestra <Link to="/es/contact">página de contacto</Link>.</p>
        </>
    );
}
