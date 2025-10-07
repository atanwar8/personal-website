#!/usr/bin/env python3
import requests
import time
import subprocess
import sys

def test_flask_app():
    """Test if Flask app is running and responding"""
    
    # Start Flask app in background
    print("Starting Flask application...")
    process = subprocess.Popen([sys.executable, 'app.py'], 
                              stdout=subprocess.PIPE, 
                              stderr=subprocess.PIPE)
    
    # Wait for app to start
    time.sleep(5)
    
    try:
        # Test homepage
        response = requests.get('http://localhost:5000/', timeout=10)
        if response.status_code == 200:
            print("✅ Homepage is working!")
        else:
            print(f"❌ Homepage returned status {response.status_code}")
        
        # Test other routes
        routes = ['/about', '/resume', '/projects', '/contact']
        for route in routes:
            response = requests.get(f'http://localhost:5000{route}', timeout=10)
            if response.status_code == 200:
                print(f"✅ {route} is working!")
            else:
                print(f"❌ {route} returned status {response.status_code}")
        
        print("\n🎉 Flask application is running successfully!")
        print("🌐 Open http://localhost:5000 in your browser to view the website")
        
    except requests.exceptions.ConnectionError:
        print("❌ Could not connect to Flask app. Make sure it's running.")
    except Exception as e:
        print(f"❌ Error testing Flask app: {e}")
    finally:
        # Clean up
        process.terminate()
        process.wait()

if __name__ == "__main__":
    test_flask_app()

