import pandas as pd
from sklearn.svm import SVC
import matplotlib.pyplot as plt
from sklearn.cluster import KMeans
from sklearn.pipeline import Pipeline
from sklearn.metrics import accuracy_score
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import (
    train_test_split, 
    RandomizedSearchCV, 
    GridSearchCV
)
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier

class SupervisedLearning:
    def __init__(self, data, target_column):
        self.data = data
        self.target_column = target_column
        self.X = data.drop(columns=[target_column])
        self.y = data[target_column]
        
        # Standardize features
        self.scaler = StandardScaler()
        self.X_scaled = self.scaler.fit_transform(self.X)
        
        # Train/test split
        self.X_train, self.X_test, self.y_train, self.y_test = train_test_split(self.X_scaled, self.y, test_size=0.3, random_state=42)

    def classify(self, classifier='logistic', X_train=None, X_test=None):
        """Train and classify using different ML algorithms."""
        if classifier == 'logistic':
            model = LogisticRegression()
        elif classifier == 'random_forest':
            model = RandomForestClassifier()
        elif classifier == 'svm':
            model = SVC()
        else:
            raise ValueError("Unsupported classifier. Choose from 'logistic', 'random_forest', 'svm'.")
        
        # Train the model
        model.fit(X_train, self.y_train)
        
        # Make predictions
        predictions = model.predict(X_test)
        
        # Calculate accuracy
        accuracy = accuracy_score(self.y_test, predictions)
        print(f"Accuracy using {classifier}: {accuracy}")
        return accuracy

    def tune_hyperparameters(self, method='random', classifier='random_forest', param_grid=None, n_iter=10):
        """Tune hyperparameters using GridSearchCV or RandomizedSearchCV."""
        if classifier == 'random_forest':
            model = RandomForestClassifier()
        elif classifier == 'logistic':
            model = LogisticRegression()
        elif classifier == 'svm':
            model = SVC()
        else:
            raise ValueError("Unsupported classifier. Choose from 'logistic', 'random_forest', 'svm'.")
        
        if method == 'grid':
            search = GridSearchCV(estimator=model, param_grid=param_grid, cv=5, scoring='accuracy')
        elif method == 'random':
            search = RandomizedSearchCV(estimator=model, param_distributions=param_grid, n_iter=n_iter, cv=5, random_state=42, scoring='accuracy')
        else:
            raise ValueError("Unsupported tuning method. Choose 'grid' or 'random'.")
        
        search.fit(self.X_train, self.y_train)
        print("Best Hyperparameters:", search.best_params_)
        print("Best Cross-Validation Score:", search.best_score_)

        # Use the best model to predict on the test set
        best_model = search.best_estimator_
        predictions = best_model.predict(self.X_test)
        test_accuracy = accuracy_score(self.y_test, predictions)
        print(f"Test Accuracy using {classifier} with tuned parameters: {test_accuracy}")
        return search.best_params_, test_accuracy
