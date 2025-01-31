from flask import Flask, render_template
from waitress import serve
from flask import send_from_directory

app = Flask(__name__, static_folder="static", template_folder="templates")


# @app.route('/static/<path:filename>')
# def static_files(filename):
#     print(filename)
#     return send_from_directory('static', filename)


@app.route('/')
def home():
    return render_template('home.html')

@app.route('/projects')
def projects():
    return render_template('projects.html')

if __name__ == '__main__':
    serve(app, host='0.0.0.0', port=5000)
