import './App.css';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import PrivateRoute from './auth/PrivateRoute';
import DashBoard from './pages/DashBoard';
import Signin from './pages/Signin';
import CarsPage from './pages/CarsPage';
import NotFound from './pages/NotFound';
import AddCarsPage from './pages/AddCarsPage';
import AddCategoryPage from './pages/AddCategoryPage';
import CarCategory from './pages/CarCategory';
import UpdateCategoryPage from './pages/UpdateCategoryPage';
import UpdateCarPage from './pages/UpdateCarPage';
import DriverPage from './pages/DriverPage';
import AddDriverPage from './pages/AddDriverPage';
import LocationPage from './pages/LocationPage';
import UsersPage from './pages/UsersPage';
import UpdateDriverPage from './pages/UpdateDriverPage';
import TariffPage from './pages/TariffPage';
import AddTariff from './pages/AddTariff';
import UpdateTariffPage from './pages/UpdateTariffPage';

function App() {
  return ( 
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={DashBoard} />
        <Route path="/signin" exact component={Signin} />
        <PrivateRoute path="/cars" exact component={CarsPage}/>
        <PrivateRoute path="/add-cars" exact component={AddCarsPage}/>
        <PrivateRoute path="/category" exact component={CarCategory} />
        <PrivateRoute path="/add-category" exact component={AddCategoryPage} />
        <PrivateRoute path="/update/category/:categoryId" exact component={UpdateCategoryPage} />
        <PrivateRoute path="/update/car/:carId" exact component={UpdateCarPage} />
        <PrivateRoute path="/location" exact component={LocationPage} />
        <PrivateRoute path="/driver" exact component={DriverPage} />
        <PrivateRoute path="/add-driver" exact component={AddDriverPage} />
        <PrivateRoute path="/update/driver/:driverId" exact component={UpdateDriverPage} />
        <PrivateRoute path="/users" exact component={UsersPage} />
        <PrivateRoute path="/tariff" exact component={TariffPage} />
        <PrivateRoute path="/add-tariff" exact component={AddTariff} />
        <PrivateRoute path="/update/tariff/:tariffId" exact component={UpdateTariffPage} />
        <Route component={NotFound} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
