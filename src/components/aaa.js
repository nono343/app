// import React, { useState, useEffect, useRef } from 'react';

// const Aaa = () => {
//     const [mostrarFormulario, setMostrarFormulario] = useState(false);

//     const toggleFormulario = () => {
//         setMostrarFormulario(!mostrarFormulario);
//     };


//     return (
//         <div>
//             <div className="sm:flex sm:justify-center mb-5 lg:hidden">
//                 <div className="dropdown">
//                     <label tabIndex={0} className="btn btn-ghost btn-circle">
//                         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" /></svg>
//                     </label>
//                     <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
//                         <li>
//                             <a onClick={toggleFormulario}>
//                                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
//                                     <path strokeLinecap="round" strokeLinejoin="round" d="M6 6.878V6a2.25 2.25 0 012.25-2.25h7.5A2.25 2.25 0 0118 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 004.5 9v.878m13.5-3A2.25 2.25 0 0119.5 9v.878m0 0a2.246 2.246 0 00-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0121 12v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6c0-.98.626-1.813 1.5-2.122" />
//                                 </svg>
//                                 Categorías
//                             </a>
//                         </li>
//                         <li>
//                             <a>
//                                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
//                                     <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
//                                 </svg>
//                                 Productos
//                             </a>
//                         </li>
//                         <li>
//                             <a>
//                                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
//                                     <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
//                                 </svg>
//                                 Packaging
//                             </a>
//                         </li>
//                     </ul>
//                 </div>
//             </div>

//             <div className="sm:flex sm:justify-center mb-5 hidden">
//                 <ul className="menu  lg:menu-horizontal rounded-box">
//                     <li>
//                         <a onClick={toggleFormulario}>
//                             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
//                                 <path strokeLinecap="round" strokeLinejoin="round" d="M6 6.878V6a2.25 2.25 0 012.25-2.25h7.5A2.25 2.25 0 0118 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 004.5 9v.878m13.5-3A2.25 2.25 0 0119.5 9v.878m0 0a2.246 2.246 0 00-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0121 12v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6c0-.98.626-1.813 1.5-2.122" />
//                             </svg>
//                             Categorías
//                         </a>
//                     </li>
//                     <li>
//                         <a>
//                             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
//                                 <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
//                             </svg>
//                             Productos
//                         </a>
//                     </li>
//                     <li>
//                         <a>
//                             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
//                                 <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
//                             </svg>

//                             Packaging
//                         </a>
//                     </li>
//                 </ul>
//             </div>

//             {mostrarFormulario && (
//                 <div>
//                     <form className="grid md:grid-cols-3 gap-6 max-w-screen-xl mx-auto">
//                         <div>
//                             <label for="first_name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nombre categoría español</label>
//                             <input type="text" id="first_name" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="John" onChange={handleNombreEspChangeCategory} required />
//                         </div>
//                         <div>
//                             <label for="last_name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nombre categoría ingles</label>
//                             <input type="text" id="last_name" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Doe" onChange={handleNombreEngChangeCategory} required />
//                         </div>
//                         <div>
//                             <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white" for="file_input">Foto categoría</label>
//                             <input class="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" id="file_input" type="file" onChange={handleFileChangeCategory}/>
//                         </div>

//                         <div className='md:col-start-2 mx-auto'>
//                             <button onClick={handleUploadCategory} type="button" class="text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">Crear Categoría</button>
//                             {uploadedFileNameCategory && <p>Categoría subida: {uploadedFileNameCategory}</p>}
//                         </div>
//                     </form>

//                     <div className="max-w-screen-xl mx-auto overflow-x-auto">
//                     <table className="table">
//   {/* head */}
//   <thead>
//     <tr>
//       <th>Foto</th>
//       <th>Nombre</th>
//       <th>Nombre Inglés</th>
//     </tr>
//   </thead>
//   <tbody>
//     {categories.map(category => (
//       <tr key={category.id}>
//         <td>
//           {category.foto && (
//             <div className="flex items-center gap-3">
//               <div className="avatar">
//                 <div className="mask mask-squircle w-12 h-12">
//                   <img src={`http://localhost:5000/uploads/${category.foto}`} alt={category.nombreesp} />
//                 </div>
//               </div>
//             </div>
//           )}
//         </td>
//         <td>
//           <strong>{category.nombreesp}</strong>
//         </td>
//         <td>{category.nombreeng}</td>
//       </tr>
//     ))}
//   </tbody>
// </table>

//                     </div>
//                 </div>

//             )}
//         </div>
//     );
// };

// export default Aaa;
