from flask import Flask, render_template, jsonify
from flask_pymongo import PyMongo

app = Flask(__name__)

mongo = PyMongo(app, uri="mongodb://localhost:27017/happy_db")

@app.route('/')
def db_ping():

    return render_template('index.html', data = 'Happy?')
    
@app.route('/data')
def db_data():

    db_data = mongo.db.happy.find({}, {'_id': False, 'standard_error': False})
    ss_data = mongo.db.suicide.find({}, {'_id': False, 'hdi_for_year': False})
    data = {'happiness': [x for x in db_data], 'suicide': [x for x in ss_data]}
    print('this route was pinged')
    return jsonify(data)

@app.route('/pred')
def h_ping():

    return render_template('prediction.html')

@app.route('/data_pred')
def db_data2():

    pred_data = mongo.db.country_predict.find({}, {'_id': False, 'standard_error': False})
    data_2 = {'pred': [x for x in pred_data]}
    return jsonify(data_2)

if __name__ == '__main__':
    app.run(debug=True)