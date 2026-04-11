/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Routes, Route, BrowserRouter, Navigate } from 'react-router-dom';
import HomePage from './pages/homePage/HomePage';
import StockUpdate from './components/StockUpdate';
import CreateEntry from './pages/create Entry/CreateEntry';
import NotificationList from './pages/notification list/NotificationList';
import UpdatePage from './pages/update page/UpdatePage';
import ApprovePage from './pages/approve page/ApprovePage';
import NotificationApprove from './pages/notification approve/NotificationApprove';
import StockList from './pages/Stock page/StockList';
import NotFoundPage from './pages/not found/NotFoundPage';
import AzureADAuth from './auth/AzureADAuth';
import EngineeringPage from './pages/engineering page/EngineeringPage';
import LogisticsPage from './pages/logictics page/LogisticsPage';
import UnrestrictStockList from './pages/Stock page/UnrestrictStockList';
import BomPage from './pages/bom/BomPage';
import QualityControlPage from './pages/quality control page/QualityControl';
import QCRelease from './pages/qc release/QCRelease';
import QcUpdate from './components/QcUpdate';
import { useGroupData } from './context/groupData';
import Reservations from './pages/reservations page/Reservations';
import BlockRelease from './pages/block release/BlockRelease';

const App = () => {
	const { groupData } = useGroupData();
	console.log('home page rendering', groupData);

	const showPageLogistics = groupData.includes('SWI-LB');
	const showPageQualityControl = groupData.includes('SWI-QCA');
	const showPageApprove = groupData.includes('SWI-EA');
	const showPageBasic = groupData.includes('SWI-EB');
	return (
		<Routes>
			<Route path='/' element={<Navigate to='/home' replace />} />
			<Route path='/home' element={<HomePage />} />
			{(showPageBasic || showPageApprove) && (
				<Route path='/entry' element={<CreateEntry />} />
			)}
			{(showPageBasic || showPageApprove) && (
				<Route path='/list' element={<NotificationList />} />
			)}

			{(showPageBasic || showPageApprove) && (
				<Route path='/update/:NotificationNumber' element={<UpdatePage />} />
			)}

			{showPageApprove && (
				<Route path='/approve' element={<NotificationApprove />} />
			)}

			{showPageApprove && (
				<Route path='/approve/:NotificationNumber/:statusText' element={<ApprovePage />} />
			)}

			{showPageLogistics && <Route path='/stockList' element={<StockList />} />}


			{showPageLogistics && (
				<Route path='/stockUpdate/:MaterialNumber' element={<StockUpdate />} />
			)}

			<Route path='*' element={<NotFoundPage />} />

			{(showPageBasic || showPageApprove) && (
				<Route path='/engineering' element={<EngineeringPage />} />
			)}

			{showPageLogistics && (
				<Route path='/logistics' element={<LogisticsPage />} />
			)}
			{showPageBasic && <Route path='/bom' element={<BomPage />} />}
			{showPageQualityControl && (
				<Route path='/qc' element={<QualityControlPage />} />
			)}
			{showPageQualityControl && <Route path='/qcr' element={<QCRelease />} />}
			{showPageQualityControl && <Route path='/bqr' element={<BlockRelease />} />}
			{showPageQualityControl && <Route path='/unrestrictedStock' element={<UnrestrictStockList />} />}

			{showPageQualityControl && (
				<Route path='/qcUpdate/:MaterialNumber' element={<QcUpdate />} />
			)}
			{showPageApprove && (
				<Route path='/reservations' element={<Reservations />} />
			)}
		</Routes>
	);
};

export default App;
