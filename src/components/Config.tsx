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