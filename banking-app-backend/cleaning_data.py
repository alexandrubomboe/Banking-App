import pandas as pd

# data scraping
def data_scraping(df: pd.DataFrame):
	df.drop(columns=['Completed Date', 'Fee', 'Currency', 'State'], inplace=True)
	df.rename({'Type': 'type', 'Product': 'product', 'Started Date': 'date', 'Description': 'description', 'Amount':'amount', 'Balance': 'balance'}, axis=1, inplace=True)
	df['date'] = pd.to_datetime(df['date'], format='%Y-%m-%d %H:%M:%S')
	return df

# total money sent/received each month
def yearly_or_monthly(df: pd.DataFrame, type: bool, timeframe: str):
	transfer = df[df['type'] == 'Transfer'].copy()
	transfer = transfer[~transfer['description'].str.contains('pocket', case=False, na=False)]
	# true - monthly, false - yearly
	# monthly charts
	if type == True:
		transfer['month'] = transfer['date'].dt.to_period('M')
		received_month = transfer[transfer['amount'] > 0].groupby('month')['amount'].sum()
		sent_month = transfer[transfer['amount'] < 0].groupby('month')['amount'].sum().abs()

		summary_month = pd.DataFrame({
			'Money Sent': sent_month,
			"Money Received": received_month
		}).fillna(0)
		summary_month.index = summary_month.index.astype(str)
		monthly = summary_month.loc[[timeframe]]
		return monthly
	else: # yearly charts
		transfer['year'] = transfer['date'].dt.to_period('Y')
		received_year = transfer[transfer['amount'] > 0].groupby('year')['amount'].sum()
		sent_year = transfer[transfer['amount'] < 0].groupby('year')['amount'].sum().abs()

		summary_year = pd.DataFrame({
			'Money Sent': sent_year,
			'Money Received': received_year
		}).fillna(0)

		summary_year.index = summary_year.index.astype(str)
		yearly = summary_year.loc[[timeframe]]
		return yearly

categories_dict =  {
	'Groceries': ['market', 'supermarket', 'stilfrutti', 'vending', 'trei', 'Trading', 'uni door', 'mega image', 'profi', 'kaufland', 'lidl', 'carrefour', 'penny', 'auchan', 'cora', 'zeman', 'inmedio'],
	'Food&Coffee': ['ponis', 'facultatea', 'jeans', 'mcdonald', 'kfc', 'arabian', 'pizza hut', 'chopstix', 'fornetti', '5togo',\
					'starbucks', 'tazz', 'glovo', 'restaurant', 'pub', 'bistro', 'food', 'kitchen', 'festin', 'burger'],
	'Transport': ['uber', 'bolt', 'lime', 'splash', 'metrorex', 'cfr', 'ct bus', 'stb', 'wizz', 'ryanair', 'tarom', 'bilete'],
	'Auto': ['rompetrol', 'omv', 'petrom', 'mol', 'lukoil', 'socar', 'auto total'],
	'Entertainment': ['beluga', 'club', 'apollo', 'neversea', 'extasy', 'superbet', 'casa pariurilor', 'cinema', 'netflix', 'spotify', 'steam', 'playstation', 'hbo', 'xbox', 'events'],
	'Shopping': ['flanco', 'altex', 'emag', 'dedeman', 'ikea', 'jysk', 'pepco', 'zara', 'h&m'],
	'Utilities': ['enel', 'e.on', 'engie', 'digi', 'vodafone', 'orange', 'telekom', 'apa nova', 'radet', 'intretinere', 'electrica'],
	'Health ': ['gym', 'farmacia', 'catena', 'dr max', 'help net', 'medlife', 'regina maria', 'synevo'],
	'Transfers': ['to ', 'payment from']
}

# categorise foods
def categories(df: pd.DataFrame, type: bool, timeframe: str):
	spendings = df[df['amount'] < 0].copy()
	spendings['category'] = 'Other'
	for category, words in categories_dict.items():
		pattern = '|'.join(words)
		mask = spendings['description'].str.contains(pattern, case=False, na=False)
		spendings.loc[mask, 'category'] = category
		
	spendings = spendings[['category', 'amount', 'date']]
	spendings['amount'] = spendings['amount'].abs()

	# monthly spendings
	if type == True:
		spendings['date'] = spendings['date'].astype(str)
		mask = spendings['date'].str.contains(timeframe, case=False, na=False)

		result = spendings[mask]
		result = result[['category', 'amount']]
		result = result.groupby('category')['amount'].sum()
		result.index.name = None
		monthly_spendings_categorised = result.sort_values()
		return monthly_spendings_categorised
	else:
		# yearly spendings
		spendings['date'] = spendings['date'].astype(str)
		mask = spendings['date'].str.contains(timeframe, case=False, na=False)

		result = spendings[mask]
		result = result[['category', 'amount']]
		result = result.groupby('category')['amount'].sum()
		result.index.name = None
		yearly_spendings_categorised = result.sort_values()
		return yearly_spendings_categorised