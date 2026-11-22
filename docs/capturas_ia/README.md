# Evidencia: pestaña "IA (apoyo)" del panel web

Pruebas hechas el 22/11/2026 en `http://localhost:5173` con el modelo MobileNetV2 corriendo en el navegador (TensorFlow.js). La foto no se envía a ningún servidor.

| Captura | Foto de prueba | Resultado en el panel |
|---|---|---|
| `20_panel_ia_con_caries.png` | `prueba_con_caries.jpg` | Posible caries detectada (91.0 %) |
| `21_panel_ia_sin_caries.png` | `prueba_sin_caries.jpg` | No se detectó caries (5.1 %) |

Nota: en Colab (Python) las mismas fotos dieron 79.7 % y 6.0 %. La clasificación es la misma; el porcentaje cambia un poco porque el navegador reduce la foto a 224×224 con otro método de redimensionado. Es una herramienta de apoyo, no reemplaza el diagnóstico del odontólogo.
