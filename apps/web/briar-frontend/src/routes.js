import HomePage from "./pages/homePage/HomePage";
import CreateEntry from "./pages/create Entry/CreateEntry";
import NotificationList from "./pages/notification list/NotificationList";
import UpdatePage from "./pages/update page/UpdatePage";
import ApprovePage from "./pages/approve page/ApprovePage";
import NotificationApprove from "./pages/notification approve/NotificationApprove";
import StockList from "./pages/Stock page/StockList";
import NotFoundPage from "./pages/not found/NotFoundPage";
import AzureADAuth from "./auth/AzureADAuth";
import StockUpdate from "./components/StockUpdate";

const routes = [
  { path: "/", component: AzureADAuth },
  { path: "/home", component: HomePage },
  { path: "/entry", component: CreateEntry },
  { path: "/list", component: NotificationList },
  { path: "/update/:NotificationNumber", component: UpdatePage },
  { path: "/approve", component: NotificationApprove },
  { path: "/approve/:NotificationNumber", component: ApprovePage },
  { path: "/stockList", component: StockList },
  { path: "/stockUpdate/:MaterialNumber", component: StockUpdate },
  { path: "*", component: NotFoundPage },
];

export default routes;
