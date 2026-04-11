/* eslint-disable react/jsx-key */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import LogoutButton from '../../small-components/LogoutButton';
import { useNavigate } from 'react-router-dom';
import StockReportForm from './StockReportForm';
import { encode } from 'js-base64';
import { useTable, useSortBy, useFilters } from 'react-table';
import { getStockHelp } from '../../api/stockHelp';
import useAccess, { Stock_Transf_Access } from '../../hooks/useAccess';
import NotFoundPage from '../not found/NotFoundPage';
import HomeButton from '../../small-components/HomeButton';
import { getStockReport } from '../../api/stockReport';
import LoadingSpinner from '../../small-components/LoadingSpinner';

const StockListTest = () => {
	const [reportData, setReportData] = useState([]);
	const navigate = useNavigate();
	const [loading, setLoading] = useState(true);

	const handleDataReceived = (response) => {
		setReportData(response);
		console.log('response passed to list', response);
	};

	const getStockList = async () => {
		try {
			const data = await getStockReport();
			const stockReport = data.ZV_MB52_BRType;
			setReportData(stockReport);
			setLoading(false);
			console.log(stockReport);
		} catch (error) {
			console.log(error);
			setLoading(false);
		}
	};
	useEffect(() => {
		getStockList();
	}, []);

	const formatStockQty = (stockQty) => {
		let numberValue = parseFloat(stockQty);
		if (!isNaN(numberValue)) {
			return numberValue.toFixed(2);
		} else {
			return stockQty;
		}
	};

	const handleRowClick = (item) => {
		navigate(`/stockUpdate/${encode(JSON.stringify(item))}`);
	};

	const columns = React.useMemo(
		() => [
			{
				Header: 'Material',
				accessor: 'material',
			},
			{
				Header: 'Material Description',
				accessor: 'material_desc',
			},
			{
				Header: 'Material Group',
				accessor: 'material_group',
			},
			{
				Header: 'Batch No',
				accessor: 'batch',
			},
			{
				Header: 'Storage Location',
				accessor: 'storage_location',
			},
			{
				Header: 'Quantity',
				accessor: 'STOCK_QTY',
				Cell: ({ value }) => formatStockQty(value),
			},
			{
				Header: 'Base Unit',
				accessor: 'base_unit',
			},
		],
		[],
	);

	const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
		useTable({ columns, data: reportData }, useFilters, useSortBy);

	return (
		<div>
			<div className='bg-[#71a311] text-xl px-2 h-12 flex items-center justify-between'>
				<HomeButton />
				<h1 className='text-white font-semibold'>Stock/Material List</h1>
				<LogoutButton />
			</div>
			{loading ? (
				<LoadingSpinner text='Loading...' />
			) : (
				<div className='mx-2 mb-10'>
					{reportData.length > 0 ? (
						<table
							{...getTableProps()}
							className='border-collapse w-full mt-4 table-fixed text-center'
						>
							<thead>
								{headerGroups.map((headerGroup) => (
									<tr
										{...headerGroup.getHeaderGroupProps()}
										className='text-xs'
									>
										{headerGroup.headers.map((column) => (
											<th
												{...column.getHeaderProps(
													column.getSortByToggleProps(),
												)}
												className='custom-border'
											>
												{column.render('Header')}
												<span>
													{column.isSorted
														? column.isSortedDesc
															? ' 🔽'
															: ' 🔼'
														: ''}
												</span>
												<div>
													{column.canFilter ? column.render('Filter') : null}
												</div>
											</th>
										))}
									</tr>
								))}
							</thead>
							<tbody {...getTableBodyProps()}>
								{rows.map((row) => {
									prepareRow(row);
									return (
										<tr
											{...row.getRowProps()}
											onClick={() => handleRowClick(row.original)}
											className='hover:bg-[#b4ed47] text-xs font-semibold cursor-pointer'
										>
											{row.cells.map((cell) => (
												<td {...cell.getCellProps()} className='custom-border'>
													{cell.render('Cell')}
												</td>
											))}
										</tr>
									);
								})}
							</tbody>
						</table>
					) : (
						<p className='text-center py-4'>No data available.</p>
					)}
				</div>
			)}
		</div>
	);
};

export default StockListTest;
