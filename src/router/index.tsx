import { useRoutes } from 'react-router-dom'
import { constantRoutes } from './routes'
const useAppRoutes = () => {
  return useRoutes([...constantRoutes])
}
export default useAppRoutes
