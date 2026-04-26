import React, { useEffect, useState } from 'react';

const ContentProtection: React.FC = () => {
  const [showWarning, setShowWarning] = useState(false);
  const [warningMessage, setWarningMessage] = useState('');

  useEffect(() => {
    // Bloquear clic derecho en imágenes
    const handleContextMenu = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'IMG' || target.closest('img')) {
        e.preventDefault();
        showLegalWarning('La protección de contenido está activa. Las imágenes están protegidas por derechos de autor.');
        return false;
      }
    };

    // Bloquear arrastrar imágenes
    const handleDragStart = (e: DragEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'IMG' || target.closest('img')) {
        e.preventDefault();
        return false;
      }
    };

    // Bloquear atajos de teclado para guardar
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+S, Ctrl+Shift+S, Cmd+S (Mac)
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        showLegalWarning('La función de guardar está deshabilitada para proteger el contenido.');
        return false;
      }
      
      // Ctrl+C, Cmd+C (solo en imágenes)
      if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
        const selection = window.getSelection();
        const selectedElement = selection?.anchorNode?.parentElement;
        if (selectedElement?.tagName === 'IMG' || selectedElement?.closest('img')) {
          e.preventDefault();
          showLegalWarning('La copia de imágenes está protegida por derechos de autor.');
          return false;
        }
      }
      
      // F12, DevTools
      if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'I')) {
        e.preventDefault();
        showLegalWarning('Las herramientas de desarrollador están restringidas para proteger el contenido.');
        return false;
      }
      
      // Ctrl+U (ver fuente)
      if ((e.ctrlKey || e.metaKey) && e.key === 'u') {
        e.preventDefault();
        showLegalWarning('El acceso al código fuente está restringido para proteger el contenido.');
        return false;
      }
      
      // Ctrl+P (imprimir)
      if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        showLegalWarning('La función de imprimir está deshabilitada para proteger el contenido.');
        return false;
      }
    };

    // Bloquear selección de texto en imágenes
    const handleSelectStart = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'IMG' || target.closest('img')) {
        e.preventDefault();
        return false;
      }
    };

    // Detectar intentos de captura de pantalla (solo navegadores que lo soportan)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        // El usuario cambió de pestaña o minimizó la ventana
        setTimeout(() => {
          if (document.visibilityState === 'visible') {
            // Podría ser una captura de pantalla
            showLegalWarning('La captura de pantalla está monitoreada y protegida por derechos de autor.');
          }
        }, 100);
      }
    };

    // Prevenir copia de imágenes
    const handleCopy = (e: ClipboardEvent) => {
      const selection = window.getSelection();
      const selectedElement = selection?.anchorNode?.parentElement;
      if (selectedElement?.tagName === 'IMG' || selectedElement?.closest('img')) {
        e.preventDefault();
        showLegalWarning('La copia de imágenes está protegida por derechos de autor.');
        return false;
      }
    };

    // Añadir todos los event listeners
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('dragstart', handleDragStart);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('selectstart', handleSelectStart);
    document.addEventListener('copy', handleCopy);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Estilos CSS para protección adicional
    const style = document.createElement('style');
    style.textContent = `
      img {
        -webkit-user-select: none;
        -khtml-user-select: none;
        -moz-user-select: none;
        -o-user-select: none;
        user-select: none;
        -webkit-user-drag: none;
        -khtml-user-drag: none;
        -moz-user-drag: none;
        -o-user-drag: none;
        user-drag: none;
        -webkit-touch-callout: none;
        pointer-events: auto;
      }
      
      img:hover {
        cursor: default !important;
      }
      
      * {
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        -khtml-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
      }
    `;
    document.head.appendChild(style);

    return () => {
      // Limpiar event listeners
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('dragstart', handleDragStart);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('selectstart', handleSelectStart);
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      
      // Eliminar estilos
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  const showLegalWarning = (message: string) => {
    setWarningMessage(message);
    setShowWarning(true);
    
    // Auto-ocultar después de 3 segundos
    setTimeout(() => {
      setShowWarning(false);
    }, 3000);
  };

  if (!showWarning) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] bg-red-900/95 backdrop-blur-sm text-white px-6 py-4 rounded-lg shadow-2xl border border-red-700 max-w-md animate-in fade-in slide-in-from-top duration-300">
      <div className="flex items-center space-x-3">
        <div className="flex-shrink-0">
          <svg className="w-6 h-6 text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium">{warningMessage}</p>
          <p className="text-xs text-red-300 mt-1">© 2024 Valeria Ferrer - Todos los derechos reservados</p>
        </div>
        <button
          onClick={() => setShowWarning(false)}
          className="flex-shrink-0 text-red-300 hover:text-white transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ContentProtection;
