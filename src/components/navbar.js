import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Dialog, Popover, Switch } from '@headlessui/react';
import { XIcon as XMarkIcon, MenuIcon as Bars3Icon } from '@heroicons/react/outline';
import { Es, Gb } from 'react-flags-select';
import logo from '../assets/logo/LaPalma.png';
import { useNavigate } from 'react-router-dom';


export default function Navbar({ toggleLanguage, isSpanish, store, actions }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [enabled, setEnabled] = useState(false);
  const navigate = useNavigate();  // Utiliza useNavigate aquí


  useEffect(() => {
    axios.get('http://localhost:5000/categories')
      .then((response) => {
        setCategories(response.data.categories);
      })
      .catch((error) => {
        console.error('Error al obtener las categorías', error);
      });
  }, []);

  const handleLogout = async () => {
    try {
      // Llama a la acción de logout desde el contexto
      await actions.logout();
      console.log('Logout exitoso');
    } catch (error) {
      console.error('Error al intentar cerrar sesión:', error);
    }
  };
  
  return (
    <header className="bg-white sticky top-0 z-50 mb-5">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-3 lg:px-8 animate-fade-right" aria-label="Global">
        <div className="flex lg:flex-1">
          <Link to="/" className="-m-1.5 p-1.5">
            <span className="sr-only">Granada La Palma SCA</span>
            <img className="h-8 w-auto" src={logo} alt="" />
          </Link>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Abrir menú principal</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <Popover.Group className="hidden lg:flex lg:gap-x-12 mr-10">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/categories/${category.id}`}
              className="text-sm font-semibold leading-6 text-gray-900"
              onClick={() => setMobileMenuOpen(false)}
            >
              {isSpanish ? category.nombreesp : category.nombreeng}
            </Link>
          ))}
        </Popover.Group>

        <Switch
          checked={enabled}
          onChange={setEnabled}
          className={`${
            enabled ? 'bg-blue-600' : 'bg-gray-200'
          } relative inline-flex h-6 w-11 items-center rounded-full`}
        >
          <span className="sr-only">Enable notifications</span>
          <span
            className={`${
              enabled ? 'translate-x-6' : 'translate-x-1'
            } inline-block h-4 w-4 transform rounded-full bg-white transition`}
          />
        </Switch>
        <div className="flex items-center ml-2">
          {/* Botón de cerrar sesión */}
          <button onClick={handleLogout} className="text-gray-900">
            Cerrar sesión
          </button>

          {/* Banderas de idioma */}
          {isSpanish ? <span style={{ fontSize: '20px' }}><Es /></span> : <span style={{ fontSize: '20px' }}><Gb /></span>}
        </div>
      </nav>

      <Dialog as="div" className="lg:hidden" open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)}>
        <div className="fixed inset-0 z-10" />
        <Dialog.Panel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <div className="-m-1.5 p-1.5">
              <span className="sr-only">Granada La Palma SCA</span>
              <img
                className="h-8 w-auto"
                src={logo}
                alt=""
              />
            </div>

            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>

          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    to={`/categories/${category.id}`}
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {isSpanish ? category.nombreesp : category.nombreeng}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>
    </header>
  );
}
