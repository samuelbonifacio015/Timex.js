import { useState } from "react";

/**
 * Config Component
 * Permite configurar opciones como el color de la fuente.
 */
const Config = () => {
  const [showConfig, setShowConfig] = useState(true);
  const [fontColor, setFontColor] = useState("#000000");

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFontColor(e.target.value);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border relative">
      <button
        onClick={() => setShowConfig(!showConfig)}
        className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100"
        aria-label="Abrir configuración"
      >
        {/* SVG Settings */}
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none">
          <path d="M12 15.5C13.933 15.5 15.5 13.933 15.5 12C15.5 10.067 13.933 8.5 12 8.5C10.067 8.5 8.5 10.067 8.5 12C8.5 13.933 10.067 15.5 12 15.5Z" stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M19.4 15A1.65 1.65 0 0 0 20 13.6L21.5 12L20 10.4A1.65 1.65 0 0 0 19.4 9M4.6 9A1.65 1.65 0 0 0 4 10.4L2.5 12L4 13.6A1.65 1.65 0 0 0 4.6 15M9 19.4A1.65 1.65 0 0 0 10.4 20L12 21.5L13.6 20A1.65 1.65 0 0 0 15 19.4M15 4.6A1.65 1.65 0 0 0 13.6 4L12 2.5L10.4 4A1.65 1.65 0 0 0 9 4.6" stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      {showConfig && (
        <div className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Color de fuente:
            </label>
            <input
              type="color"
              value={fontColor}
              onChange={handleColorChange}
              className="w-16 h-10 border-2 border-gray-300 rounded cursor-pointer"
            />
          </div>
          <div
            style={{ color: fontColor }}
            className="p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300"
          >
            <p className="text-lg font-semibold">Vista previa del color de fuente</p>
            <p className="text-sm mt-1">Este texto muestra cómo se verá el color seleccionado</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Config;