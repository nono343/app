import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [nombreEsp, setNombreEsp] = useState('');
  const [nombreEng, setNombreEng] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Realiza una solicitud GET para obtener las categorías
    axios.get('http://localhost:5000/categories')
      .then((response) => {
        setCategories(response.data.categories);
        console.log('Respuesta del servidor:', response); // Imprime la respuesta en la consola

      })
      
      .catch((error) => {
        console.error('Error al obtener las categorías', error);
      });
  }, []);


  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleNombreEspChange = (event) => {
    setNombreEsp(event.target.value);
  };

  const handleNombreEngChange = (event) => {
    setNombreEng(event.target.value);
  };

  const handleUpload = async () => {
    if (selectedFile && nombreEsp && nombreEng) {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('nombreesp', nombreEsp);
      formData.append('nombreeng', nombreEng);

      try {
        const response = await axios.post('http://localhost:5000/upload_category', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        if (response.status === 200) {
          setUploadedFileName(response.data.message);
        } else {
          console.error('Error al cargar la categoría con foto');
        }
      } catch (error) {
        console.error('Error al cargar la categoría con foto', error);
      }
    }
  };

  return (
    <div className="App">
      <div>
        <input type="file" onChange={handleFileChange} />
        <input type="text" placeholder="Nombre en español" onChange={handleNombreEspChange} />
        <input type="text" placeholder="Nombre en inglés" onChange={handleNombreEngChange} />
        <button onClick={handleUpload}>Subir categoría con foto</button>
        {uploadedFileName && <p>Categoría subida: {uploadedFileName}</p>}
      </div>

      <h1>Categorías</h1>
      <ul>
        {categories.map((category) => (
          <li key={category.id}>
            <p>Nombre en español: {category.nombreesp}</p>
            <p>Nombre en inglés: {category.nombreeng}</p>
            <img src={`http://localhost:5000/uploads/${category.foto}`} alt={category.nombreesp} />
          </li>
        ))}
      </ul>

    </div>
  );
}

export default App;
