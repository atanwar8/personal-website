###############################################################################
#                         IMPORT REQUIRED LIBRARIES/MODULES
###############################################################################
from flask import Flask  # The FLASK framework (the webserver)
from flask import render_template  # For opening and reading the HTML file and showing them as the webpage
from flask import request  # Allows me to get stuff from the URL (the ?)
from flask import redirect, url_for  # Use images from the static folder
from flask import flash  # For displaying messages to users
from DAL import ProjectDAL  # Import our Data Access Layer
import os


app = Flask(__name__)
app.secret_key = 'your-secret-key-here'  # Required for flash messages

# Add custom template filter to check if file exists
@app.template_filter('file_exists')
def file_exists(filename):
    return os.path.exists(filename)

# Initialize the database
project_dal = ProjectDAL()


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
    # Get all projects from the database
    projects = project_dal.get_all_projects()
    return render_template('projects.html', projects=projects)


@app.route("/contact")  # Decorator - Contact page
def contact():
    return render_template('contact.html')


@app.route("/add-project", methods=['GET', 'POST'])  # Decorator - Add project page
def add_project():
    if request.method == 'POST':
        # Get form data
        title = request.form.get('title')
        description = request.form.get('description')
        image_filename = request.form.get('image_filename')
        tech_stack = request.form.get('tech_stack', '')
        project_date = request.form.get('project_date', '')
        github_url = request.form.get('github_url', '')
        
        # Validate required fields
        if not title or not description or not image_filename:
            flash('Please fill in all required fields (Title, Description, and Image Filename)', 'error')
            return render_template('add_project.html')
        
        # Add project to database
        try:
            project_id = project_dal.add_project(title, description, image_filename, tech_stack, project_date, github_url)
            flash(f'Project "{title}" added successfully!', 'success')
            return redirect(url_for('projects'))
        except Exception as e:
            flash(f'Error adding project: {str(e)}', 'error')
            return render_template('add_project.html')
    
    return render_template('add_project.html')


@app.route("/thank-you") # Decorator - Thank you page
@app.route("/thankyou")  # Decorator - Alias for thank you page
def thank_you():
    return render_template('thankyou.html')


if __name__ == "__main__":
    import os
    port = int(os.environ.get("PORT", 5000))  # Use 5000 since container exposes 5000
    app.run(host="0.0.0.0", port=port, debug=True)