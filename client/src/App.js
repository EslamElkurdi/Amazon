import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from './MainLayout';
import Register from './users/register/Register';
import VerifyEmailAddress from './users/register/verifyemailaddress/VerfyEmailAddress';
import Login from './users/login/Login';
import LoginPassword from './users/login/loginPasswod/LoginPassword';
import ResetPassword from './users/resetPassword/ResetPassword';
import Finalcheckout from './components/Checkout/checkout';
import PrivateRoute from './PrivateRoute';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/register' element={<Register />} />
        <Route path='/verifyEmailAddress' element={<VerifyEmailAddress />} />
        <Route path='/login' element={<Login />} />
        <Route path='/loginPassword' element={<LoginPassword />} />
        <Route path='/resetPassword' element={<ResetPassword />} />
        <Route element={<PrivateRoute />}>
          <Route path='/finalcheckout' element={<Finalcheckout />} />
        </Route>

        {/* Routes */}
        
        <Route path='*' element={<MainLayout />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;