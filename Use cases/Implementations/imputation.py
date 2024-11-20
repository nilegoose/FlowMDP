import pandas as pd
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.impute import SimpleImputer

class Preprocessor:
    def __init__(self, dataframe):
        # Load dataset from file
        self.data = dataframe
        self.column_names = dataframe.columns.to_list()
    
    def handle_missing_values(self, strategy='mean', remove=False, exempt_columns=None):
        """Handle missing values by replacing them with a specified strategy or removing them."""
        if exempt_columns is None:
            exempt_columns = []
        
        if remove:
            # Remove rows with any missing values, excluding exempt columns
            self.data.dropna(subset=[col for col in self.data.columns if col not in exempt_columns], inplace=True)
            return
        
        # Use SimpleImputer to fill missing values
        imputer = SimpleImputer(strategy=strategy)
        
        # Handle missing values only in numeric columns not exempted
        numeric_cols = self.data.select_dtypes(include=['float64', 'int64']).columns
        numeric_cols = [col for col in numeric_cols if col not in exempt_columns]
        
        if numeric_cols:  # Check if there are numeric columns to impute
            self.data[numeric_cols] = imputer.fit_transform(self.data[numeric_cols])
        
        # For categorical columns, use the most frequent strategy, excluding exempt columns
        categorical_cols = self.data.select_dtypes(include=['object']).columns
        categorical_cols = [col for col in categorical_cols if col not in exempt_columns]
        
        if categorical_cols:  # Check if there are categorical columns to impute
            imputer_cat = SimpleImputer(strategy='most_frequent')
            self.data[categorical_cols] = imputer_cat.fit_transform(self.data[categorical_cols])
    
    def encode_categorical_features(self, exempt_columns=None):
        """Encode categorical features using Label Encoding, exempting specified columns."""
        if exempt_columns is None:
            exempt_columns = []
        
        label_encoders = {}
        
        # Apply LabelEncoder for categorical features
        categorical_cols = self.data.select_dtypes(include=['object']).columns
        categorical_cols = [col for col in categorical_cols if col not in exempt_columns]
        for col in categorical_cols:
            le = LabelEncoder()
            self.data[col] = le.fit_transform(self.data[col])
            label_encoders[col] = le
        
        return label_encoders
    
    def scale_numeric_features(self, exempt_columns=None):
        """Scale numeric features using StandardScaler, exempting specified columns."""
        if exempt_columns is None:
            exempt_columns = []
        
        scaler = StandardScaler()
        
        # Scale only numeric columns not exempted
        numeric_cols = self.data.select_dtypes(include=['float64', 'int64']).columns
        numeric_cols = [col for col in numeric_cols if col not in exempt_columns]
        self.data[numeric_cols] = scaler.fit_transform(self.data[numeric_cols])
    
    def preprocess(self, strategy='mean', remove_missing=False, exempt_columns=None):
        """Perform full preprocessing: handling missing values, encoding, and scaling."""
        self.handle_missing_values(strategy=strategy, remove=remove_missing, exempt_columns=exempt_columns)
        label_encoders = self.encode_categorical_features(exempt_columns=exempt_columns)
        self.scale_numeric_features(exempt_columns=exempt_columns)
        
        return self.data