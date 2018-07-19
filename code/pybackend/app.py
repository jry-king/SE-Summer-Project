from flask import Flask, request

app = Flask(__name__)


@app.route('/')
def hello_world():
    return 'Hello World!'


@app.route("/<name>")
def test(name):
    return "User %s" % name


@app.route("/detect", methods=["GET"])
def detect():
    return "King detected"


if __name__ == '__main__':
    app.run()
