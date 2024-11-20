import umap
import numpy as np
import pandas as pd
import altair as alt
from sklearn.manifold import TSNE
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler

class DimensionalityReduction:
    def __init__(self, data, target_column=None):
        """
        Initializes the DimensionalityReduction class.
        - data: DataFrame containing features and optionally the target column.
        - target_column: Name of the target column (for supervised learning), None for unsupervised learning.
        """
        self.data = data
        self.target_column = target_column
        
        # Handle features and target
        if target_column:
            self.X = data.drop(columns=[target_column])
            self.y = data[target_column]
        else:
            self.X = data
            self.y = None

        # Standardize features
        self.scaler = StandardScaler()
        self.X_scaled = self.scaler.fit_transform(self.X)

    def apply_pca(self, n_components=2):
        """Apply PCA for dimensionality reduction."""
        pca = PCA(n_components=n_components)
        X_pca = pca.fit_transform(self.X_scaled)
        return self._to_dataframe(X_pca, 'PCA')

    def apply_tsne(self, n_components=2, perplexity=50):
        """Apply t-SNE for dimensionality reduction."""
        tsne = TSNE(n_components=n_components, perplexity=perplexity, random_state=42)
        X_tsne = tsne.fit_transform(self.X_scaled)
        return self._to_dataframe(X_tsne, 't-SNE')

    def apply_umap(self, n_components=2):
        """Apply UMAP for dimensionality reduction."""
        umap_reducer = umap.UMAP(n_components=n_components, random_state=42)
        X_umap = umap_reducer.fit_transform(self.X_scaled)
        return self._to_dataframe(X_umap, 'UMAP')

    def _to_dataframe(self, X_reduced, method_name):
        """Helper function to convert reduced data to a DataFrame."""
        df = pd.DataFrame(X_reduced, columns=[f'{method_name}_Component_1', f'{method_name}_Component_2'])
        if self.y is not None:
            df[self.target_column] = self.y.values
        return df



class InteractivePlot:
    def __init__(self, data, target=None):
        """
        Initialize the class with the dataset.
        
        Parameters:
        data (pd.DataFrame): The DataFrame containing PCA, t-SNE, UMAP components and Class.
        """
        self.df = data
        self.brush = alt.selection_interval(encodings=['x', 'y'])  # Create selection

        # Define color-blind-friendly palette
        self.color_scheme = alt.Scale(scheme='viridis')
         
        self.target = target if target else None
        if self.target:
            self.tooltips = ['t-SNE_Component_1', 't-SNE_Component_2', self.target]
            self.color = alt.Color(
                self.target + ":O",
                scale=self.color_scheme,
                legend=alt.Legend(
                    orient='bottom',
                    direction='horizontal',
                    title=None
                )
            )
        else:
            self.tooltips = ['t-SNE_Component_1', 't-SNE_Component_2']
            self.color = alt.value('steelblue')
        # Common color encoding with a single legend
        self.color_encoding = self.color

    def create_tsne_chart(self):
        """
        Create the t-SNE chart.
        
        Returns:
        Altair Chart object for t-SNE.
        """
        tsne_chart = alt.Chart(self.df).mark_circle(size=100).encode(
            x='t-SNE_Component_1',
            y='t-SNE_Component_2',
            color=self.color_encoding,
            tooltip=self.tooltips
        ).add_params(
            self.brush
        ).properties(
            width=400,
            height=660  # Increased height for better visibility
        )
        return tsne_chart

    def create_pca_chart(self):
        """
        Create the PCA chart.
        
        Returns:
        Altair Chart object for PCA.
        """
        pca_chart = alt.Chart(self.df).mark_circle(size=100).encode(
            x='PCA_Component_1',
            y='PCA_Component_2',
            color=self.color_encoding,
            tooltip=self.tooltips
        ).transform_filter(
            self.brush
        ).properties(
            width=400,
            height=300
        )
        return pca_chart

    def create_umap_chart(self):
        """
        Create the UMAP chart.
        
        Returns:
        Altair Chart object for UMAP.
        """
        umap_chart = alt.Chart(self.df).mark_circle(size=100).encode(
            x='UMAP_Component_1',
            y='UMAP_Component_2',
            color=self.color_encoding,
            tooltip=self.tooltips
        ).transform_filter(
            self.brush
        ).properties(
            width=400,
            height=300
        )
        return umap_chart

    def create_combined_chart(self):
        """
        Create a combined chart layout with t-SNE on the left and PCA/UMAP on the right.
        
        Returns:
        Altair Chart object combining t-SNE, PCA, and UMAP.
        """
        # Combine the charts
        combined_chart = alt.hconcat(
            self.create_tsne_chart(), 
            alt.vconcat(self.create_pca_chart(), self.create_umap_chart())
        ).resolve_scale(
            color='independent'
        ).configure_legend(
            orient='bottom',
            direction='horizontal'
        )

        return combined_chart