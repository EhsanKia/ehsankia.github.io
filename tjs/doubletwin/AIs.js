RandomAI = {
	compute: function(){
		var choice = {};
		var ind = Math.floor(Math.random()*game.hisCards.length);
		choice.card = game.hisCards.splice(ind,1)[0];
		ind = Math.floor(Math.random()*scene.highlightBoxes.length);
		choice.pos = scene.highlightBoxes.splice(ind,1)[0];
		return choice;
	}
}

MostFlipsAI = {
	compute: function(){
		var best_score = -1, best_card = -1, best_pos = -1;
		for (var i = 0; i < game.hisCards.length; i++) {
			for (var j = 0; j < scene.highlightBoxes.length; j++) {
				var score = MostFlipsAI.score(game.hisCards[i],scene.highlightBoxes[j]);
				if (score > best_score){
					best_score = score;
					best_card = i;
					best_pos = j;
				}
			};
		};

		var choice = {};
		choice.card = game.hisCards.splice(best_card,1)[0];
		choice.pos = scene.highlightBoxes.splice(best_pos,1)[0];
		return choice;
	},

	score: function (card, pos){
		var count = 0;
		// Check up
		if (pos.ind+3 < 9 && game.board[pos.ind+3] != undefined){
			var opp = game.board[pos.ind+3];
			if (opp.cardColor != card.cardColor && card.power[0] > opp.power[3])
				count += 1;
		}

		// Check left
		if ((pos.ind+2)%3 != 2 && game.board[pos.ind-1] != undefined){
			var opp = game.board[pos.ind-1];
			if (opp.cardColor != card.cardColor && card.power[1] > opp.power[2])
				count += 1;
		}

		// Check right
		if ((pos.ind+1)%3 != 0 && game.board[pos.ind+1] != undefined){
			var opp = game.board[pos.ind+1];
			if (opp.cardColor != card.cardColor && card.power[2] > opp.power[1])
				count += 1;
		}

		// Check down
		if (pos.ind-3 >= 0 && game.board[pos.ind-3] != undefined){
			var opp = game.board[pos.ind-3];
			if (opp.cardColor != card.cardColor && card.power[3] > opp.power[0])
				count += 1;
		}

		return count;
	}
}

MostFlipsAIEnhanced = {
	compute: function(){
		game.hisCards.sort(MostFlipsAI.sort_func);
		var best_score = -1, best_card = -1, best_pos = -1;
		for (var i = 0; i < game.hisCards.length; i++) {
			for (var j = 0; j < scene.highlightBoxes.length; j++) {
				var score = MostFlipsAI.score(game.hisCards[i],scene.highlightBoxes[j]);
				if (score > best_score){
					best_score = score;
					best_card = i;
					best_pos = j;
				}
			};
		};

		var choice = {};
		choice.card = game.hisCards.splice(best_card,1)[0];
		choice.pos = scene.highlightBoxes.splice(best_pos,1)[0];
		return choice;
	},

	score: function (card, pos){
		var count = 0;
		// Check up
		if (pos.ind+3 < 9 && game.board[pos.ind+3] != undefined){
			var opp = game.board[pos.ind+3];
			if (opp.cardColor != card.cardColor && card.power[0] > opp.power[3])
				count += 1 / MostFlipsAI.count_adj(pos.ind+3);
		}

		// Check left
		if ((pos.ind+2)%3 != 2 && game.board[pos.ind-1] != undefined){
			var opp = game.board[pos.ind-1];
			if (opp.cardColor != card.cardColor && card.power[1] > opp.power[2])
				count += 1 / MostFlipsAI.count_adj(pos.ind-1);
		}

		// Check right
		if ((pos.ind+1)%3 != 0 && game.board[pos.ind+1] != undefined){
			var opp = game.board[pos.ind+1];
			if (opp.cardColor != card.cardColor && card.power[2] > opp.power[1])
				count += 1 / MostFlipsAI.count_adj(pos.ind+1);
		}

		// Check down
		if (pos.ind-3 >= 0 && game.board[pos.ind-3] != undefined){
			var opp = game.board[pos.ind-3];
			if (opp.cardColor != card.cardColor && card.power[3] > opp.power[0])
				count += 1 / MostFlipsAI.count_adj(pos.ind-3);
		}

		return count;
	},

	count_adj: function (posind){
		var count = 0;
		// Check up
		if (posind+3 < 9 && game.board[posind+3] == undefined)
			count += 1;

		// Check left
		if ((posind+2)%3 != 2 && game.board[posind-1] == undefined)
			count +=1;


		// Check right
		if ((posind+1)%3 != 0 && game.board[posind+1] == undefined)
			count += 1;

		// Check down
		if (posind-3 >= 0 && game.board[posind-3] == undefined)
			count += 1;

		return count;
	},

	sort_func: function(a, b){
		v1 = a.power.reduce(function(a,b){return a + b}, 0)
		v2 = b.power.reduce(function(a,b){return a + b}, 0)

		if (v1 < v2)
			return -1;
		if (v1 > v2)
			return 1;
		return 0;
	}
}