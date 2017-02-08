(function($) {

	'use strict';

	// vars for graph's svg
	var sgGraph,
		sgGraphWidth = 1200,
		sgGraphHeight = 600;

	// vars for employee nodes
	var sgNodes,
		sgBgNodes,
		sgNodeSize = 40,
		sgNodeSpacing = 2;

	// vars for simulation
	var sgSimulation,
		sgForceStrength = 0.04,
		sgAlphaTarget = 0.4;



	var forceXSplitGender = d3.forceX(function(d) {
		var x = sgGraphWidth/3;
		if (d.gender === 'male') {
			x = 2*sgGraphWidth/3;
		}
		return x;
	}).strength(sgForceStrength);

	var forceXSplitDiscipline = d3.forceX(function(d) {
		var x = sgGraphWidth/4;
		if (d.discipline === 'frontend development' || d.discipline === 'visual design' || d.discipline === 'interaction design') {
			x = sgGraphWidth/2;
		} else if (d.discipline === 'backend development') {
			x = 4*sgGraphWidth / 5;
		}
		return x;
	}).strength(sgForceStrength);

	var forceXCombined = d3.forceX(sgGraphWidth / 2).strength(sgForceStrength);


	/**
	* create svg for graph
	* @returns {undefined}
	*/
	var createSvg = function() {
		sgGraph = d3.select('#chart');
	};


	/**
	* initialize the simulation
	* @returns {undefined}
	*/
	var initSimulation = function() {
		 sgSimulation = d3.forceSimulation()
			.force('forceX', forceXCombined)
			.force('forceY', d3.forceY(sgGraphHeight / 2).strength(sgForceStrength))
			.force('collide', d3.forceCollide(sgNodeSize + sgNodeSpacing));
	};




	/**
	* add nodes to screen
	* @returns {undefined}
	*/
	var addNodes = function(datapoints) {
		sgNodes = sgGraph.selectAll('.employee')
			.data(datapoints)
			.enter()
			.append('div')
			.attr('class', 'employee')
			.attr('style', function(d) {
				var backgroundImage = 'background-image: url("images/'+d.imageUrl+'");';
				return backgroundImage;
			})
			.attr('data-name', function(d) {
				var name = d.firstName;
				name += d.preposition ? ' ' + d.preposition : '';
				name += ' ' + d.lastName;
				return name;
			})
			// .on('mouseover', function(d) {
			// 	var name = d.firstName;
			// 	name += d.preposition ? ' ' + d.preposition : '';
			// 	name += ' ' + d.lastName
			// 	console.log(name);
			// });

		// for each employee, also add a background element
		sgBgNodes = sgGraph.selectAll('.employee__bg')
			.data(datapoints)
			.enter()
			.append('div')
			.attr('class', 'employee__bg');
	};


	/**
	* add nodes to screen
	* @returns {undefined}
	*/
	// var addNodesSvg = function(datapoints) {
	// 	sgNodes = sgGraph.selectAll('.employee')
	// 		.data(datapoints)
	// 		.enter()
	// 		.append('circle')
	// 		.attr('class', 'employee')
	// 		.attr('r', sgNodeSize)
	// 		.attr('fill', function(d) {
	// 			var fill = 'url(#' + d.id + ')';
	// 			return fill;
	// 		})
	// 		.on('mouseover', function(d) {
	// 			var name = d.firstName;
	// 			name += d.preposition ? ' ' + d.preposition : '';
	// 			name += ' ' + d.lastName
	// 			console.log(name);
	// 		});
	// };


	/**
	* define what happens on simulation's ticked event
	* @returns {undefined}
	*/
	var simulationTickHandler = function() {
		sgNodes
			.style('left', function(d) {
				return d.x + 'px';
			})
			.style('top', function(d) {
				return d.y + 'px';
			});
		sgBgNodes
			.style('left', function(d) {
				return d.x + 'px';
			})
			.style('top', function(d) {
				return d.y + 'px';
			});
	};


	/**
	* change a simulation force
	* @returns {undefined}
	*/
	var changeForce = function(forceId, newForce) {
		sgSimulation
			.force(forceId, newForce)
			.alphaTarget(sgAlphaTarget)
			.restart();
	};
	


	/**
	* initialize buttons
	* @returns {undefined}
	*/
	var initButtons = function() {
		
		d3.select('#split-by-gender').on('click', function() {
			changeForce('forceX', forceXSplitGender);
		});
		
		d3.select('#split-by-discipline').on('click', function() {
			changeForce('forceX', forceXSplitDiscipline);
		});

		d3.select('#combined').on('click', function() {
			changeForce('forceX', forceXCombined);
		});
	};
	
	

		// add defs
	function loadHandler(error, datapoints) {
		// addImageDefinitions(datapoints);

		// add shapes for nodes
		addNodes(datapoints);

		sgSimulation.nodes(datapoints)
			.on('tick', simulationTickHandler);
	}// loadHandler


	/**
	* load data and kick off rendering
	* @returns {undefined}
	*/
	var loadData = function() {
		d3.queue()
			.defer(d3.csv, 'data/employees.csv')
			.await(loadHandler);
	};



	// load data and kick things off

	/**
	* initialize all
	* @returns {undefined}
	*/
	var init = function() {
		createSvg();
		initSimulation();
		initButtons();

		// load data and kick things off
		loadData();
	};
	
	$(document).ready(init);

})(jQuery);