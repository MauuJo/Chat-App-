FROM python:3.12-slim

WORKDIR /app

# Copy and install dependencies first (better layer caching)
COPY ai-service/requirements.txt ./requirements.txt

RUN pip install --no-cache-dir -r requirements.txt

# Copy the ai-service source code
COPY ai-service/ ./

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
