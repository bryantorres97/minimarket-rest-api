const verificarCedula = (cedula) => {
  if (typeof cedula == 'string' && cedula.length == 10 && /^\d+$/.test(cedula)) {
    const digitos = cedula.split('').map(Number);
    const codigo_provincia = digitos[0] * 10 + digitos[1];
    // if (codigo_provincia >= 1 && (codigo_provincia <= 24 || codigo_provincia == 30) && digitos[2] < 6) {
    if ((codigo_provincia > 0 && codigo_provincia < 25) || codigo_provincia == 30) {
      const digito_verificador = digitos.pop();

      let digito_calculado =
        digitos.reduce((dig_previo, dig_actual, indice) => {
          return (
            dig_previo - ((dig_actual * (2 - (indice % 2))) % 9) - (dig_actual == 9) * 9
          );
        }, 1000) % 10;

      return digito_calculado === digito_verificador;
    }
  }

  return false;
};

module.exports = { verificarCedula };
