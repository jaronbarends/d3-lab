(function($) {

	'use strict';

	// vars for graph's svg
	var sgGraph,
		sgGraphWidth = 1200,
		sgGraphHeight = 600;

	// vars for employee nodes
	var sgNodes,
		sgNodeSize = 40,
		sgNodeSpacing = 5;

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
		sgGraph = d3.select('#chart')
					.append('svg')
					.attr('width', sgGraphWidth)
					.attr('height', sgGraphHeight)
					.append('g')
					.attr('transform', 'translate(0,0)');
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
	* add image defs for svg
	* @returns {undefined}
	*/
	var addImageDefinitions = function(datapoints) {
		var defs = d3.select('#imageDefs'),
			patterns = defs.selectAll('pattern')
				.data(datapoints)
				.enter()
				.append('pattern')
				.attr('width', '100%')
				.attr('height', '100%')
				.attr('patternContentUnits', 'objectBoundingBox')
				.attr('id', function(d) {
					return d.id;
				})
				.append('image')
				.attr('width', '1')
				.attr('height', '1')
				.attr('xmlns', 'http://w3.org/1999/xLink')
				.attr('xLink:href', function(d) {
					var imgUrl = 'images/'+d.imageUrl;
					return imgUrl;
				});

		return defs;
	};


	/**
	* add nodes to screen
	* @returns {undefined}
	*/
	var addNodes = function(datapoints) {
		sgNodes = sgGraph.selectAll('.employee')
			.data(datapoints)
			.enter()
			.append('circle')
			.attr('class', 'employee')
			.attr('r', sgNodeSize)
			.attr('fill', function(d) {
				var fill = 'url(#' + d.id + ')';
				return fill;
			})
			.on('mouseover', function(d) {
				var name = d.firstName;
				name += d.preposition ? ' ' + d.preposition : '';
				name += ' ' + d.lastName
				console.log(name);
			});
	};


	/**
	* define what happens on simulation's ticked event
	* @returns {undefined}
	*/
	var simulationTickHandler = function() {
		sgNodes
			.attr('cx', function(d) {
				return d.x;
			})
			.attr('cy', function(d) {
				return d.y;
			})
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
		addImageDefinitions(datapoints);

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