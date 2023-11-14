import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AdminCategory() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [nombreEsp, setNombreEsp] = useState('');
  const [nombreEng, setNombreEng] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [categories, setCategories] = useState([]);
  const [editCategoryId, setEditCategoryId] = useState(null);
  const [editCategoryData, setEditCategoryData] = useState({
    nombreesp: '',
    nombreeng: '',
    file: null,
  });
  const [showEditModal, setShowEditModal] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    // Realiza una solicitud GET para obtener las categorías
    axios.get("http://localhost:5000/categories", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
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
    setEditCategoryData({
      ...editCategoryData,
      file: event.target.files[0],
    });
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
            Authorization: `Bearer ${token}`
          },
        });
        if (response.status === 200) {
          setUploadedFileName(response.data.message);
          // Después de cargar la categoría con éxito, realiza una nueva solicitud GET para obtener la lista actualizada
          axios.get('http://localhost:5000/categories')
            .then((response) => {
              setCategories(response.data.categories);
            })
            .catch((error) => {
              console.error('Error al obtener las categorías después de cargar', error);
            });
        } else {
          console.error('Error al cargar la categoría con foto');
        }
      } catch (error) {
        console.error('Error al cargar la categoría con foto', error);
      }
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    try {
      const response = await axios.delete(`http://localhost:5000/categories/${categoryId}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
      });

      console.log(response.data.message); // Mensaje de éxito
      // Actualiza la lista de categorías después de eliminar
      setCategories(categories.filter(category => category.id !== categoryId));
    } catch (error) {
      console.error('Error en la solicitud:', error.response.data.error); // Mensaje de error
    }
  };

  const handleEditCategory = (categoryId) => {
    const selectedCategory = categories.find(category => category.id === categoryId);
    setEditCategoryId(categoryId);
    setEditCategoryData({
      nombreesp: selectedCategory.nombreesp,
      nombreeng: selectedCategory.nombreeng,
      file: null,
    });
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    const formData = new FormData();
    formData.append('nombreesp', editCategoryData.nombreesp);
    formData.append('nombreeng', editCategoryData.nombreeng);
    formData.append('file', editCategoryData.file);

    axios.put(`http://localhost:5000/categories/${editCategoryId}/edit`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`
      },
    })
      .then(response => {
        console.log('Edición exitosa:', response.data.message);
        // Actualiza la lista de categorías después de la edición
        axios.get('http://localhost:5000/categories')
          .then(response => {
            setCategories(response.data.categories);
          })
          .catch(error => {
            console.error('Error fetching categories:', error);
          });
      })
      .catch(error => {
        console.error('Error en la edición de la categoría:', error);
      });

    setShowEditModal(false);
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
      <ul>
        {categories.map(category => (
          <li key={category.id}>
            <strong>{category.nombreesp}</strong> - {category.nombreeng}
            {category.foto && (
              <img src={`http://localhost:5000/uploads/${category.foto}`} alt={category.nombreesp} />
            )}
            <button onClick={() => handleEditCategory(category.id)}>Editar</button>
            <button onClick={() => handleDeleteCategory(category.id)}>Borrar</button>
          </li>
        ))}
      </ul>

      {/* Modal de Edición */}
      {showEditModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setShowEditModal(false)}>&times;</span>
            <h2>Editar Categoría</h2>
            <label>Nombre en Español:</label>
            <input
              type="text"
              value={editCategoryData.nombreesp}
              onChange={(e) => setEditCategoryData({ ...editCategoryData, nombreesp: e.target.value })}
            />
            <label>Nombre en Inglés:</label>
            <input
              type="text"
              value={editCategoryData.nombreeng}
              onChange={(e) => setEditCategoryData({ ...editCategoryData, nombreeng: e.target.value })}
            />
            <label>Editar Foto:</label>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleSaveEdit}>Guardar Cambios</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminCategory;
