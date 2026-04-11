// sortingUtils.js

export const handleSort = (
	columnName,
	filteredData,
	sortOrder,
	setFilteredData,
	setSortOrder,
) => {
	const sortedFilteredArray = [...filteredData].sort((a, b) => {
		let comparison = 0;
		if (sortOrder === 'asc') {
			switch (columnName) {
				case 'Notification':
					comparison = a.Notification - b.Notification;
					break;
				case 'Reported_By':
					comparison = a.Reported_By.localeCompare(b.Reported_By);
					break;
				case 'Equipment_number':
					comparison = a.Equipment_number.localeCompare(b.Equipment_number);
					break;
				case 'equipment_desc':
					comparison = a.equipment_desc.localeCompare(b.equipment_desc);
					break;
				case 'funn_loca':
					comparison = a.funn_loca.localeCompare(b.funn_loca);
					break;
				case 'plan_grp':
					comparison = a.plan_grp.localeCompare(b.plan_grp);
					break;
				case 'plant_section':
					comparison = a.plant_section.localeCompare(b.plant_section);
					break;
				case 'manit_order':
					comparison = a.manit_order.localeCompare(b.manit_order);
					break;
				case 'activity_type':
					comparison = a.activity_type.localeCompare(b.activity_type);
					break;
				default:
					break;
			}
		} else {
			// Descending order
			switch (columnName) {
				case 'Notification':
					comparison = b.Notification - a.Notification;
					break;
				case 'Reported_By':
					comparison = b.Reported_By.localeCompare(a.Reported_By);
					break;
				case 'Equipment_number':
					comparison = b.Equipment_number.localeCompare(a.Equipment_number);
					break;
				case 'equipment_desc':
					comparison = b.equipment_desc.localeCompare(a.equipment_desc);
					break;
				case 'funn_loca':
					comparison = b.funn_loca.localeCompare(a.funn_loca);
					break;
				case 'plan_grp':
					comparison = b.plan_grp.localeCompare(a.plan_grp);
					break;
				case 'plant_section':
					comparison = b.plant_section.localeCompare(a.plant_section);
					break;
				case 'manit_order':
					comparison = b.manit_order.localeCompare(a.manit_order);
					break;
				case 'activity_type':
					comparison = b.activity_type.localeCompare(a.activity_type);
				default:
					break;
			}
		}
		return comparison;
	});
	setFilteredData(sortedFilteredArray);
	setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
};
