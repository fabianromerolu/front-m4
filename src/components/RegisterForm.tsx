"use client"
import { useFormik } from 'formik';
import { RegisterFormValues, registerInitialValues, registerValidationSchema } from '@/validators/registerSchema';
import { RegisterUser } from '@/services/auth.service';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PATHROUTES from '@/utils/pathRoutes';

const RegisterForm = () => {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const router = useRouter();

  // Temporizador para redirección automática
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showSuccessModal && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (showSuccessModal && countdown === 0) {
      handleLoginRedirect();
    }
    return () => clearTimeout(timer);
  }, [showSuccessModal, countdown]);

  // Cerrar modal con ESC
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && showSuccessModal) {
        setShowSuccessModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showSuccessModal]);

  const formik = useFormik<RegisterFormValues>({
    initialValues: registerInitialValues,
    validationSchema: registerValidationSchema,
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      try {
        const res = await RegisterUser(values);
        console.log('Registro exitoso:', res);
        resetForm();
        setShowSuccessModal(true);
        setCountdown(5); // Reiniciar contador
      } catch (error) {
        console.error('Error en el registro:', error);
        formik.setStatus({ error: 'Ocurrió un error durante el registro. Por favor intenta nuevamente.' });
      } finally {
        setSubmitting(false);
      }
    }
  });

  const handleLoginRedirect = () => {
    setShowSuccessModal(false);
    router.push(PATHROUTES.LOGIN);
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
    setCountdown(5);
  };

  return (
    <>
      <form onSubmit={formik.handleSubmit} className="p-6 space-y-4">
        {/* Campo Nombre */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Nombre completo
          </label>
          <input
            id="name"
            type="text"
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-[var(--color-morado)] focus:border-[var(--color-morado)] transition-all duration-300"
            placeholder="Tu nombre completo"
          />
          {formik.errors.name && formik.touched.name && (
            <div className="text-red-600 text-sm mt-1 animate-fadeIn">{formik.errors.name}</div>
          )}
        </div>

        {/* Campo Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Correo electrónico
          </label>
          <input
            id="email"
            type="email"
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-[var(--color-morado)] focus:border-[var(--color-morado)] transition-all duration-300"
            placeholder="tucorreo@ejemplo.com"
          />
          {formik.errors.email && formik.touched.email && (
            <div className="text-red-600 text-sm mt-1 animate-fadeIn">{formik.errors.email}</div>
          )}
        </div>

        {/* Campo Dirección */}
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700">
            Dirección
          </label>
          <input
            id="address"
            name="address"
            type="text"
            placeholder="Tu dirección completa"
            value={formik.values.address}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-[var(--color-morado)] focus:border-[var(--color-morado)] transition-all duration-300"
          />
          {formik.touched.address && formik.errors.address && (
            <div className="text-red-600 text-sm mt-1 animate-fadeIn">
              {formik.errors.address}
            </div>
          )}
        </div>

        {/* Campo Teléfono */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            Teléfono
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            placeholder="+57 311 2708453"
            value={formik.values.phone}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-[var(--color-morado)] focus:border-[var(--color-morado)] transition-all duration-300"
          />
          {formik.touched.phone && formik.errors.phone && (
            <div className="text-red-600 text-sm mt-1 animate-fadeIn">
              {formik.errors.phone}
            </div>
          )}
        </div>

        {/* Campo Contraseña */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Contraseña
          </label>
          <input
            id="password"
            type="password"
            name="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-[var(--color-morado)] focus:border-[var(--color-morado)] transition-all duration-300"
            placeholder="••••••••"
          />
          {formik.errors.password && formik.touched.password && (
            <div className="text-red-600 text-sm mt-1 animate-fadeIn">{formik.errors.password}</div>
          )}
        </div>

        {/* Campo Confirmar Contraseña */}
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
            Confirmar Contraseña
          </label>
          <input
            id="confirmPassword"
            type="password"
            name="confirmPassword"
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-[var(--color-morado)] focus:border-[var(--color-morado)] transition-all duration-300"
            placeholder="••••••••"
          />
          {formik.errors.confirmPassword && formik.touched.confirmPassword && (
            <div className="text-red-600 text-sm mt-1 animate-fadeIn">{formik.errors.confirmPassword}</div>
          )}
        </div>

        {/* Checkbox Términos */}
        <div className="flex items-center">
          <input
            id="terms"
            type="checkbox"
            name="terms"
            checked={formik.values.terms}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="h-4 w-4 text-[var(--color-morado)] focus:ring-[var(--color-morado)] border-gray-300 rounded transition-all duration-300"
          />
          <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
            Acepto los <a href="/terminos" className="text-[var(--color-morado)] hover:underline">términos y condiciones</a>
          </label>
        </div>
        {formik.errors.terms && formik.touched.terms && (
          <div className="text-red-600 text-sm animate-fadeIn">{formik.errors.terms}</div>
        )}

        {/* Mensaje de error general */}
        {formik.status?.error && (
          <div className="p-3 bg-red-50 text-red-600 rounded-lg animate-fadeIn">
            {formik.status.error}
          </div>
        )}

        {/* Botón de Registro */}
        <div>
          <button
            type="submit"
            disabled={formik.isSubmitting}
            className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white transition-all duration-300 ${
              formik.isSubmitting 
                ? 'bg-[var(--color-morado-light)] cursor-not-allowed'
                : 'bg-[var(--color-morado)] hover:bg-[var(--color-morado-dark)] focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-morado)]'
            }`}
          >
            {formik.isSubmitting ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Registrando...
              </span>
            ) : "Registrarse"}
          </button>
        </div>
      </form>

      {/* Modal de Éxito */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 transform transition-all duration-300 scale-95 animate-scaleIn">
            <div className="text-center">
              {/* Icono de éxito animado */}
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 animate-bounce">
                <svg className="h-10 w-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              
              {/* Título y mensaje */}
              <h3 className="mt-4 text-lg font-medium text-gray-900">¡Registro exitoso!</h3>
              <div className="mt-2 text-sm text-gray-500">
                <p>Bienvenidx!! tu cuenta ha sido creada correctamente.</p>
              </div>
              
              {/* Temporizador */}
              <div className="mt-4 text-xs text-gray-400">
                Redireccionando en {countdown} segundos...
              </div>
              
              {/* Botones de acción */}
              <div className="mt-5 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-morado)] transition-all duration-300"
                >
                  Cerrar
                </button>
                <button
                  type="button"
                  onClick={handleLoginRedirect}
                  className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[var(--color-morado)] hover:bg-[var(--color-morado-dark)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-morado)] transition-all duration-300"
                >
                  Iniciar Sesión
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Estilos para animaciones */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out forwards;
        }
      `}</style>
    </>
  );
};

export default RegisterForm;