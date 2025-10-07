###############################################################################
#                         IMPORT REQUIRED LIBRARIES/MODULES
###############################################################################
from flask import Flask  # The FLASK framework (the webserver)
from flask import render_template  # For opening and reading the HTML file and showing them as the webpage
from flask import request  # Allows me to get stuff from the URL (the ?)
from flask import redirect, url_for  # Use images from the static folder


app = Flask(__name__)


@app.route("/")         # Decorator - Place above any other app.route to set "homepage"
@app.route("/home")     # Decorator - Alias for the homepage
def home():
    return render_template('index.html')


@app.route("/about")    # Decorator - About page
def about():
    return render_template('about.html')


@app.route("/resume")   # Decorator - Resume page
def resume():
    return render_template('resume.html')


@app.route("/projects") # Decorator - Projects page
def projects():
    return render_template('projects.html')


@app.route("/contact")  # Decorator - Contact page
def contact():
    return render_template('contact.html')


@app.route("/thank-you") # Decorator - Thank you page
@app.route("/thankyou")  # Decorator - Alias for thank you page
def thank_you():
    return render_template('thankyou.html')


app.run(debug=True, port=8080)