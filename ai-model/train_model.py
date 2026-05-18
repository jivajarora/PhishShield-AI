import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
import joblib
import os

# Dummy dataset generation for demonstration purposes
# In a real scenario, this would load a dataset like "phishing_urls.csv"
def generate_dummy_data(n_samples=1000):
    np.random.seed(42)
    # Features: URL length, contains_https, number_of_dots
    X = np.zeros((n_samples, 3))
    y = np.zeros(n_samples)
    
    for i in range(n_samples):
        # 0 = Safe, 1 = Phishing
        is_phishing = np.random.choice([0, 1])
        y[i] = is_phishing
        
        if is_phishing:
            X[i, 0] = np.random.randint(60, 150) # longer URLs
            X[i, 1] = np.random.choice([0, 1], p=[0.7, 0.3]) # less likely to have https
            X[i, 2] = np.random.randint(2, 6) # more subdomains/dots
        else:
            X[i, 0] = np.random.randint(20, 80) # shorter URLs
            X[i, 1] = np.random.choice([0, 1], p=[0.1, 0.9]) # more likely to have https
            X[i, 2] = np.random.randint(1, 3) # fewer dots

    return X, y

def train_and_save_model():
    print("Generating/Loading dataset...")
    X, y = generate_dummy_data(5000)
    
    print("Splitting dataset...")
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    print("Training RandomForest model...")
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)
    
    print("Evaluating model...")
    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    print(f"Model Accuracy: {accuracy * 100:.2f}%")
    
    print("Saving model to phishing_model.pkl...")
    model_path = os.path.join(os.path.dirname(__file__), 'phishing_model.pkl')
    joblib.dump(model, model_path)
    print("Done!")

if __name__ == "__main__":
    train_and_save_model()
