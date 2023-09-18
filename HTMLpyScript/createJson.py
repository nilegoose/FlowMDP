types = ['Boxplot', 'Histogram', 'Density plot', 'Bubble plot', 'Scatterplot', 'Violin plot', 'Area plot', 'Line plot', '2D density plot', 'Stacked Area plot', 'Streamgraph', 'Ridgeline', 'Heatmap', 'Dendrogram', 'Barplot', 'Donut chart', 'Piechart', 'Treemap', 'Parallel coordinates', 'Radar chart', 'Sankey diagram', 'Circular packing', 'Venn diagram', 'Sunburst', 'Network', 'Chord', 'Arc diagram']
dimensions=["1D", "2D", "3D", "HD"]
attributes=['One Numeric', 'Two Numeric', 'Three Numeric', 'Several Numeric', 'One Categorical', 'Several Categorical', 'One Num, One Cat', 'One Cat, Several Num', 'Several Cat, One Num']
encoding=['Position', 'Point', 'Color', 'Line', 'Size(area)', 'Angle', 'Shape', 'Length']


sum_list = dimensions + attributes + types + encoding

import json

link_s=[0, 0, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5, 6, 6, 6, 6, 6, 6, 6, 7, 7, 7, 7, 7, 7, 7, 7, 7, 8, 8, 8, 8, 8, 8, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 27, 31, 32, 37, 16, 17, 37, 39, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 13, 14, 20, 24, 26, 27, 31, 32, 33, 37, 38, 39, 15, 16, 18, 19, 21, 22, 23, 24, 28, 29, 30, 32, 33, 34, 36, 38, 39, 28, 29, 36, 17, 13, 14, 18, 27, 36, 11]
link_t=[4, 8, 5, 9, 10, 6, 9, 11, 12, 7, 9, 11, 12, 14, 15, 13, 14, 15, 17, 18, 19, 20, 21, 13, 16, 18, 19, 20, 22, 23, 13, 18, 19, 20, 22, 23, 24, 25, 26, 25, 27, 28, 29, 30, 34, 17, 25, 26, 27, 31, 32, 33, 35, 36, 37, 38, 39, 13, 14, 15, 18, 24, 25, 28, 29, 30, 34, 13, 17, 18, 19, 20, 21, 22, 23, 25, 27, 31, 32, 33, 13, 17, 18, 25, 26, 27, 30, 31, 32, 33, 34, 36, 37, 38, 39, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 41, 41, 41, 41, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 44, 44, 44, 44, 44, 44, 44, 44, 44, 44, 44, 44, 44, 44, 44, 44, 44, 45, 45, 45, 46, 47, 47, 47, 47, 47, 16]

data_length = len(link_s)
value_list = [2, 6, 8, 3, 9, 7, 2, 8, 3, 9, 11, 13, 15] + [1] * 168
list3 = []
for i in range(0, data_length):
    list3.append(dict(source = link_s[i], target = link_t[i], value = value_list[i]))

# nodes
list1 =[]
for x in sum_list:
    list1.append(dict(name = x))
dict2 = dict(nodes=list1, links=list3)
s = json.dumps(dict2, indent="\t")
print(s)

#chart counts
dim_count = [8, 15, 10, 22]
abstract_count = [2, 8, 7, 9, 6, 12, 10, 14, 15]
dict(zip(attributes, abstract_count))
dict(zip(dimensions, dim_count))