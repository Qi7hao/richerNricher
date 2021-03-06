
var LAST_DAY = 10;
var INIT_CASH = 100;

var DaContainer = React.createClass({
	getInitialState: function() {
		var items = [
				new Something('圆珠笔', 1),
				new Something('路边摊肉串', 10),
				new Something('二手自行车', 100),
				new Something('勾兑劣酒', 1000)
			];
		var market = {

		};
		for (var i in items) {
			items[i].updatePrice();
		}

		return {
			day: 1,
			money: INIT_CASH,
			totalAsset: INIT_CASH,
			items: items
		};
	},

	handleBuySellAction: function(itemId, quantityInput, isBuy) {
		this.setState(function(previousState, currentProps) {
			var quantity = parseInt(quantityInput);
			var items = previousState.items.slice();
			var money = previousState.money;
		
			if(quantity > 0 && itemId >= 0 && itemId < items.length){
				var item = items[itemId];
				var sumPrice = item.currentPrice * quantity;

				if(isBuy){
					if(money < sumPrice) {
						this.handleNotification("Money inhand not enough! Buying " + quantity + " " + item.itemName + " @" + item.currentPrice + " has: " + money);
						return ;
					} else {
						money -= sumPrice;
						item.inhandQuantity += quantity;
						item.inhandCost += sumPrice;
					}					
				} else {
					if(item.inhandQuantity < quantity) {
						this.handleNotification("Quantity inhand not enough! Selling " + quantity + " " + item.itemName + " @" + item.currentPrice + " has: " + item.inhandQuantity );
						return ;
					} else {
						money += sumPrice;
						item.inhandCost *= (1 - quantity/item.inhandQuantity);
						item.inhandQuantity -= quantity;
					}					
				}
				return { money: money, items: items};
			}
		});
	},

	handleNextDayAction: function(key, event) {
		/if(this.state.day + 1 > LAST_DAY){
			this.handleNotification("Last day! Total asset: " + this.state.totalAsset + ". Game reset...");
			this.replaceState(this.getInitialState());
		} else {
		/
		var items = this.state.items.slice();
		var sumValue = 0;
		for (var i in items) {
			items[i].updatePrice();
			sumValue += items[i].inhandQuantity * items[i].currentPrice;
		}	
		this.setState(function(previousState, currentProps) {
			var totalAsset = previousState.money + sumValue;
			return {
				day: previousState.day + 1,
				totalAsset: totalAsset,
				items: items
			};
		});

		this.handleNotification("It is day " + (this.state.day+1));		
		//}	
	},

	handleNotification: function(message, img) {
		alert(message);
	},

	render: function(){
		return (
			<div>
				<HeadingContainer day={this.state.day} totalAsset={this.state.totalAsset} />
				<MarketContainer items={this.state.items}/>
				<AssetContainer cash={this.state.money} stocks={this.state.items}/>
				<ControlContainer cash={this.state.money}
								  items={this.state.items}
								  onBuyClick={this.handleBuySellAction} 
								  onSellClick={this.handleBuySellAction}
								  onNextDayClick={this.handleNextDayAction} />
			</div>
			);
	}
});

var HeadingContainer = React.createClass({
	render: function(){
		return (
			<div className="heading-container">
				<div className="timer-container">
					Day: <span >{this.props.day}</span>
				</div>
				<div className="scores-container">
					Net Asset: <span >{this.props.totalAsset}</span>
				</div>
			</div>
		);
	}
});

var MarketContainer = React.createClass({
	render: function(){
		var items = this.props.items;
		return (
			<div className="market-container">
				<h2>市价</h2>
					{items.map(function(item) {
						return (
							<div>
								<span>{item.itemName}</span>
								<span>{item.currentPrice}</span>元
							</div>
							);
					})}
			</div>
		);
	}
});

var AssetContainer = React.createClass({
	render: function(){
		var stocks = this.props.stocks;
		return (
			<div className="asset-container">
				<h2>资产</h2>
				<div>
					Cash: <span>{this.props.cash}</span>
				</div>
				<div className="stock-container">
					{stocks.map(function(stock) {
						return (
							<div>
								<span>{stock.itemName}</span>
								<span>{stock.inhandQuantity} 个</span>
							</div>
						);
					})}
				</div>
			</div>
		);
	}
});

var ControlContainer = React.createClass({
	handleBuyAction: function () {
		this.props.onBuyClick(
            this.refs.buyItemIdInput.getDOMNode().value,
            this.refs.buyQuantityInput.getDOMNode().value,
            true
        );
	},

	handleSellAction: function () {
		this.props.onBuyClick(
            this.refs.sellItemIdInput.getDOMNode().value,
            this.refs.sellQuantityInput.getDOMNode().value,
            false
        );
	},

	render: function(){
		var items = this.props.items;
		return (
			<div className="control-container">
				<div className="buy-container">
					<select ref="buyItemIdInput">
						{items.map(function(item, index) {
							return (
								<option value={index}>{item.itemName}</option>
								);
						})}
					</select>
					<input type="number" ref="buyQuantityInput" />
					<button onClick={this.handleBuyAction} >Buy</button>
				</div>
				<div className="sell-container">
					<select ref="sellItemIdInput" >
						{items.map(function(item, index) {
							return (
								<option value={index}>{item.itemName}</option>
								);
						})}					
					</select>
					<input type="number" ref="sellQuantityInput" />
					<button onClick={this.handleSellAction}>Sell</button>
				</div>
				<div className="offwork-container">
					<br />
					<button onClick={this.props.onNextDayClick}>New Day</button>
				</div>
			</div>
		);
	}
});

React.render(<DaContainer />, document.getElementById('container'));

