BT.Views.Feed = Backbone.CompositeView.extend({
	initialize: function () {
		this.recentlyAdded = new BT.Collections.Tracks;
		var that = this;
		$.ajax({
			type: "GET",
			url: "http://www.beat-tree.com/api/tracks"
		}).done( function (data) {
			var tracks = BT.Utils.ParseTracksCollection(data);
			that.recentlyAdded.reset(tracks);
		});
		this.listenTo(this.recentlyAdded, 'reset', this.render);
		
		this.topUsersData = {};
		
		$.ajax({
			type: "GET",
			url: "api/users",
		}).done( function (data) {
			that.topUsersData = data
			that.addTopUsers(data);
		});
	},
	
	template: JST['backbone/templates/feed/feed'],
	
	render: function () {
		var renderedContent = this.template();
		this.$el.html(renderedContent);
		this.addRecentTracks();
		this.addTopUsers();
		return this;
	},
	
	addRecentTracks: function () {
		var that = this;
		this.recentlyAdded.each( function (trackObj) {
			var view = new BT.Views.RecentTrackMedia({ model: trackObj });
			that.addSubview('#recently-added-tracks-rows', view);
		});
	},
	
	addTopUsers: function () {
		var table = $('tbody.highscores')
		table.empty();
		var c = 1;
		_(this.topUsersData).each( function (highscore) {
			table.append(
				'<tr>' + '<th scope="row">' + c + '</th>' +
				'<td><a href="#users/' + highscore.user + '">' + highscore.user + '</a></td>' +
				'<td><strong>' + highscore.count + '</a></td>'
			);
			c++;
		});
	}
});

BT.Views.RecentTrackMedia = Backbone.CompositeView.extend({
	initialize: function () {},
	
	tagName: 'tr',
	
	className: 'track-item',
	
	template: JST['backbone/templates/feed/trackmedia'],
	
	render: function () {
		var renderedContent = this.template({ track: this.model });
		this.$el.html(renderedContent);
		return this;
	},
	
	goToTrack: function (event) {
		Backbone.history.navigate('#tracks/' + this.model.id, { trigger: true });
	}
});