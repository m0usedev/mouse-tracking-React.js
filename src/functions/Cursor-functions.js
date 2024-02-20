export function generateRandomColor() {
    //Esta funcion se encarga de dar colores rgba aleatorios

    // Generar componentes RGB aleatorios
    const rojo = Math.floor(Math.random() * 256);
    const verde = Math.floor(Math.random() * 256);
    const azul = Math.floor(Math.random() * 256);
    
    // Construir el color en formato RGBA con 50% de transparencia
    const colorRGBA = "rgba(" + rojo + ", " + verde + ", " + azul + ", 0.5)";

    return colorRGBA;
}