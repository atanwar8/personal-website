# Personal Portfolio Website - Flask Application

A modern, responsive personal portfolio website showcasing skills, projects, and professional experience. Built with Flask, HTML5, CSS3, and JavaScript, featuring AI-assisted development practices.

## GitHub Repository

**[View on GitHub](https://github.com/atanwar8/personal-portfolio)**

## Features

- **Flask Web Framework**: Dynamic routing and template rendering
- **SQLite Database**: Dynamic projects database with Data Access Layer (DAL)
- **Project Management**: Add, view, and manage projects through web interface
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Modern UI/UX**: Clean, professional design with smooth animations
- **Accessibility**: WCAG compliant with proper semantic HTML and keyboard navigation
- **Interactive Contact Form**: HTML5 validation with real-time feedback
- **Multi-page Structure**: Home, About, Resume, Projects, Add Project, and Contact pages
- **Cross-browser Compatibility**: Tested on Chrome, Firefox, Safari, and Edge

## Project Structure

```
Personal HTML/
├── app.py                  # Flask application with routes
├── DAL.py                  # Data Access Layer for database operations
├── populate_db.py          # Script to add sample data
├── projects.db             # SQLite database (created automatically)
├── requirements.txt        # Python dependencies
├── templates/              # HTML templates
│   ├── index.html         # Homepage
│   ├── about.html         # About Me page
│   ├── resume.html        # Resume/CV page
│   ├── projects.html      # Projects showcase (now database-driven)
│   ├── add_project.html   # Add new project form
│   ├── contact.html       # Contact form
│   └── thankyou.html      # Thank you page
├── static/                 # Static assets
│   ├── styles.css         # Main stylesheet
│   ├── script.js          # JavaScript functionality
│   ├── images/            # Image assets
│   │   ├── atanwar@iu.edu-4d222ff5.jpg
│   │   ├── placeholder.jpg # Placeholder for missing images
│   │   └── project1-dashboard/
│   │       ├── Dashbaord Main Page.jpeg
│   │       ├── Smart Odering Tab.jpeg
│   │       ├── Predictions Tab.jpeg
│   │       ├── Alerts Tab.jpeg
│   │       └── [more dashboard screenshots]
│   └── documents/         # Document assets
│       └── Aryan_Tanwar_Resume_2025.pdf
├── .prompt/               # AI development documentation
│   └── dev_notes.md       # AI prompts and reflection
└── README.md              # This file
```

## Technologies Used

- **Flask**: Python web framework for routing and template rendering
- **SQLite**: Lightweight database for storing project information
- **Jinja2**: Template engine for dynamic HTML generation
- **HTML5**: Semantic markup with accessibility features
- **CSS3**: Modern styling with Flexbox and Grid layouts
- **JavaScript**: Form validation and interactive features
- **Responsive Design**: Mobile-first approach with media queries
- **AI-Assisted Development**: GitHub Copilot/Cursor integration

## Key Features

### Homepage
- Hero section with professional introduction
- Quick overview cards
- Navigation to all sections

### About Me
- Detailed personal biography
- Professional interests and goals
- Values and principles

### Resume
- Complete professional experience
- Education background
- Technical skills showcase
- Downloadable PDF resume

### Projects
- **Database-Driven Display**: Projects are now stored in SQLite database
- **Dynamic Table View**: Projects displayed in responsive HTML table
- **Add Project Form**: Web interface to add new projects
- **Image Management**: Support for project images with fallback placeholder
- **Technology Stack**: Display tech stack as tags
- **GitHub Integration**: Direct links to project repositories

### Contact
- Interactive contact form with validation
- Contact information
- Social media links
- Form validation with error messages

### Add Project
- **Form Validation**: Required fields validation with error messages
- **Image Management**: Reference images by filename in static/images folder
- **Technology Stack**: Comma-separated list of technologies
- **GitHub Integration**: Optional repository URL
- **Flash Messages**: Success/error feedback after submission

## Database Schema

The `projects` table includes the following columns:
- `id`: Primary key (auto-increment)
- `title`: Project title (required)
- `description`: Project description (required)
- `image_filename`: Path to project image (required)
- `tech_stack`: Technologies used (optional)
- `project_date`: Project completion date (optional)
- `github_url`: GitHub repository URL (optional)
- `created_at`: Timestamp when project was added

## Form Validation

The contact form includes comprehensive validation:

- **Required Fields**: First Name, Last Name, Email, Password, Confirm Password
- **Email Format**: Valid email address pattern
- **Password Strength**: Minimum 8 characters
- **Password Confirmation**: Must match password field
- **Real-time Validation**: Immediate feedback as user types
- **Accessibility**: Proper labels and error messages

### Colors
- Primary: #3498db (Blue)
- Secondary: #2c3e50 (Dark Blue)
- Accent: #27ae60 (Green)
- Background: #f8f9fa (Light Gray)
- Text: #333 (Dark Gray)

### Typography
- Font Family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif
- Headings: 600 weight
- Body: 400 weight
- Line Height: 1.6

## Getting Started

### Prerequisites
- Python 3.7 or higher
- pip (Python package installer)

### Installation

1. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

2. **Run the Flask application**
   ```bash
   python app.py
   ```

3. **Open in browser**
   - Navigate to `http://127.0.0.1:5000/` in your web browser
   - The application will run in debug mode by default

### Alternative Routes
- Homepage: `/` or `/home`
- About: `/about`
- Resume: `/resume`
- Projects: `/projects`
- Add Project: `/add-project`
- Contact: `/contact`
- Thank You: `/thank-you` or `/thankyou`

### Database Setup
1. **Automatic Setup**: Database and table are created automatically on first run
2. **Sample Data**: Run `python populate_db.py` to add sample projects
3. **Manual Addition**: Use the web interface at `/add-project` to add projects

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## AI Development Notes

This project was developed using AI-assisted tools (GitHub Copilot/Cursor) with careful oversight and customization. See `.prompt/dev_notes.md` for detailed documentation of AI prompts used, decisions made, and reflections on the development process.

### AI Prompts Documented
- Initial website structure creation
- Contact form validation implementation
- Responsive CSS framework development
- Flask integration and migration

All AI interactions are documented with prompts, outputs, and decisions made during development.

## Author

**Aryan Tanwar**
- MSIS Student, Kelley School of Business
- Email: atanwar@iu.edu
- LinkedIn: [linkedin.com/in/aryantanwar](https://linkedin.com/in/aryantanwar)
- GitHub: [github.com/atanwar8](https://github.com/atanwar8)

---
