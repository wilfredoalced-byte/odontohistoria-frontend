import { useEffect, useRef, useState } from 'react';

// OPERACIÓN 15: usa el modelo de caries (MobileNetV2 entrenado en Colab) dentro del panel.
// El análisis se hace en el navegador: la foto NO se envía a ningún servidor.
const RUTA_MODELO = '/modelo-caries/model.json';
const TAM = 224;

function AnalisisIA() {
  const [vistaPrevia, setVistaPrevia] = useState('');
  const [estado, setEstado] = useState('inicio'); // inicio | cargando | listo | error
  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState('');
  const modeloRef = useRef(null);
  const tfRef = useRef(null);
  const imgRef = useRef(null);

  useEffect(() => {
    return () => {
      if (vistaPrevia) URL.revokeObjectURL(vistaPrevia);
    };
  }, [vistaPrevia]);

  async function cargarModelo() {
    if (modeloRef.current) return;
    const tf = await import('@tensorflow/tfjs');
    tfRef.current = tf;
    modeloRef.current = await tf.loadGraphModel(RUTA_MODELO);
  }

  function elegirFoto(e) {
    const archivo = e.target.files && e.target.files[0];
    if (!archivo) return;
    if (!archivo.type.startsWith('image/')) {
      setError('Elige un archivo de imagen (JPG o PNG).');
      return;
    }
    setError('');
    setResultado(null);
    setEstado('inicio');
    setVistaPrevia(URL.createObjectURL(archivo));
  }

  async function analizar() {
    if (!imgRef.current) return;
    setError('');
    setResultado(null);
    setEstado('cargando');
    try {
      await cargarModelo();
      const tf = tfRef.current;
      // El modelo ya incluye su propio preprocesado: recibe píxeles 0 a 255.
      const probabilidad = tf.tidy(() => {
        const x = tf.image
          .resizeBilinear(tf.browser.fromPixels(imgRef.current), [TAM, TAM])
          .toFloat()
          .expandDims(0);
        return modeloRef.current.predict(x).dataSync()[0];
      });
      setResultado(probabilidad);
      setEstado('listo');
    } catch (e) {
      setError('No se pudo analizar la foto: ' + e.message);
      setEstado('error');
    }
  }

  const hayCaries = resultado !== null && resultado >= 0.5;

  return (
    <div>
      <p className="pista">
        Herramienta de <strong>apoyo</strong>: no reemplaza el diagnóstico del odontólogo. La foto se
        analiza en este navegador y no se guarda ni se envía a ningún servidor.
      </p>

      <label className="check">
        <input type="file" accept="image/*" onChange={elegirFoto} />
      </label>

      {vistaPrevia && (
        <div className="ia-foto">
          <img ref={imgRef} src={vistaPrevia} alt="Foto intraoral elegida" onLoad={() => setResultado(null)} />
          <button className="btn" onClick={analizar} disabled={estado === 'cargando'}>
            {estado === 'cargando' ? 'Analizando...' : 'Analizar foto'}
          </button>
        </div>
      )}

      {error && <p className="error">{error}</p>}

      {resultado !== null && (
        <div className={hayCaries ? 'ia-resultado ia-alerta' : 'ia-resultado ia-ok'}>
          <h4>{hayCaries ? 'Posible caries detectada' : 'No se detectó caries'}</h4>
          <p>Probabilidad estimada de caries: {(resultado * 100).toFixed(1)} %</p>
          <small>
            Resultado orientativo (modelo con 87.7 % de exactitud en pruebas). Confirmar siempre con el
            examen clínico.
          </small>
        </div>
      )}
    </div>
  );
}

export default AnalisisIA;
