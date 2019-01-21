class PriorityArray {
    constructor() {
        this.list = [];
    }

    push(pos, dest, parent, real, estimate, size) {
        let item = this.createItem(pos, dest, parent, real, estimate, size);
        this.list.push(item);
        this.list.sort((a, b) => {
            return b.priority - a.priority;
        });
    }

    createItem(pos, dest, parent, real, estimate, size) {
        return {
            priority: real + estimate,
            real: real,
            estimate: estimate,
            pos: pos,
            parent: parent
        };
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

export function findPath(pos, dest, size, grid) {
    let priorityArray = new PriorityArray();
    let map = new Array(size * size);
    let access = false;

    let estimate = estimateCost(pos, dest, size);
    priorityArray.push(pos, dest, -1, 0, estimate, size);

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
                    estimate = estimateCost(row, dest, size);
                    priorityArray.push(row, dest, node.pos, node.real + 1, estimate, size);
                }
            }
        });

        //col
        [size, -size].forEach(shift => {
            let col = node.pos + shift;
            if (col >= 0 && col < size * size && (col % size === node.pos % size)) {
                if (!map[col] && grid[col] === 0) {
                    estimate = estimateCost(col, dest, size);
                    priorityArray.push(col, dest, node.pos, node.real + 1, estimate, size);
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

function randomPiece() {
    return Math.floor(1 + Math.random() * 7);
}

export function randomBalls() {
    return [randomPiece(), randomPiece(), randomPiece()];
}

export function randomPositions(grid, balls, size) {
    let empty = size * size - balls;
    let seeds = [Math.floor(1 + Math.random() * empty), Math.floor(1 + Math.random() * (empty - 1)), Math.floor(1 + Math.random() * (empty - 2))];

    return seeds.map(seed => {
        for (var i = 0; i < grid.length; i++) {
            if (grid[i] === 0 && --seed === 0) {
                return i;
            }
        }
    });
}

export function calculateScore(balls) {
    let score = 5;
    balls = balls - 5;

    while (balls > 0) {
        score += (1 << balls);
        balls--;
    }

    return score;
}

export function calculateBalls(grid, dest, size) {
    const result = Array(4);

    // row
    result[0] = Array();
    [1, -1].forEach(shift => {
        let row = dest + shift;
        while (row >= 0 && row < size * size && (Math.floor(row / size) === Math.floor(dest / size))) {
            if (grid[row] === grid[dest]) {
                result[0].push(row);
                row = row + shift;
            } else {
                break;
            }
        }
    });

    //col 
    result[1] = Array();
    [size, -size].forEach(shift => {
        let col = dest + shift;
        while (col >= 0 && col < size * size && (col % size === dest % size)) {
            if (grid[col] === grid[dest]) {
                result[1].push(col);
                col = col + shift;
            } else {
                break;
            }
        }
    });

    //left
    result[2] = Array();
    [size + 1, -1 - size].forEach(shift => {
        let left = dest + shift;
        while (left >= 0 && left < size * size && (Math.abs(Math.floor(left / size) - Math.floor((left - shift) / size)) === 1)) {
            if (grid[left] === grid[dest]) {
                result[2].push(left);
                left = left + shift;
            } else {
                break;
            }
        }
    });

    //right
    result[3] = Array();
    [size - 1, 1 - size].forEach(shift => {
        let right = dest + shift;
        while (right >= 0 && right < size * size && (Math.abs(Math.floor(right / size) - Math.floor((right - shift) / size)) === 1)) {
            if (grid[right] === grid[dest]) {
                result[3].push(right);
                right = right + shift;
            } else {
                break;
            }
        }
    });

    return result;
}