function doGet() {
  return HtmlService.createTemplateFromFile('Index')
    .evaluate()
    .setTitle('Inventario Nautica Residences')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function getInventoryData() {
  try {
    const ID_ARCHIVO = "1AnzQ7tOewxyBWeC3xP0JR0cwVc8VMfpXXW7MOfP6QMI"; 
    const ID_CARPETA_FOTOS = "19CTh8dRUIR8a5okyfE_aTX4SQ833CW3I"; 
    
    const ss = SpreadsheetApp.openById(ID_ARCHIVO);
    const sheet = ss.getSheets()[0]; 
    const data = sheet.getDataRange().getValues();
    const headers = data[0].map(h => h.toString().toUpperCase().trim());
    
    let imageMap = {};
    try {
      const folder = DriveApp.getFolderById(ID_CARPETA_FOTOS);
      const files = folder.getFiles();
      while (files.hasNext()) {
        const file = files.next();
        const nameKey = file.getName().split('.')[0].trim().toUpperCase();
        imageMap[nameKey] = file.getId();
      }
    } catch (e) { console.log("Error Drive: " + e.message); }

    const findCol = (name) => headers.findIndex(h => h.includes(name.toUpperCase()));

    const col = {
      torre: findCol('TORRE'),
      unidad: findCol('UNIDAD'),
      recamaras: findCol('RECAMARA'),
      modelo: findCol('MODELO'),
      m2: findCol('M2'),
      vista: findCol('VISTA'),
      precio: findCol('PRECIO'),
      disponibilidad: findCol('DISPONIBILIDAD')
    };

    return data.slice(1)
      .filter(row => row[col.disponibilidad]?.toString().toUpperCase().trim() === 'SI')
      .map(row => {
        const modeloValue = row[col.modelo]?.toString().trim().toUpperCase() || "";
        const imageId = imageMap[modeloValue];
        const finalImageUrl = imageId ? `https://drive.google.com/thumbnail?id=${imageId}&sz=w1200` : "https://via.placeholder.com/800x600?text=Render+Nautica";

        return {
          torre: row[col.torre],
          unidad: row[col.unidad],
          recamaras: row[col.recamaras],
          modelo: row[col.modelo],
          m2: row[col.m2],
          vista: row[col.vista],
          precio: row[col.precio],
          imagen: finalImageUrl
        };
      });
  } catch (e) { return [{error: e.message}]; }
}
