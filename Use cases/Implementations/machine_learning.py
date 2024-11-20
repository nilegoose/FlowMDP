import pandas as pd
import matplotlib.pyplot as plt
from sklearn.decomposition import PCA
from sklearn.manifold import TSNE
import umap
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split, RandomizedSearchCV, GridSearchCV
from sklearn.metrics import accuracy_score
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.svm import SVC
from sklearn.pipeline import Pipeline


class DimensionalityReductionAndClassification:
    def __init__(self, data, target_column):
        # Load data and split into features and target
        self.data = data
        self.target_column = target_column
        self.X = data.drop(columns=[target_column])
        self.y = data[target_column]
        
        # Standardize features
        self.scaler = StandardScaler()
        self.X_scaled = self.scaler.fit_transform(self.X)
        
        # Train/test split
        self.X_train, self.X_test, self.y_train, self.y_test = train_test_split(self.X_scaled, self.y, test_size=0.3, random_state=42)

    def apply_pca(self, n_components=2):
        """Apply PCA for dimensionality reduction."""
        pca = PCA(n_components=n_components)
        self.X_train_pca = pca.fit_transform(self.X_train)
        self.X_test_pca = pca.transform(self.X_test)
        print(f"PCA explained variance ratio: {pca.explained_variance_ratio_}")
        return self.X_train_pca, self.X_test_pca
    
    def apply_tsne(self, n_components=2):
        """Apply t-SNE for dimensionality reduction."""
        tsne = TSNE(n_components=n_components, random_state=42)
        self.X_train_tsne = tsne.fit_transform(self.X_train)
        self.X_test_tsne = tsne.transform(self.X_test)
        return self.X_train_tsne, self.X_test_tsne
    
    def apply_umap(self, n_components=2):
        """Apply UMAP for dimensionality reduction."""
        umap_reducer = umap.UMAP(n_components=n_components, random_state=42)
        self.X_train_umap = umap_reducer.fit_transform(self.X_train)
        self.X_test_umap = umap_reducer.transform(self.X_test)
        return self.X_train_umap, self.X_test_umap
    
    def visualize_2d(self, X, title='2D Visualization'):
        """Visualize the 2D reduced data."""
        plt.figure(figsize=(8, 6))
        plt.scatter(X[:, 0], X[:, 1], c=self.y_train, cmap='viridis', marker='o')
        plt.title(title)
        plt.colorbar(label=self.target_column)
        plt.show()

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