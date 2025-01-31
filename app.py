from flask import Flask, render_template
from waitress import serve

app = Flask(__name__, static_folder="static", template_folder="templates")

@app.route('/')
def home():
    return render_template('home.html')

@app.route('/projects')
def projects():
    return render_template('projects.html')

if __name__ == '__main__':
    serve(app, host='0.0.0.0', port=5000)
