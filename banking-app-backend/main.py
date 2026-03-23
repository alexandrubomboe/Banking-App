from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.responses import FileResponse
import io
import pandas as pd
import os
import cleaning_data
from fastapi.middleware.cors import CORSMiddleware

temp_file = "temp_file.csv"
app = FastAPI()

app.add_middleware(
	CORSMiddleware,
	allow_origins=["*"],
	allow_credentials=True,
	allow_methods=["*"],
	allow_headers=["*"],
)

@app.get('/user/file')
def get_file():
	if not os.path.exists(temp_file):
		raise HTTPException(status_code=404, detail="No file uploaded yet.")
	return FileResponse(temp_file, media_type='text/plain', filename='temp_file.csv')

# get the file from the frontend
@app.post('/user/upload_document')
async def upload_doc(file: UploadFile = File(...)):
	contents = await file.read()
	data = io.BytesIO(contents)
	df = pd.read_csv(data)
	df = cleaning_data.data_scraping(df)
	df.to_csv('temp_file.csv')
	return {'message': 'File saved!'}

# total money sent/received each month/year
@app.get('/user/transfers/{type}/{timeframe}/')
def sent_received(type: bool, timeframe: str):
	if not os.path.exists(temp_file):
		raise HTTPException(status_code=400, detail="Upload a file!")

	df = pd.read_csv(temp_file)
	df['date'] = pd.to_datetime(df['date'])
	period = cleaning_data.yearly_or_monthly(df, type, timeframe)

	if period.empty:
		return {
			'summary': {
				'Money Sent': 0,
				'Money Received': 0
			}, 'message': 'No information about this timeframe'
		}
	return {
		'summary': {
			'Money Sent': float(period['Money Sent'].iloc[0]),
			'Money Received': float(period['Money Received'].iloc[0])
		}
	}

@app.get('/user/spendings/{type}/{timeframe}')
def spendings(type: bool, timeframe: str):
	if not os.path.exists(temp_file):
		raise HTTPException(status_code=400, detail="Please upload a file!")
	
	df = pd.read_csv(temp_file)
	df['date'] = pd.to_datetime(df['date'])

	result = cleaning_data.categories(df, type, timeframe)

	if result.empty:
		raise HTTPException(status_code=404, detail="There is no information about this timeframe!")
	
	return {
		'summary': result.to_dict()
	}