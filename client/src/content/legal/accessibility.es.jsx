// Declaración de accesibilidad (Spanish).
// the text of the old es/accessibility.html, moved over word for word. LegalView.jsx draws the page around it
import { Link } from 'react-router';

export const meta = {
    title: 'Accesibilidad - GradientV',
    description: 'Declaración de accesibilidad de GradientV: el estándar WCAG 2.1 AA que seguimos, nuestras pruebas continuas y cómo informar sobre una barrera.',
    label: 'Legal',
    heading: 'Declaración de accesibilidad',
    updated: 'Última actualización: 1 de septiembre de 2026'
};

export default function AccessibilityEs() {
    return (
        <>
            <p>GradientV LLC, que opera comercialmente como GradientV, está comprometida con la accesibilidad digital. Queremos que este sitio pueda ser usado por la mayor cantidad posible de personas, incluidas las personas que dependen de tecnología de asistencia.</p>
            <h2>El estándar que seguimos</h2>
            <p>Desarrollamos este sitio siguiendo las Pautas de Accesibilidad para el Contenido Web (WCAG) 2.1, en el nivel AA. Eso significa que buscamos un contraste de color suficiente, una estructura de encabezados clara, alternativas de texto descriptivas para las imágenes y contenido que funcione con teclado y con lector de pantalla.</p>
            <h2>Un esfuerzo continuo</h2>
            <p>La accesibilidad es un trabajo continuo, no una tarea que se hace una sola vez. Probamos el sitio con herramientas automatizadas y hacemos correcciones a medida que encontramos problemas. Sabemos que las herramientas automatizadas no detectan todo, así que seguimos revisando el sitio a medida que cambia. No afirmamos tener certificación formal ni conformidad total.</p>
            <h2>Infórmenos sobre una barrera</h2>
            <p>Si encuentra en este sitio algo que sea difícil de usar o de leer, queremos saberlo. Escríbanos a <a href="mailto:contact@gradientv.com">contact@gradientv.com</a> o comuníquese con nosotros a través de nuestra <Link to="/es/contact">página de contacto</Link>, e indíquenos, por favor, la página y qué ocurrió. Haremos todo lo posible por corregirlo y por ayudarle, mientras tanto, a obtener la información que necesita.</p>
        </>
    );
}
