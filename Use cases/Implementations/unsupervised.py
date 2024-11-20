import pandas as pd
import altair as alt
from sklearn.cluster import KMeans, DBSCAN, AgglomerativeClustering
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import silhouette_score
from sklearn.model_selection import GridSearchCV, RandomizedSearchCV
import numpy as np

class UnsupervisedLearning:
    def __init__(self, data):
        """Initialize with the dataset (no target column required for unsupervised learning)"""
        self.data = data
        
        # Standardize the features for better clustering performance
        self.scaler = StandardScaler()
        self.data_scaled = self.scaler.fit_transform(data)

    def apply_kmeans(self, n_clusters=3):
        """Apply K-Means clustering to the data"""
        kmeans = KMeans(n_clusters=n_clusters, random_state=42)
        self.kmeans_labels = kmeans.fit_predict(self.data_scaled)
        return self.kmeans_labels

    def apply_dbscan(self, eps=0.5, min_samples=5):
        """Apply DBSCAN clustering to the data"""
        dbscan = DBSCAN(eps=eps, min_samples=min_samples)
        self.dbscan_labels = dbscan.fit_predict(self.data_scaled)
        return self.dbscan_labels

    def apply_agglomerative(self, n_clusters=3):
        """Apply Agglomerative Clustering to the data"""
        agglomerative = AgglomerativeClustering(n_clusters=n_clusters)
        self.agg_labels = agglomerative.fit_predict(self.data_scaled)
        return self.agg_labels

    def tune_kmeans(self, param_grid=None, search_method='grid'):
        """Tune hyperparameters for K-Means using GridSearchCV or RandomizedSearchCV"""
        kmeans = KMeans(random_state=42)
        
        # Define parameter grid if not provided
        if param_grid is None:
            param_grid = {'n_clusters': list(range(2, 11))}  # Number of clusters from 2 to 10

        if search_method == 'grid':
            search = GridSearchCV(kmeans, param_grid, cv=5, scoring=self.silhouette_scorer)
        elif search_method == 'random':
            search = RandomizedSearchCV(kmeans, param_grid, n_iter=10, cv=5, random_state=42, scoring=self.silhouette_scorer)
        else:
            raise ValueError("Unsupported search method. Use 'grid' or 'random'.")

        fitted = search.fit(self.data_scaled)
        
        best_params = search.best_params_
        best_score = search.best_score_
        best_kmeans_model = search.best_estimator_
        kmeans_labels = best_kmeans_model.labels_
        
        df = self.data
        df['KMeans_Labels_CV'] = kmeans_labels
        
        print(f"Best K-Means Parameters: {best_params}, Best Silhouette Score: {best_score}")
        return best_params, best_score, df

    def tune_dbscan(self, param_grid=None, search_method='grid'):
        """Tune hyperparameters for DBSCAN using GridSearchCV or RandomizedSearchCV"""
        dbscan = DBSCAN()
        
        # Define parameter grid if not provided
        if param_grid is None:
            param_grid = {
                'eps': np.linspace(0.1, 1.0, 10),  # Range of epsilon values
                'min_samples': list(range(3, 10))  # Minimum samples for cluster formation
            }

        if search_method == 'grid':
            search = GridSearchCV(dbscan, param_grid, cv=5, scoring=self.silhouette_scorer)
        elif search_method == 'random':
            search = RandomizedSearchCV(dbscan, param_grid, n_iter=10, cv=5, random_state=42, scoring=self.silhouette_scorer)
        else:
            raise ValueError("Unsupported search method. Use 'grid' or 'random'.")

        fitted = search.fit(self.data_scaled)
        
        best_params = search.best_params_
        best_score = search.best_score_
        best_kmeans_model = search.best_estimator_
        kmeans_labels = best_kmeans_model.labels_
        
        df = self.data
        df['DBSCAN_CV'] = kmeans_labels
        
        print(f"Best DBSCAN Parameters: {best_params}, Best Silhouette Score: {best_score}")
        return best_params, best_score, df

    def tune_agglomerative(self, param_grid=None, search_method='grid'):
        """Tune hyperparameters for Agglomerative Clustering using GridSearchCV or RandomizedSearchCV"""
        agg = AgglomerativeClustering()
        
        # Define parameter grid if not provided
        if param_grid is None:
            param_grid = {
                'n_clusters': list(range(2, 11)),  # Number of clusters from 2 to 10
                'linkage': ['ward', 'complete', 'average', 'single']  # Different linkage methods
            }

        if search_method == 'grid':
            search = GridSearchCV(agg, param_grid, cv=5, scoring=self.silhouette_scorer)
        elif search_method == 'random':
            search = RandomizedSearchCV(agg, param_grid, n_iter=10, cv=5, random_state=42, scoring=self.silhouette_scorer)
        else:
            raise ValueError("Unsupported search method. Use 'grid' or 'random'.")

        fitted = search.fit(self.data_scaled)
        
        best_params = search.best_params_
        best_score = search.best_score_
        best_kmeans_model = search.best_estimator_
        kmeans_labels = best_kmeans_model.labels_
        
        df = self.data
        df['agglomerative_CV'] = kmeans_labels
        
        print(f"Best Agglomerative Clustering Parameters: {best_params}, Best Silhouette Score: {best_score}")
        return best_params, best_score, df

    def silhouette_scorer(self, estimator, X):
        """Scorer function for calculating silhouette score."""
        cluster_labels = estimator.fit_predict(X)
        if len(set(cluster_labels)) > 1:  # More than 1 cluster
            score = silhouette_score(X, cluster_labels)
        else:
            score = -1  # Invalid clustering (only one cluster)
        return score

    def get_cluster_dataframe(self):
        """Return a DataFrame containing the original features, and the cluster labels for each method."""
        df = pd.DataFrame(self.data, columns=[f"Feature_{i}" for i in range(self.data.shape[1])])
        df['KMeans_Labels'] = self.kmeans_labels
        df['DBSCAN_Labels'] = self.dbscan_labels
        df['Agglomerative_Labels'] = self.agg_labels
        return df
