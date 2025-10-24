import pytest
from app import app

@pytest.fixture
def client():
    # Flask provides a test client for unit testing
    with app.test_client() as client:
        yield client

def test_homepage(client):
    response = client.get('/')
    assert response.status_code == 200
    assert b"Aryan Tanwar" in response.data  # Change text if your homepage differs

def test_about_page(client):
    response = client.get('/about')
    assert response.status_code == 200
    assert b"About" in response.data

def test_projects_page(client):
    response = client.get('/projects')
    assert response.status_code == 200