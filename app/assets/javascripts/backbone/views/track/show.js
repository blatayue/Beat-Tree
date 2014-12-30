BT.Views.TrackShow = Backbone.CompositeView.extend({
	initialize: function () {
		this.listenTo(this.model, 'sync', this.render);
	},
	
	events: {
		"click button.add-track-to-player": "swapTrack"
	},
	
	template: JST['backbone/templates/track/trackShow'],
	
	render: function () {
		var renderedContent = this.template({ track: this.model });
		this.$el.html(renderedContent)
		this.addPredecessorsView();
		this.addProgenyView();
		return this;
	},
	
	addPredecessorsView: function () {
		var predecessorView = new BT.Views.ConnectionsPredecessorsView({
			model: this.model
		});
		this.addSubview('#connections-predecessors-container', predecessorView);
	},
	
	addProgenyView: function () {
		var progenyView = new BT.Views.ConnectionsProgenyView({
			model: this.model
		});
		this.addSubview('#connections-progeny-container', progenyView);
	},
	
	swapTrack: function (event) {
		BT.Utils.changePlayerTrack(this.model.get('track_spotify_id'));
	}
});

BT.Views.ConnectionsProgenyView = Backbone.CompositeView.extend({
	initialize: function () {
		this.listenTo(this.model, "sync change", this.render);
	},
	
	events: {
		"click li.filter-options": "filterNodeView",
		"click li.add-progeny-node": "addSearchView"
	},
	
	template: JST['backbone/templates/track/connectionsViewProgeny'],
	
	render: function () {
		var renderedContent = this.template({ track: this.model });
		this.$el.html(renderedContent);
		this.addNodes(this.model.sampling_tracks);
		this.attachSubviews();
		return this;
	},
	
	addNodes: function (collection) {
		this.removeSubviews();
		this.$el.find('#nodes-container').empty();
		var that = this;
		if (collection.length > 0) {
			collection.each( function (track) {
				var nodeView = new BT.Views.TrackShowNodeView({
					model: track
				});
				that.addSubview('#nodes-container', nodeView);
			});
		} else {
			this.$el.find('#nodes-container').html(
				'<div class="no-node-placeholder">' +
					'<h3 class="text-center no-node-placeholder-text">' +
						'No Nodes To Show' +
					'</h3>' +
				'</div>');
		}

	},
	
	filterNodeView: function (event) {
		event.preventDefault();
		var option = $(event.currentTarget).data('option');
		this.$el.find('li.filter-options.active').removeClass('active')
		$(event.currentTarget).addClass('active');
		switch (option) {
			case 1:
				this.addNodes(this.model.sampling_tracks);
				break;
			case 2:
				this.addNodes(this.model.covering_tracks);
				break;
			case 3:
				this.addNodes(this.model.remixing_tracks);
				break;
			}
	},
	
	addSearchView: function (event) {
		event.preventDefault();
		$('#progeny-node-search-container').empty();
		$('#progeny-node-confirm-container').empty();
		$('#progeny-node-relationship-container').empty();
		var searchView = new BT.Views.trackShowSpotSearch({ parentModel: this });
		this.addSubview('#progeny-node-search-container', searchView);
	},
	
	addConfirmationView: function (model) {
		var searchView = this.subviews('#progeny-node-search-container')[0];
		this.removeSubview('#progeny-node-search-container', searchView);
		var confirmView = new BT.Views.nodeConfirmView({
			childModel: model,
			parentModel: this.model
		});
		this.addSubview('#progeny-node-confirm-container', confirmView);
	},

});


BT.Views.ConnectionsPredecessorsView = Backbone.CompositeView.extend({
	initialize: function () {
		this.listenTo(this.model, "sync change", this.render);
		this.listenTo(this.model.sampled_tracks, "add remove", this.render);
	},
	
	events: {
		"click li.filter-options": "filterNodeView",
		"click li.add-predecessor-node": "addSearchView"
	},
	
	template: JST['backbone/templates/track/connectionsViewPredecessors'],
	
	render: function () {
		var renderedContent = this.template({ track: this.model });
		this.$el.html(renderedContent);
		this.addNodes(this.model.sampled_tracks);
		this.attachSubviews();
		return this;
	},
	
	addNodes: function (collection) {
		this.removeSubviews();
		this.$el.find('#nodes-container').empty();
		var that = this;
		if (collection.length > 0) {
			collection.each( function (track) {
				var nodeView = new BT.Views.TrackShowNodeView({
					model: track
				});
				that.addSubview('#nodes-container', nodeView);
			});
		} else {
			this.$el.find('#nodes-container').html(
				'<div class="no-node-placeholder">' +
					'<h3 class="text-center no-node-placeholder-text">' +
						'No Nodes To Show' +
					'</h3>' +
				'</div>');
		}
	},
	
	filterNodeView: function (event) {
		event.preventDefault();
		var option = $(event.currentTarget).data('option');
		this.$el.find('li.filter-options.active').removeClass('active')
		$(event.currentTarget).addClass('active');
		switch (option) {
			case 1:
				this.addNodes(this.model.sampled_tracks);
				break;
			case 2:
				this.addNodes(this.model.covered_tracks);
				break;
			case 3:
				this.addNodes(this.model.remixed_tracks);
				break;
			}
	},
	
	addSearchView: function (event) {
		event.preventDefault();
		$('#predecessor-node-search-container').empty();
		$('#predecessor-node-confirm-container').empty();
		$('#predecessor-node-relationship-container').empty();
		var searchView = new BT.Views.trackShowSpotSearch({ parentModel: this });
		this.addSubview('#predecessor-node-search-container', searchView);
	},
	
	addConfirmationView: function (model) {
		var searchView = this.subviews('#predecessor-node-search-container')[0];
		this.removeSubview('#predecessor-node-search-container', searchView);
		var confirmView = new BT.Views.nodeConfirmView({
			childModel: this.model,
			parentModel: model
		});
		this.addSubview('#predecessor-node-confirm-container', confirmView);
	},
	
});

BT.Views.TrackShowNodeView = Backbone.CompositeView.extend({
	initialize: function () {
		this.listenTo(this.model, 'sync', this.render);
	},
	
	events: {
		"click button.add-node-to-player": "swapTrack"
	},
	
	template: JST['backbone/templates/track/largeNodeView'],
	
	render: function () {
		var renderedContent = this.template({ track: this.model });
		this.$el.html(renderedContent);
		return this;
	},
	
	swapTrack: function (event) {
		BT.Utils.changePlayerTrack(this.model.get('track_spotify_id'));
	}
});

//The following views are for the add node modal

BT.Views.trackShowSpotSearch = BT.Views.nodeSearch.extend({
	initialize: function (options) {
		this.parentModel = options.parentModel;
	},
	
	populateSpotResults: function (data) {
		var that = this;
		_(data.tracks.items).each( function (track) {
			var trackModel = BT.Utils.ParseTrack(track);
			var resultView = new BT.Views.TrackShowSpotSearchResult({ 
				model: trackModel,
				parentModel: that.parentModel
			});
			that.addSubview('#spot-search-results', resultView);
		});
	},

	populateBTResults: function (data) {
		var that = this;
		_(data).each( function(track) {
			var trackModel = new BT.Models.Track(track.track);
			var resultView = new BT.Views.TrackShowSpotSearchResult({
				model: trackModel,
				parentModel: that.parentModel
			});
			that.addSubview("#bt-search-results", resultView);
		});
	}

});

BT.Views.TrackShowSpotSearchResult = BT.Views.SearchResult.extend({
	initialize: function (options) {
		debugger
		this.parentModel = options.parentModel;
		this.model = options.model;
		this.previousView = options.previousView;
	},
	useExistingTrack: function (event) {
		this.parentModel.addConfirmationView(this.model);
	}
});

BT.Views.nodeConfirmView = Backbone.CompositeView.extend({
	initialize: function (options) {
		this.childModel = options.childModel;
		this.parentModel = options.parentModel;
	},
	
	events: {
		"click #create-relationship-btn": "createRelationship",
		"click #cancel-relationship-create": "cancelRelationship"
	},
	
	className: 'row',
	
	template: JST['backbone/templates/track/nodeComparison'],
	
	render: function () {
		var renderedContent = this.template({
			childModel: this.childModel,
			parentModel: this.parentModel
		});
		this.$el.html(renderedContent);
		return this;
	},
	
	createRelationship: function (event) {
		var option = $('#relation-dropdown').find(":selected").val();
		var proceed = false;
		switch(option){
			case "samples":
				this.childModel.set({new_samples: this.parentModel.id});
				proceed = true;
				break;
			case "covers":
				this.childModel.set({new_covers: this.parentModel.id});
				proceed = true;
				break;
			case "remixes":
				this.childModel.set({new_remixes: this.parentModel.id});
				proceed = true;
				break;
			default:
				console.log("Tampering with server requests in not a nice thing to do.");
		}
		if (proceed) {
			var that = this;
			this.childModel.save({},{
				success: function (model, response, options) {
					that.childModel.set(model.attributes);
					$('body').removeClass('modal-open');
				}
			});
		}
	},
	
	cancelRelationship: function (event) {
		$('.modal').modal('hide');
	}
})