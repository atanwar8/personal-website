import sqlite3
import os
from datetime import datetime

class ProjectDAL:
    def __init__(self, db_path="projects.db"):
        self.db_path = db_path
        self.init_database()
    
    def init_database(self):
        """Initialize the database and create the projects table if it doesn't exist"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Create projects table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS projects (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                description TEXT NOT NULL,
                image_filename TEXT NOT NULL,
                tech_stack TEXT,
                project_date TEXT,
                github_url TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        conn.commit()
        conn.close()
    
    def get_all_projects(self):
        """Retrieve all projects from the database"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('SELECT * FROM projects ORDER BY created_at DESC')
        projects = cursor.fetchall()
        
        conn.close()
        return projects
    
    def get_project_by_id(self, project_id):
        """Retrieve a specific project by ID"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('SELECT * FROM projects WHERE id = ?', (project_id,))
        project = cursor.fetchone()
        
        conn.close()
        return project
    
    def add_project(self, title, description, image_filename, tech_stack="", project_date="", github_url=""):
        """Add a new project to the database"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO projects (title, description, image_filename, tech_stack, project_date, github_url)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (title, description, image_filename, tech_stack, project_date, github_url))
        
        project_id = cursor.lastrowid
        conn.commit()
        conn.close()
        
        return project_id
    
    def update_project(self, project_id, title, description, image_filename, tech_stack="", project_date="", github_url=""):
        """Update an existing project"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            UPDATE projects 
            SET title = ?, description = ?, image_filename = ?, tech_stack = ?, project_date = ?, github_url = ?
            WHERE id = ?
        ''', (title, description, image_filename, tech_stack, project_date, github_url, project_id))
        
        conn.commit()
        conn.close()
        
        return cursor.rowcount > 0
    
    def delete_project(self, project_id):
        """Delete a project from the database"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('DELETE FROM projects WHERE id = ?', (project_id,))
        
        conn.commit()
        conn.close()
        
        return cursor.rowcount > 0
    
    def search_projects(self, search_term):
        """Search projects by title or description"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT * FROM projects 
            WHERE title LIKE ? OR description LIKE ? OR tech_stack LIKE ?
            ORDER BY created_at DESC
        ''', (f'%{search_term}%', f'%{search_term}%', f'%{search_term}%'))
        
        projects = cursor.fetchall()
        conn.close()
        
        return projects
