require(Fuel.requireConfig.withAppPaths({ 'fuel-components': 'js/empty' }, ['fuel-core', 'fuel-controls']), ['jquery', 'underscore', 'gridView'], function ($, _) {

	$('#grid').fuelGridView({
		title: 'Members',
		width: 'auto',
		height: 'auto',
		showTitle: false,
		showSearch: false,
		showFilter: false,
		showViews: false,
		showButtons: true,
		showHeader: true,
		showColumnHeaders: true,
		showFooter: true,
		repeatColumns: 5,
		filterByDataField: 'type',
		gridFilterLabel: 'View by Type',
		noDataText: 'no results found for this criteria',
		gridFilters: [
			{ name: "All", value: "", selected: true },
			{ name: "Email", value: "EMAIL", selected: false },
			{ name: "Facebook Update", value: "FBPOST", selected: false },
			{ name: "Tweet", value: "TWEET", selected: false },
			{ name: "Mobile", value: "MOBILE", selected: false },
			{ name: "Facebook Page", value: "FBPAGE", selected: false },
			{ name: "Automation", value: "AUTOMATION", selected: false },
			{ name: "Event", value: "CUSTOM", selected: false },
			{ name: "Marketo", value: "MARKETO", selected: false }
		],
		onNeedData: onNeedGridData,
		views: {
			list: {
				columns: [
					{ text:"First Name", dataField:"first", sortable:false, searchable:true},
					{ text:"Last Name", dataField:"last", sortable:false, searchable:true },
					{ text:"Rank", dataField:"rank", sortable: false, searchable:false },
					{ text:"Actions", dataField:"actions", dataRenderer:renderActions, sortable: false, searchable:false }
				]
			}
		}
	});

	$(window).resize(function () {
		$('#grid').fuelGridView('resize');
	});

	function onNeedGridData(evt, data) {
		$.ajax({
			cache: false,
			url: '/members',
			success: function (data, status, xhr) {
				$('#grid').fuelGridView('loadData', data);
			},
			error: function (xhr, status, error) {
				console.log("error");
			}
		});
	}

	function renderActions(member) {
		var actionLinks = [];
		_(member.actions).each(function (action) {
			actionLinks.push('<a data-method="' + action.method + '" href="' + action.href + '">' + action.rel + '</a>');
		});
		return actionLinks.join(' ');
	}
});