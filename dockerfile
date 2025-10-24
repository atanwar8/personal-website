# 1️⃣ use python as base
FROM python:3.11-slim

# 2️⃣ set working directory inside container
WORKDIR /app

# 3️⃣ copy everything from your folder into the container
COPY . /app

# 4️⃣ install python packages
RUN pip install --no-cache-dir -r requirements.txt

# 5️⃣ expose flask port
EXPOSE 5000

# 6️⃣ run flask
CMD ["python", "app.py"]