import { useFormik } from 'formik';
import { LoginFormVlaues, loginInitialValues, loginValidationSchema } from '@/validators/loginSchema';
import { LoginUser } from '@/services/auth.service';
import { useAuth } from '@/context/AuthContext';

const LoginForm = () => {
  const {setDataUser} = useAuth();

  const formik = useFormik<LoginFormVlaues>({
    initialValues: loginInitialValues,
    validationSchema: loginValidationSchema,
  onSubmit: async (values, { resetForm, setSubmitting }) => {
    try {
      const res = await LoginUser(values);
      setDataUser(res);
      console.log('login exitoso', res);
      resetForm();
    } catch (error) {
      console.error(error);
    } finally {
     setSubmitting(false);    // ← Asegura que isSubmitting vuelva a false
    }
  }
  });
    return(    
        <form onSubmit={formik.handleSubmit} className="p-6 space-y-6">
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
              className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-[var(--color-morado)] focus:border-[var(--color-morado)] transition-all"
              placeholder="tucorreo@ejemplo.com"
              required
            />
            {formik.errors.email && formik.touched.email ? (
              <div className='text-red-600'>
                {formik.errors.email}
              </div>
            ): null}
          </div>
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
              className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-[var(--color-morado)]focus:border-[var(--color-morado)] transition-all"
              placeholder="••••••••"
              required
            />
            {formik.errors.password && formik.touched.password ? (
              <div className='text-red-600'>
                {formik.errors.password}
              </div>
            ): null}
          </div>
          <div>
            <button
              type="submit"
              disabled={formik.isSubmitting}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[var(--color-morado)] hover:bg-morado/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-morado)] transition-all"
            >
              {formik.isSubmitting ? "Iniciando sesión..." : "Iniciar sesión"}
            </button>
          </div>
        </form>
    )
}

export default LoginForm