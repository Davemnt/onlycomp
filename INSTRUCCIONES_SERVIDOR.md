# 🚨 ERROR: "Unexpected end of JSON input"

## ¿Por qué ocurre este error?

Estás usando **Live Server** (puerto 5501) que NO puede ejecutar archivos PHP.
Cuando el JavaScript intenta obtener datos de `procesar-transferencia.php`, el servidor devuelve una respuesta vacía o el código PHP sin procesar.

---

## ✅ SOLUCIÓN: Usar un servidor PHP

### Método 1: XAMPP (Recomendado para Windows)

#### Instalación:
1. **Descargar XAMPP:**
   - Ir a: https://www.apachefriends.org/download.html
   - Descargar la versión para Windows (PHP 8.x)
   - Ejecutar el instalador

2. **Instalar componentes necesarios:**
   - ☑️ Apache (servidor web)
   - ☑️ PHP (procesador PHP)
   - ⬜ MySQL (no necesario por ahora)
   - ⬜ Los demás componentes son opcionales

3. **Ubicar tu proyecto:**
   ```
   Opción A: Mover proyecto a htdocs
   - Copiar todo el contenido de tu carpeta a: C:\xampp\htdocs\onlycomp\
   
   Opción B: Crear un Virtual Host (avanzado)
   - Mantener el proyecto en su ubicación actual
   - Configurar Apache para apuntar a esa carpeta
   ```

4. **Iniciar servidor:**
   - Abrir "XAMPP Control Panel"
   - Hacer clic en "Start" junto a Apache
   - El botón se volverá verde cuando esté activo

5. **Acceder al sitio:**
   - Abrir navegador
   - Ir a: `http://localhost/onlycomp/`
   - ¡Listo! Ya funciona con PHP ✅

---

### Método 2: PHP Built-in Server (Requiere instalar PHP)

Si solo quieres instalar PHP sin XAMPP:

1. **Descargar PHP:**
   - Ir a: https://windows.php.net/download/
   - Descargar "VS16 x64 Thread Safe" (ZIP)
   - Extraer a: `C:\php`

2. **Agregar PHP al PATH:**
   - Buscar "Variables de entorno" en Windows
   - Editar "Path" en Variables del sistema
   - Agregar: `C:\php`
   - Aceptar y cerrar todo

3. **Iniciar servidor:**
   ```powershell
   cd "c:\Users\monte\OneDrive\Escritorio\web site only comp"
   php -S localhost:8000
   ```

4. **Acceder:**
   - `http://localhost:8000/`

---

### Método 3: Alternativa con Node.js + Express (Si prefieres Node.js)

Si prefieres Node.js en lugar de PHP, puedo ayudarte a convertir el backend a Node.js.

---

## 🔍 Verificar que funciona

Una vez que tengas el servidor PHP corriendo:

1. Abre la consola del navegador (F12)
2. Intenta hacer una compra
3. **NO** deberías ver el error "Unexpected end of JSON input"
4. Deberías ser redirigido a `transferencia.html` con los datos de la orden

---

## 📝 Notas importantes:

- ❌ **NO usar Live Server** para este proyecto (solo sirve archivos estáticos)
- ✅ **Usar XAMPP o PHP server** (puede ejecutar PHP)
- 📁 La carpeta `datos/` ya está creada para almacenar las órdenes
- 🔒 En producción, necesitarás un hosting con soporte PHP

---

## 🆘 ¿Necesitas ayuda?

Si tienes problemas con la instalación:
1. Dime qué método elegiste
2. Describe el error que ves
3. Te ayudaré a solucionarlo paso a paso
