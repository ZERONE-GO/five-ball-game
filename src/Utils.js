class PriorityArray {

    constructor() {
        this.list = new Array();
    }

    push(item) {
        this.list.push(item);
        this.list.sort((a, b) => {
            return b.priority - a.priority;
        });
    }

    pop() {
        return this.list.pop();
    }

    isEmpty() {
        return this.list.length === 0;
    }

}

function estimateCost(pos, dest, size) {
    return Math.abs(Math.floor(pos / size) - Math.floor(dest / size)) + Math.abs(pos % size - dest % size);
}

function createItem(pos, dest, parent, real, size) {
    let estimate = estimateCost(pos, dest, size);

    return {
        priority: real + estimate,
        real: real,
        estimate: estimate,
        pos: pos,
        parent: parent
    };
}

export function validPath(pos, dest, size, grid) {
    let priorityArray = new PriorityArray();
    let map = new Array(size * size);
    let access = false;

    let item = createItem(pos, dest, -1, 0, size);
    priorityArray.push(item);

    while (!priorityArray.isEmpty()) {
        let node = priorityArray.pop();
        map[node.pos] = node;

        if (node.pos === dest) {
            access = true;
            break;
        }

        // row
        [1, -1].forEach(shift => {
            let row = node.pos + shift;
            if (row >= 0 && row < size * size && (Math.floor(row / size) === Math.floor(node.pos / size))) {
                if (!map[row] && grid[row] === 0) {
                    priorityArray.push(createItem(row, dest, node.pos, node.real + 1, size));
                }
            }
        });

        //col
        [size, -size].forEach(shift => {
            let col = node.pos + shift;
            if (col >= 0 && col < size * size && (col % size === node.pos % size)) {
                if (!map[col] && grid[col] === 0) {
                    priorityArray.push(createItem(col, dest, node.pos, node.real + 1, size));
                }
            }
        });
    }

    let path = new Array();
    if (access) {
        let end = map[dest].pos;

        while (end !== pos) {
            path.push(end);
            end = map[end].parent;
        }
    }

    return {
        access: access,
        path: path
    };
}