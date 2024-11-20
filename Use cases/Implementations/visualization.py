import numpy as np
import altair as alt
import pandas as pd
import plotly.express as px
import ipywidgets as widgets
import plotly.graph_objects as go
from scipy.cluster import hierarchy
from plotly.subplots import make_subplots
from sklearn.ensemble import IsolationForest

def create_combined_chart(
    df,
    x="PCA_Component_1",
    y="PCA_Component_2",
    color_column="Class2",
    main_attr_color_range=["#1f77b4", "#ff7f0e"],
    main_color_domain=["benign", "malignant"],
    main_color_range=["#1f77b4", "#ff7f0e"],
    attr_color_domain=[
        "benign Attr 1",
        "malignant Attr 1",
        "benign Attr 2",
        "malignant Attr 2",
    ],
    attr_color_range=["#1f77b4", "#ff7f0e", "#1f77b4", "#ff7f0e"],
    jitter_size=20,
    width=400,
    height=300,
    width_single=800,
    height_single=400,
    attribute_nomeclature=["Attr 1", "Attr 2"],
):
    """
    Create a combined Altair chart with scatter plot, jittered strip plot,
    histogram, and box plot.

    Parameters:
        df (pd.DataFrame): The DataFrame containing the data for visualization.
        ...
    """

    # Check for NaN values and drop them
    df = df.dropna(subset=[x, y, color_column])

    # Define a selection for brushing
    brush = alt.selection_interval(encodings=["x", "y"])

    # Create the scatter plot for brushing
    scatter_plot = (
        alt.Chart(df)
        .mark_circle(size=jitter_size)
        .encode(
            x=f"{x}:Q",
            y=f"{y}:Q",
            color=alt.condition(
                brush,
                alt.Color(
                    color_column + ":N",
                    scale=alt.Scale(domain=main_color_domain, range=main_color_range),
                ),
                alt.value("lightgray"),
            ),
        )
        .add_params(brush)
        .properties(
            width=width,
            height=height,
        )
    )
    
    
     # Create the scatter plot for brushing
    scatter_plot_single = (
        alt.Chart(df)
        .mark_circle(size=jitter_size)
        .encode(
            x=f"{x}:Q",
            y=f"{y}:Q",
            color=alt.Color(
                color_column + ":N",
                scale=alt.Scale(domain=main_color_domain, range=main_color_range),
            )
        )
        .properties(
            width=width_single,
            height=height_single,
        )
    )

    # Create the jittered chart using transformations
    gaussian_jitter = (
        alt.Chart(df)
        .transform_fold([x, y], as_=["Component", "Value"])
        .transform_calculate(
            attribute_with_label=f'datum.{color_column} + " " + (datum.Component == "{x}" ? "{attribute_nomeclature[0]}" : "{attribute_nomeclature[1]}")'
        )
        .transform_calculate(jitter="sqrt(-2*log(random()))*cos(2*PI*random())")
        .encode(
            y=alt.Y(
                "attribute_with_label:N",
                sort=attr_color_domain,
                axis=alt.Axis(grid=True, tickBand="extent"),
            ),
            x="Value:Q",
            yOffset="jitter:Q",
            color=alt.condition(
                brush,
                alt.Color(
                    "attribute_with_label:N",
                    scale=alt.Scale(domain=attr_color_domain, range=attr_color_range),
                    sort=attr_color_domain
                ),
                alt.value("lightgray"),
            ),
        )
        .transform_filter(brush)
        .mark_circle(size=jitter_size)
        .properties(
            width=width, height=height,
        )
    ).interactive()
    
    gaussian_jitter_single = (
        alt.Chart(df)
        .transform_fold([x, y], as_=["Component", "Value"])
        .transform_calculate(
            attribute_with_label=f'datum.{color_column} + " " + (datum.Component == "{x}" ? "{attribute_nomeclature[0]}" : "{attribute_nomeclature[1]}")'
        )
        .transform_calculate(jitter="sqrt(-2*log(random()))*cos(2*PI*random())")
        .encode(
            y=alt.Y(
                "attribute_with_label:N",
                sort=attr_color_domain,
                axis=alt.Axis(grid=True, tickBand="extent"),
            ),
            x="Value:Q",
            yOffset="jitter:Q",
            color=alt.Color(
                "attribute_with_label:N",
                scale=alt.Scale(domain=attr_color_domain, range=attr_color_range),
                sort=attr_color_domain
            )
        )
        .mark_circle(size=jitter_size)
        .properties(
            width=width_single, height=height_single,
        )
    ).interactive()
    

    # Create the histogram shade with binning
    histogram_shade = (
        alt.Chart(df)
        .transform_fold([x, y], as_=["Experiment", "Measurement"])
        .mark_bar(opacity=0.3, binSpacing=0)
        .encode(
            alt.X("Measurement:Q").bin(maxbins=50),
            alt.Y("count()", title="Count"),
            alt.Color(
                "Experiment:N", scale=alt.Scale(domain=[x, y], range=main_attr_color_range),
                sort=[x, y]
            ),
        )
        .transform_filter(brush)
        .properties(
            width=width,
            height=height,
        )
        .interactive()
    )
    
    histogram_shade_single = (
        alt.Chart(df)
        .transform_fold([x, y], as_=["Experiment", "Measurement"])
        .mark_bar(opacity=0.3, binSpacing=0)
        .encode(
            alt.X("Measurement:Q").bin(maxbins=50),
            alt.Y("count()", title="Count"),
            alt.Color(
                "Experiment:N", scale=alt.Scale(domain=[x, y], range=main_attr_color_range),
                sort=[x, y]
            ),
        )
        .properties(
            width=width_single,
            height=height_single,
        ).interactive()
    )

    # Create the box plot
    box_plot = (
        alt.Chart(df)
        .transform_fold([x, y], as_=["Component", "Value"])
        .transform_calculate(
            attribute_with_label=f'datum.{color_column} + " " + (datum.Component == "{x}" ? "{attribute_nomeclature[0]}" : "{attribute_nomeclature[1]}")'
        )
        .mark_boxplot(opacity=0.5, size=50)
        .encode(
            x="Value:Q",
            y=alt.Y(
                "attribute_with_label:N",
                sort=attr_color_domain,
                axis=alt.Axis(grid=True, tickBand="extent"),
            ),
            color=alt.Color(
                "attribute_with_label:N",
                scale=alt.Scale(domain=attr_color_domain, range=attr_color_range),
                sort=attr_color_domain
            ),
        )
        .transform_filter(brush)
        .properties(
            width=width, height=height,
        )
    )
    
    
    box_plot_single = (
        alt.Chart(df)
        .transform_fold([x, y], as_=["Component", "Value"])
        .transform_calculate(
            attribute_with_label=f'datum.{color_column} + " " + (datum.Component == "{x}" ? "{attribute_nomeclature[0]}" : "{attribute_nomeclature[1]}")'
        )
        .mark_boxplot(opacity=0.5, size=50)
        .encode(
            x="Value:Q",
            y=alt.Y(
                "attribute_with_label:N",
                sort=attr_color_domain,
                axis=alt.Axis(grid=True, tickBand="extent"),
            ),
            color=alt.Color(
                "attribute_with_label:N",
                scale=alt.Scale(domain=attr_color_domain, range=attr_color_range),
                sort=attr_color_domain
            ),
        ).properties(
            width=width_single, height=height_single,
        )
    )

    box_with_jitter = box_plot + gaussian_jitter
    box_with_jitter_single = box_plot_single + gaussian_jitter_single
    box_with_jitter_single_pr = box_with_jitter_single.configure_legend(
        orient="bottom",
        padding=5,
        labelLimit=200,
        # columns=5
    )
    
    gaussian_jitter_single_pr = gaussian_jitter_single.configure_legend(
        orient="bottom",
        padding=5,
        labelLimit=200,
        # columns=3
    )
    
    histogram_shade_single_pr = histogram_shade_single.configure_legend(
        orient="bottom",
        padding=5,
        labelLimit=200,
        # columns=3
    )
    
    scatter_plot_single_pr = scatter_plot_single.configure_legend(
        orient="bottom",
        padding=5,
        labelLimit=200,
        # columns=3
    )
    
    # Combine all plots into a 2x2 grid layout
    combined_chart = (
        alt.hconcat(
            alt.vconcat(scatter_plot, gaussian_jitter).resolve_scale(color="independent"),
            alt.vconcat(histogram_shade, box_with_jitter).resolve_scale(color="independent"),
        ).properties()
        .resolve_scale(color="independent")
        .configure_legend(
            orient="bottom", padding=5, labelLimit=200, 
            # columns=3
        )
    )

    return scatter_plot_single_pr, gaussian_jitter_single_pr, box_with_jitter_single_pr, histogram_shade_single_pr, combined_chart


def create_plotly_violin_plots(df, x="PCA_Component_1", y="PCA_Component_2", target="Class", base_colors = ["#66c2a5", "#fc8d62", "#8da0cb"]):
    """
    Create a subplot with violin plots for PCA components using Plotly.

    Parameters:
        df (pd.DataFrame): DataFrame containing PCA components and class information.
        x (str): Column name for the x-axis in the first violin plot.
        y (str): Column name for the y-axis in the second violin plot.
        target (str): Column name for the target class.

    Returns:
        fig (plotly.graph_objects.Figure): Figure object with the violin plots.
    """
    # Get unique class values in the target column
    unique_classes = df[target].unique()

    # Ensure color list matches number of classes
    color_sequence = base_colors[:len(unique_classes)]

    # Create subplots: 1 row, 2 columns
    fig = make_subplots(rows=1, cols=2, subplot_titles=(x, y))

    # First violin plot for PCA_Component_1 with custom colors
    fig_violin_1 = px.violin(df, y=x, color=target, box=True, points="all",
                             color_discrete_sequence=color_sequence)

    # Second violin plot for PCA_Component_2 with custom colors
    fig_violin_2 = px.violin(df, y=y, color=target, box=True, points="all",
                             color_discrete_sequence=color_sequence)

    # Add the traces from both violin plots into the subplots
    for trace in fig_violin_1.data:
        fig.add_trace(trace, row=1, col=1)

    for trace in fig_violin_2.data:
        fig.add_trace(trace, row=1, col=2)

    # Update layout to remove background and enhance visuals
    fig.update_layout(
        showlegend=False, 
        plot_bgcolor='rgba(0,0,0,0)',  # Transparent plot area background
        paper_bgcolor='rgba(0,0,0,0)'  # Transparent figure background
    )

    # Return the figure object for display or further manipulation
    return fig


def create_2Dinteractive_plots(
    df,
    x_axis="PCA_Component_1",
    y_axis="PCA_Component_2",
    target_numeric="Class2",
    target="Class",
    custom_colors_discrete = ["#66c2a5", "#fc8d62", "#8da0cb"]
):
    # Set the same x-axis range for both plots based on the data
    scale_1 = [df[x_axis].min() * 2, df[x_axis].max()]
    scale_2 = [df[y_axis].min() * 2, df[y_axis].max()]

    # Define custom colors
    custom_colors_continuous = px.colors.sequential.Tealgrn

    # Scatterplot setup (with custom colors and brushing functionality)
    scatter_inputs = dict(x=x_axis, y=y_axis, color=target, color_discrete_sequence=custom_colors_discrete)
    scatter_fig = px.scatter(df, **scatter_inputs)
    scatter_fig.update_layout(
        showlegend=True,
        legend_orientation="h",
        legend_yanchor="top",
        legend_y=1.1,
        legend_xanchor="center",
        legend_x=0.5
    )

    # Contour plot setup without legend
    contour_fig = px.density_contour(
        df,
        x=x_axis,
        y=y_axis,
        color=target,
        color_discrete_sequence=custom_colors_discrete,
        range_x=scale_1,
        range_y=scale_2,
    )
    contour_fig.update_layout(showlegend=False)

    # Density plot setup
    density_fig = px.density_heatmap(
        df,
        x=x_axis,
        y=y_axis,
        # color_continuous_scale=custom_colors_continuous,
        color_continuous_scale=[(0, "white"), (1, "black")],
    )
    density_fig.update_layout(showlegend=False)

    # Parallel coordinate plot setup without legend
    labels = {x_axis: x_axis, y_axis: y_axis}

    parallel_fig = px.parallel_coordinates(
        df,
        color=target_numeric,
        dimensions=[x_axis, y_axis],
        color_continuous_scale=custom_colors_continuous,
    )
    parallel_fig.update_layout(showlegend=False)

    # Hierarchical Clustering for Dendrogram
    linked = hierarchy.linkage(
        df[[x_axis, y_axis]], method="ward"
    )  # Adjust columns based on your needs

    # Create Dendrogram data
    dendro_data = hierarchy.dendrogram(linked, no_plot=True)

    # Create Dendrogram figure with custom color for lines
    dendro_fig = go.Figure()

    # Add lines for the dendrogram
    for i, d in zip(dendro_data["icoord"], dendro_data["dcoord"]):
        dendro_fig.add_trace(
            go.Scatter(x=i, y=d, mode="lines", line=dict(color="black", width=1))
        )

    # Add labels to the dendrogram
    for x, y, label in zip(
        dendro_data["icoord"], dendro_data["dcoord"], dendro_data["ivl"]
    ):
        dendro_fig.add_trace(
            go.Scatter(
                x=[x[1]], y=[y[1]], text=label, mode="text", textposition="top center"
            )
        )

    dendro_fig.update_layout(
        xaxis_title="Cluster", yaxis_title="Distance"
    )

    # Create FigureWidget objects for interactivity
    scatter_widget = go.FigureWidget(scatter_fig)
    contour_widget = go.FigureWidget(contour_fig)
    density_widget = go.FigureWidget(density_fig)
    parallel_widget = go.FigureWidget(parallel_fig)
    dendro_widget = go.FigureWidget(dendro_fig)

    # Function to update charts based on selected points in the scatter plot
    def update_charts(trace, points, selector):
        if points.point_inds:  # If some points are selected
            selected_inds = points.point_inds
            df_filtered = df.iloc[selected_inds]

            # Update Contour plot with custom colors
            contour_fig = px.density_contour(
                df_filtered, x=x_axis, y=y_axis, color=target,
                color_discrete_sequence=custom_colors_discrete
            )
            contour_fig.update_layout(showlegend=False)
            contour_widget.data = contour_fig.data
            contour_widget.layout = contour_fig.layout

            # Update Density plot with custom colors
            density_fig = px.density_heatmap(
                df_filtered,
                x=x_axis,
                y=y_axis,
                # color_continuous_scale=custom_colors_continuous,
                color_continuous_scale=[(0, "white"), (1, "black")],
                marginal_x="histogram",
                marginal_y="rug",
            )
            density_fig.update_layout(showlegend=False)
            density_widget.data = density_fig.data
            density_widget.layout = density_fig.layout

            # Update Parallel coordinate plot with custom colors
            parallel_fig = px.parallel_coordinates(
                df_filtered,
                color=target,
                labels=labels,
                color_continuous_scale=custom_colors_continuous,
            )
            parallel_fig.update_layout(showlegend=False)
            parallel_widget.data = parallel_fig.data
            parallel_widget.layout = parallel_fig.layout
        else:
            # If no points are selected, reset all charts
            reset_charts()

    # Function to reset charts to original data
    def reset_charts():
        contour_widget.data = contour_fig.data
        contour_widget.layout = contour_fig.layout

        density_widget.data = density_fig.data
        density_widget.layout = density_fig.layout

        parallel_widget.data = parallel_fig.data
        parallel_widget.layout = parallel_fig.layout

    # Attach event listener for selection in the scatter plot
    scatter_widget.data[0].on_selection(update_charts)

    # Displaying the charts using VBox and HBox layout for a clean grid structure
    top_row = widgets.HBox([scatter_widget, contour_widget])
    bottom_row = widgets.HBox([density_widget, parallel_widget])
    dendro_row = widgets.HBox([dendro_widget])

    grid_layout = widgets.VBox([top_row, bottom_row, dendro_row])

    return scatter_widget, contour_widget, density_widget, parallel_widget, dendro_widget, grid_layout

def create_outlier_plots(df, component_1, component_2, contamination=0.1):
    # Calculate Z-scores for both components
    df['Z1'] = (df[component_1] - df[component_1].mean()) / df[component_1].std()
    df['Z2'] = (df[component_2] - df[component_2].mean()) / df[component_2].std()

    # Identify outliers based on Z-scores
    df['Outlier_Z'] = np.where((np.abs(df['Z1']) > 3) | (np.abs(df['Z2']) > 3), 'Outlier', 'Normal')

    # Create Z-score outlier plot
    zscore_plot = alt.Chart(df).mark_circle(size=60).encode(
        x=f'{component_1}:Q',
        y=f'{component_2}:Q',
        color=alt.Color('Outlier_Z:N'),
        tooltip=[component_1, component_2, 'Outlier_Z']
    ).properties(
    )

    # Calculate IQR for component 1
    Q1 = df[component_1].quantile(0.25)
    Q3 = df[component_1].quantile(0.75)
    IQR = Q3 - Q1

    # Identify outliers based on IQR
    df['Outlier_IQR'] = np.where((df[component_1] < (Q1 - 1.5 * IQR)) | (df[component_1] > (Q3 + 1.5 * IQR)), 'Outlier', 'Normal')

    # Create IQR outlier plot
    iqr_plot = alt.Chart(df).mark_circle(size=60).encode(
        x=f'{component_1}:Q',
        y=f'{component_2}:Q',
        color=alt.Color('Outlier_IQR:N'),
        tooltip=[component_1, component_2, 'Outlier_IQR']
    ).properties(
    )

    # Fit the Isolation Forest model
    model = IsolationForest(contamination=contamination)
    df['Outlier_IF'] = model.fit_predict(df[[component_1, component_2]])

    # Map predictions to 'Outlier' and 'Normal'
    df['Outlier_IF'] = np.where(df['Outlier_IF'] == -1, 'Outlier', 'Normal')

    # Create Isolation Forest outlier plot
    if_plot = alt.Chart(df).mark_circle(size=60).encode(
        x=f'{component_1}:Q',
        y=f'{component_2}:Q',
        color=alt.Color('Outlier_IF:N'),
        tooltip=[component_1, component_2, 'Outlier_IF']
    ).properties(
    )

    # Combine plots into a grid layout
    grid_outlier_plot = alt.vconcat(
        alt.hconcat(zscore_plot, iqr_plot),
        alt.hconcat(if_plot)
    ).resolve_scale(color='independent')

    return grid_outlier_plot
