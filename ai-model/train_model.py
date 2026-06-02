import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report
import joblib
import os
import urllib.request

DATASET_URL = "https://raw.githubusercontent.com/shreyagopal/Phishing-Website-Detection-by-Machine-Learning-Techniques/master/DataFiles/5.urldata.csv"
DATASET_FILENAME = "5.urldata.csv"

def download_dataset(url, destination):
    print(f"Downloading dataset from {url}...")
    try:
        urllib.request.urlretrieve(url, destination)
        print("Download complete.")
    except Exception as e:
        print(f"Failed to download dataset: {e}")
        raise

def load_data():
    current_dir = os.path.dirname(os.path.abspath(__file__))
    local_path = os.path.join(current_dir, DATASET_FILENAME)
    
    if not os.path.exists(local_path):
        download_dataset(DATASET_URL, local_path)
    else:
        print(f"Dataset already exists locally at: {local_path}")
        
    print("Loading dataset into memory...")
    df = pd.read_csv(local_path)
    
    # Selecting the 8 URL-only features we can reliably extract in real-time
    features = ['Have_IP', 'Have_At', 'URL_Length', 'URL_Depth', 'Redirection', 'https_Domain', 'TinyURL', 'Prefix/Suffix']
    X = df[features].values
    y = df['Label'].values
    
    return X, y

def train_and_save_model():
    X, y = load_data()
    
    print("Splitting dataset (80% train, 20% test)...")
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    print("Training RandomForest model (100 estimators)...")
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)
    
    print("Evaluating model...")
    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    print(f"Model Accuracy: {accuracy * 100:.2f}%")
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred))
    
    model_path = os.path.join(os.path.dirname(__file__), 'phishing_model.pkl')
    print(f"Saving model to {model_path}...")
    joblib.dump(model, model_path)
    print("Model saved successfully!")

if __name__ == "__main__":
    train_and_save_model()
