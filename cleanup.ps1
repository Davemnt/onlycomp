$file = "c:\Users\monte\OneDrive\Escritorio\web site only comp\index.html"
$content = Get-Content $file -Raw -Encoding UTF8

# Mapeo completo de caracteres especiales malformados
$replacements = @{
    'ðŸ'¡' = ''
    'ðŸ"§' = ''
    'ðŸŽ¯' = ''
    'ðŸ"' = ''
    'ðŸ› ï¸' = ''
    'ðŸ'¼' = ''
    'ðŸ"‹' = ''
    'ðŸ"±' = ''
    'ðŸŽ¨' = ''
    'ðŸ"ž' = ''
    'ðŸ›¡ï¸' = ''
    'ðŸ"'' = ''
    'ðŸ"' = ''
    'ðŸ›ï¸' = ''
    
    # Caracteres acentuados malformados
    'Ã³' = 'o'
    'Ã¡' = 'a' 
    'Ã©' = 'e'
    'Ã­' = 'i'
    'Ãº' = 'u'
    'Ã±' = 'n'
    'Ã¼' = 'u'
    'Ã"' = 'O'
    'Ã' = 'A'
    'Ã‰' = 'E'
    'Ã' = 'I'
    'Ãš' = 'U'
    'Ã'' = 'N'
    'Ãœ' = 'U'
    
    # Palabras completas malformadas
    'PRÃCTICAS' = 'PRACTICAS'
    'TÃTULO' = 'TITULO'
    'MÃS' = 'MAS'
    'ACCIÃ"N' = 'ACCION'
    'SECCIÃ"N' = 'SECCION'
    'GUÃA' = 'GUIA'
    'TÃ©cnicas' = 'Tecnicas'
    'tÃ©cnico' = 'tecnico'
    'TÃCNICA' = 'TECNICA'
    'DISEÃ'O' = 'DISENO'
    'INTEGRACIÃ"N' = 'INTEGRACION'
    'CARACTERÃSTICAS' = 'CARACTERISTICAS'
    'ValidaciÃ³n' = 'Validacion'
    'DIRECCIÃ"N' = 'DIRECCION'
    'PÃšBLICA' = 'PUBLICA'
    'INFORMACIÃ"N' = 'INFORMACION'
    'ContÃ¡ctanos' = 'Contactanos'
    'LÃ­nea' = 'Linea'
    'mÃ¡quina' = 'maquina'
    'aquÃ­' = 'aqui'
    'DescripciÃ³n' = 'Descripcion'
    'reparaciÃ³n' = 'reparacion'
    'especÃ­fico' = 'especifico'
    'CuÃ©ntanos' = 'Cuentanos'
    'InformaciÃ³n' = 'Informacion'
    'exposiciÃ³n' = 'exposicion'
    'ofuscaciÃ³n' = 'ofuscacion'
    'secciÃ³n' = 'seccion'
    'implementa' = 'implementa'
    'coordenadas' = 'coordenadas'
    'AtenciÃ³n' = 'Atencion'
    'MÃ³viles' = 'Moviles'
    'mÃ³vil' = 'movil'
    
    # Símbolos especiales
    'Â¿' = '¿'
    'Â¡' = '¡'
    'â€™' = "'"
}

# Aplicar todos los reemplazos
foreach ($old in $replacements.Keys) {
    $new = $replacements[$old]
    $content = $content -replace [regex]::Escape($old), $new
}

# Guardar el archivo limpio
Set-Content $file $content -Encoding UTF8

Write-Host "Limpieza completada. Archivo guardado sin caracteres especiales problemáticos." -ForegroundColor Green