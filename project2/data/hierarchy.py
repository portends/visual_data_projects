import csv


def get_parent(path):
    index = path.rfind('|')
    if index == -1:
        parent = "root"
    else:
        parent = path[0:index]
    return parent


def get_child(path):
    index = path.rfind('|')
    if index == -1:
        return path
    else:
        return path[index+1:-1]


def add_path(path, count, heirarchy, data):
    parent = get_parent(path)
    child = get_child(path)
    #  check if parent is not in heirachy
    if parent == "root":
        data.append([path, child, count])
        heirarchy[path] = count
        return data, heirarchy
    if parent not in heirarchy:
        # add parent to heirarchy
        data, heirarchy = add_path(parent, 0, heirarchy, data)
    data.append([path, child, count])
    heirarchy[path] = count
    return data, heirarchy


def filesFromFolder(path, out_file):
    header = ["classification", "name", "count"]
    data = [["root", "", 0]]
    heirarchy = {"root": 0}
    with open(path) as f:
        f_reader = csv.DictReader(f)

        for rows in f_reader:
            classification = rows["classification"]
            count = rows["count"]
            data, heirarchy = add_path(classification, count, heirarchy, data)

    with open(out_file, 'w', newline="") as file:
        csv_writer = csv.writer(
            file, delimiter=',', quotechar='"', quoting=csv.QUOTE_MINIMAL)
        csv_writer.writerow(header)
        csv_writer.writerows(data)


filesFromFolder("paths.csv", "hierarchy.csv")
