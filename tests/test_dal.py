import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
import os
import sqlite3
import pytest
from DAL import ProjectDAL

TEST_DB = "test_projects.db"

@pytest.fixture
def dal():
    """Fixture to create and clean up a temporary test database."""
    # Ensure a clean DB each run
    if os.path.exists(TEST_DB):
        os.remove(TEST_DB)
    dal = ProjectDAL(db_path=TEST_DB)
    yield dal
    if os.path.exists(TEST_DB):
        os.remove(TEST_DB)

def test_database_initialization(dal):
    """Check if the table is created properly."""
    conn = sqlite3.connect(TEST_DB)
    cursor = conn.cursor()
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='projects';")
    result = cursor.fetchone()
    conn.close()
    assert result is not None, "Projects table should exist after initialization."

def test_add_and_get_project(dal):
    """Ensure that we can insert and retrieve a project."""
    new_id = dal.add_project(
        title="Test Project",
        description="Testing DAL insert",
        image_filename="test.png",
        tech_stack="Python, Flask",
        project_date="2025-10-24",
        github_url="https://github.com/example"
    )
    project = dal.get_project_by_id(new_id)
    assert project is not None
    assert project[1] == "Test Project"
    assert project[2] == "Testing DAL insert"

def test_get_all_projects_returns_list(dal):
    """Ensure get_all_projects returns a list (even if empty)."""
    projects = dal.get_all_projects()
    assert isinstance(projects, list)

def test_update_project(dal):
    """Ensure that updating a project actually changes values."""
    project_id = dal.add_project("Old", "Desc", "img.png")
    success = dal.update_project(project_id, "New Title", "New Desc", "new_img.png")
    assert success is True
    updated = dal.get_project_by_id(project_id)
    assert updated[1] == "New Title"

def test_delete_project(dal):
    """Ensure a project can be deleted."""
    project_id = dal.add_project("Temp", "To Delete", "temp.png")
    deleted = dal.delete_project(project_id)
    assert deleted is True
    project = dal.get_project_by_id(project_id)
    assert project is None

def test_search_projects(dal):
    """Ensure search works correctly."""
    dal.add_project("AI System", "Testing search", "ai.png", tech_stack="AI")
    results = dal.search_projects("AI")
    assert any("AI" in r[1] or "AI" in r[2] or "AI" in (r[4] or "") for r in results)