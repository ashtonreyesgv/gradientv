// Política de privacidad (Spanish).
// the text of the old es/privacy.html, moved over word for word. LegalView.jsx draws the page around it
import { Link } from 'react-router';

export const meta = {
    title: 'Política de privacidad - GradientV',
    description: 'Cómo GradientV recopila, usa y protege la información obtenida a través de este sitio web, todo explicado en lenguaje claro.',
    label: 'Legal',
    heading: 'Política de privacidad',
    updated: 'Última actualización: 1 de septiembre de 2026'
};

export default function PrivacyEs() {
    return (
        <>
            <p>GradientV LLC, que opera comercialmente como GradientV, es una agencia de tecnología con sede en New York City y Stony Brook, New York. Esta política explica qué información recopilamos a través de este sitio web, cómo la usamos y las opciones que usted tiene. La mantenemos breve y clara a propósito.</p>
            <h2>Información que recopilamos</h2>
            <p>Solo recopilamos lo que necesitamos para responderle y mantener el sitio en funcionamiento:</p>
            <ul>
                <li><strong>Datos de contacto que usted proporciona.</strong> Si nos envía un mensaje mediante un formulario de contacto o por correo electrónico, recopilamos su nombre, su dirección de correo electrónico y el contenido de su mensaje.</li>
                <li><strong>Datos básicos de uso.</strong> Como la mayoría de los sitios web, nuestro alojamiento y nuestras analíticas registran información agregada, como las páginas visitadas, el sitio de referencia, el tipo de navegador, el tipo de dispositivo y la ubicación general por país.</li>
                <li><strong>Cookies.</strong> Este sitio no instala cookies. Consulte la sección sobre cookies más abajo.</li>
            </ul>
            <h2>Cómo usamos su información</h2>
            <p>Usamos la información que recopilamos para:</p>
            <ul>
                <li>Responder a sus consultas y dar seguimiento a un posible proyecto.</li>
                <li>Entender cómo se usa el sitio para poder mejorarlo.</li>
                <li>Mantener el sitio seguro y funcionando según lo previsto.</li>
            </ul>
            <p>No vendemos su información personal a terceros.</p>
            <h2>Cookies y analíticas</h2>
            <p>Este sitio usa Vercel Web Analytics para medir el tráfico general, como cuántas personas visitan una página. Funciona sin cookies: no instala cookies, no utiliza huella digital del navegador y no lo rastrea en otros sitios web. No recopila datos que lo identifiquen personalmente, y no lo usamos para crear perfiles publicitarios.</p>
            <p>Como no se usan cookies, aquí no hay nada que aceptar ni rechazar, y el sitio funciona exactamente igual en cualquier caso.</p>
            <h2>Servicios de terceros</h2>
            <p>Nos apoyamos en un número reducido de proveedores externos para operar el sitio. El sitio está alojado por Vercel, que también proporciona las analíticas descritas anteriormente, y usamos Google Workspace para el correo electrónico. Estos proveedores procesan datos en nuestro nombre y únicamente para los fines descritos aquí. Le recomendamos revisar las prácticas de privacidad de cualquier servicio con el que usted interactúe.</p>
            <h2>Conservación de datos</h2>
            <p>Conservamos los mensajes de contacto solo durante el tiempo necesario para responderle y para mantener un registro de nuestra correspondencia, y luego los eliminamos cuando ya no son necesarios. Los datos analíticos agregados pueden conservarse por más tiempo porque no lo identifican personalmente.</p>
            <h2>Sus derechos</h2>
            <p>Usted puede pedirnos que le mostremos la información personal que tenemos sobre usted, que la corrijamos o que la eliminemos. Para hacer una solicitud, comuníquese con nosotros mediante los datos que aparecen a continuación y responderemos en un plazo razonable.</p>
            <h2>Comuníquese con nosotros</h2>
            <p>Si tiene preguntas sobre esta política o sobre sus datos, escríbanos a <a href="mailto:contact@gradientv.com">contact@gradientv.com</a> o comuníquese con nosotros a través de nuestra <Link to="/es/contact">página de contacto</Link>.</p>
        </>
    );
}
