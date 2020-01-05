import numpy as np
from stl import mesh
from scipy import spatial

# original_mesh = mesh.Mesh.from_file("stl/3D_model_of_a_Cube.stl")
# point_cloud = mesh.Mesh.from_file("stl/3D_model_of_a_Cube_deformed.stl")

original_mesh = mesh.Mesh.from_file("stl/good-stanford-davsan.stl")
point_cloud = mesh.Mesh.from_file("stl/bad-stanford-davsan-bended.stl")

mesh_node_coordinates = np.around(np.unique(original_mesh.vectors.reshape([original_mesh.vectors.size//3, 3]), axis=0), 2)
mesh_node_ids = number_list = [x for x in range(len(mesh_node_coordinates))]
point_cloud_coordinates = np.around(np.unique(point_cloud.vectors.reshape([point_cloud.vectors.size//3, 3]), axis=0), 2)
print("Mesh coordinates are:", mesh_node_coordinates.tolist())
print("Point Cloud Coordinates are:", point_cloud_coordinates.tolist())
print("\n")

# Generate KD-tree
tree = spatial.KDTree(point_cloud_coordinates)

tolerance = 0.2
processed_node_count = 0
ignored_node_count = 0
maximum_distance_magnitude = None
maximum_distance_node_id = None

# Calculate displacement
for mesh_node_index in range(len(mesh_node_coordinates)):
    distance, point_cloud_index = tree.query(mesh_node_coordinates[mesh_node_index])

    if maximum_distance_magnitude is None:
        maximum_distance_magnitude = distance

    if maximum_distance_node_id is None:
        maximum_distance_node_id = mesh_node_ids[mesh_node_index]

    if distance > maximum_distance_magnitude:
        maximum_distance_magnitude = distance
        maximum_distance_node_id = mesh_node_index

    if not distance > tolerance:
        # print("actual node's id: " + str(mesh_node_ids[mesh_node_index]))
        # print("actual node's coordinates: " + str(mesh_node_coordinates[mesh_node_index]))
        # print("closest node's coordinates: " + str(point_cloud_coordinates[point_cloud_index]))
        displacement_vector = [point_cloud_coordinates[point_cloud_index][0] - mesh_node_coordinates[mesh_node_index][0],
                               point_cloud_coordinates[point_cloud_index][1] - mesh_node_coordinates[mesh_node_index][1],
                               point_cloud_coordinates[point_cloud_index][2] - mesh_node_coordinates[mesh_node_index][2]]
        # print("distance: " + str(displacement_vector))
        processed_node_count += 1

    else:
        # print("actual node's id: " + str(mesh_node_ids[mesh_node_index]))
        # print("with distance: " + str(distance) + " is ignored!")
        ignored_node_count += 1

print("total amount of mesh nodes: " + str(len(mesh_node_ids)))
print("processed nodes: " + str(processed_node_count))
print("ignored nodes: " + str(ignored_node_count))
print("percentage: %" + str(round(100*float(processed_node_count)/len(mesh_node_ids), 2)))
print("node with maximum distance magnitude: " + str(maximum_distance_node_id))
print("maximum distance magnitude: " + str(maximum_distance_magnitude))
    # print(distance)

